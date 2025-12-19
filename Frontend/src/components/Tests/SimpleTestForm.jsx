import { useContext, useState } from 'react';
import AuthContext from '../../AuthContext';
import GlobalApiState from '../../utilis/globalVariable';
import { toast } from 'react-toastify';

export default function SimpleTestForm({ units, onSuccess , onClose }) {
     const authContext = useContext(AuthContext);
 
    const [data, setData] = useState({
    test_name: '',
    min_value: '',
    max_value: '',
    unit: '',
    price: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const submit = async () => {
    if (!data.test_name.trim() || !data.unit || !data.price) {
      toast('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await fetch(`${GlobalApiState.DEV_BASE_LIVE}/api/test/add-test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, type: 'simple'  , userID: authContext.user,
})
      });
      onSuccess();
      onClose()
    } catch (error) {
      console.error('Error saving test:', error);
      toast('Failed to save test. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Test Name */}
      <div>
        <label className="block mb-1 text-xs font-medium text-gray-700">
          Test Name *
        </label>
        <input
          type="text"
          placeholder="e.g., Complete Blood Count"
          value={data.test_name}
          onChange={e => handleChange('test_name', e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Min / Max */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block mb-1 text-xs text-gray-600">
            Minimum Value
          </label>
          <input
            type="number"
            step="0.01"
            placeholder="0.00"
            value={data.min_value}
            onChange={e => handleChange('min_value', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 text-xs text-gray-600">
            Maximum Value
          </label>
          <input
            type="number"
            step="0.01"
            placeholder="0.00"
            value={data.max_value}
            onChange={e => handleChange('max_value', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Unit */}
      <div>
        <label className="block mb-1 text-xs font-medium text-gray-700">
          Measurement Unit *
        </label>
        <select
          value={data.unit}
          onChange={e => handleChange('unit', e.target.value)}
          className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select a unit</option>
          {units.map(u => (
            <option key={u._id} value={u._id}>
              {u.unit_name} {u.symbol ? `(${u.symbol})` : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Price */}
      <div>
        <label className="block mb-1 text-xs font-medium text-gray-700">
          Price *
        </label>
        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={data.price}
          onChange={e => handleChange('price', e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          Enter the cost of this test
        </p>
      </div>

      {/* Hidden submit for parent */}
      <button id="test-form-submit" className="hidden" onClick={submit} />

      {/* Save Button */}
      <button
        onClick={submit}
        disabled={loading}
        className="flex items-center justify-center w-full gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save Simple Test'}
      </button>
    </div>
  );
}
