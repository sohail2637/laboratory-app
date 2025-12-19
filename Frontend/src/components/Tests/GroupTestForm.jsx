import { useContext, useState } from 'react';
import SubtestRow from './SubtestRow';
import AuthContext from '../../AuthContext';
import GlobalApiState from '../../utilis/globalVariable';
import { toast } from 'react-toastify';

export default function GroupTestForm({ units, onSuccess, onClose }) {
  const authContext = useContext(AuthContext);

  const [groupName, setGroupName] = useState('');
  const [subtests, setSubtests] = useState([{
     test_name: '',
    min_value: '',
    max_value: '',
    unit: '',
    price: '',
  }]);
  const [loading, setLoading] = useState(false);

  const addSubtest = () => {
    setSubtests(prev => [...prev, {}]);
  };
  const removeSubtest = (index) => {
    setSubtests(prev => prev.filter((_, i) => i !== index));
  };

  const updateSubtest = (index, data) => {
    const copy = [...subtests];
    copy[index] = data;
    setSubtests(copy);
  };

  const submit = async () => {
    if (!groupName.trim() || subtests.length === 0){
      toast.error("Please fill input fields")
      return
    };

    try {
      setLoading(true);
      const groupRes = await fetch(
        `${GlobalApiState.DEV_BASE_LIVE}/api/test/add-test`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            test_name: groupName,
            type: "group",
            userID: authContext.user,
          }),
        }
      );

      const groupData = await groupRes.json();

      if (!groupData?.result?._id) {
        throw new Error("Failed to create group test");
      }

      for (const s of subtests) {
        await fetch(`${GlobalApiState.DEV_BASE_LIVE}/api/test/add-test`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            test_name: s.test_name,
            min_value: s.min_value,
            max_value: s.max_value,
            unit: s.unit,
            price: s.price,
            type: "subtest",
            parent: groupData.result._id,
            userID: authContext.user,
          }),
        });
      }
      onSuccess();
      onClose()
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Group Name */}
      <div className='mb-3'>
        <label className="block mb-1 text-xs font-medium text-gray-700">
          Group Test Name *
        </label>
        <input
          type="text"
          value={groupName}
          onChange={e => setGroupName(e.target.value)}
          placeholder="e.g. Complete Blood Count (CBC)"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Subtests */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-gray-700">
            Subtests
          </label>
          <button
            type="button"
            onClick={addSubtest}
            className="px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50"
          >
            + Add Subtest
          </button>
        </div>

        {subtests.length === 0 && (
          <div className="p-3 text-xs text-center text-gray-500 border border-dashed rounded-md bg-gray-50">
            No subtests added yet
          </div>
        )}

        <div className="space-y-2">
          {subtests.map((_, i) => (
            <div
              key={i}
              className="p-3 bg-white border border-gray-200 rounded-md"
            >
              <SubtestRow
                units={units}
                onChange={data => updateSubtest(i, data)}
                onRemove={() => removeSubtest(i)}

              />
            </div>
          ))}
        </div>
      </div>

      {/* Action */}
      <div className="flex justify-end pt-2">
        <button
          onClick={submit}
          disabled={loading}
          className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Save Group Test'}
        </button>
      </div>
    </div>
  );
}
