import { useState } from "react";
import { toast } from "react-toastify";
import GlobalApiState from "../../utilis/globalVariable";

export default function EditSimpleTestForm({ test, units, onClose , handlePageUpdate }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    test_name: test.test_name || "",
    min_value: test.min_value || "",
    max_value: test.max_value || "",
    unit: test.unit?._id || test.unit || "",
    price: test.price || "",
  });

  const updateTest = async () => {
    try {
      setLoading(true);
      await fetch(
        `${GlobalApiState.DEV_BASE_LIVE}/api/test/update_test/${test._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      toast.success("Test updated successfully");
      handlePageUpdate()
      onClose();
    } catch (err) {
      toast.error("Failed to update test");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <h3 className="pb-2 mb-6 text-lg font-semibold text-gray-800 border-b">
        Edit Test
      </h3>

      {/* Test Name */}
      <div className="mb-4">
        <label className="block mb-1 text-xs font-medium text-gray-600">
          Test Name
        </label>
        <input
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={form.test_name}
          onChange={(e) =>
            setForm({ ...form, test_name: e.target.value })
          }
          placeholder="e.g. Blood Sugar (Fasting)"
        />
      </div>

      {/* Min / Max */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block mb-1 text-xs font-medium text-gray-600">
            Min Value
          </label>
          <input
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={form.min_value}
            onChange={(e) =>
              setForm({ ...form, min_value: e.target.value })
            }
            placeholder="Min"
          />
        </div>

        <div>
          <label className="block mb-1 text-xs font-medium text-gray-600">
            Max Value
          </label>
          <input
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={form.max_value}
            onChange={(e) =>
              setForm({ ...form, max_value: e.target.value })
            }
            placeholder="Max"
          />
        </div>
      </div>

      {/* Unit */}
      <div className="mb-4">
        <label className="block mb-1 text-xs font-medium text-gray-600">
          Unit
        </label>
        <select
          className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={form.unit}
          onChange={(e) =>
            setForm({ ...form, unit: e.target.value })
          }
        >
          <option value="">Select unit</option>
          {units.map((u) => (
            <option key={u._id} value={u._id}>
              {u.unit_name}
            </option>
          ))}
        </select>
      </div>

      {/* Price */}
      <div className="mb-6">
        <label className="block mb-1 text-xs font-medium text-gray-600">
          Price
        </label>
        <input
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          type="number"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
          placeholder="Enter price"
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
          onClick={updateTest}
          disabled={loading}
          className={`px-4 py-2 text-xs font-semibold text-white rounded
            ${loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
