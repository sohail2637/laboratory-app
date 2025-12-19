import { useEffect, useState } from "react";
import GlobalApiState from "../../utilis/globalVariable";
import { toast } from "react-toastify";

export default function EditGroupTestForm({ group, units, onClose , handlePageUpdate }) {
  const [name, setName] = useState(group.test_name || "");
  const [loading, setLoading] = useState(false);

  const saveGroup = async () => {
    try {
      setLoading(true);
      await fetch(
        `${GlobalApiState.DEV_BASE_LIVE}/api/test/group/${group._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ test_name: name }),
        }
      );

      toast.success("Group updated successfully");
      handlePageUpdate()
      onClose();
    } catch (err) {
      toast.error("Failed to update group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <h3 className="pb-2 mb-6 text-lg font-semibold text-gray-800 border-b">
        Edit Group Test
      </h3>

      {/* Group Name */}
      <div className="mb-5">
        <label className="block mb-1 text-xs font-medium text-gray-600">
          Group Name
        </label>
        <input
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter group test name"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          onClick={onClose}
          className="px-4 py-2 text-xs font-semibold text-gray-600 border rounded hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          onClick={saveGroup}
          disabled={loading}
          className={`px-4 py-2 text-xs font-semibold text-white rounded
            ${loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {loading ? "Saving..." : "Save Group"}
        </button>
      </div>
    </div>
  );
}
