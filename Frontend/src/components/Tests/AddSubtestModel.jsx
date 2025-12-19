import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef, useState } from "react";
import { toast } from "react-toastify";
import GlobalApiState from "../../utilis/globalVariable";

export default function AddSubtestModal({ open, onClose, groupId, handlePageUpdate, units, userID }) {
  const cancelButtonRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    test_name: "",
    min_value: "",
    max_value: "",
    unit: "",
    price: "",
  });

  const addSubtest = async () => {
    if (!form.test_name) return toast.error("Subtest name is required");

    try {
      setLoading(true);
      const res = await fetch(`${GlobalApiState.DEV_BASE_LIVE}/api/test/subtest/${groupId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, userID }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }

      toast.success("Subtest added successfully");
      handlePageUpdate();
      onClose();
      setForm({ test_name: "", min_value: "", max_value: "", unit: "", price: "" });
    } catch (err) {
      toast.error(err.message || "Failed to add subtest");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={onClose}>
        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50" />
        <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white rounded-lg shadow-xl">
            
            {/* Header */}
            <div className="px-6 py-4 border-b">
              <Dialog.Title className="text-lg font-semibold text-gray-800">Add Subtest</Dialog.Title>
              <p className="text-xs text-gray-500">Fill in subtest details below</p>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block mb-1 text-xs font-medium text-gray-600">Subtest Name</label>
                <input
                  className="w-full px-3 py-2 text-sm border rounded focus:ring-2 focus:ring-blue-500"
                  value={form.test_name}
                  onChange={(e) => setForm({ ...form, test_name: e.target.value })}
                  placeholder="Enter subtest name"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-xs font-medium text-gray-600">Min Value</label>
                  <input
                    className="w-full px-3 py-2 text-sm border rounded focus:ring-2 focus:ring-blue-500"
                    value={form.min_value}
                    onChange={(e) => setForm({ ...form, min_value: e.target.value })}
                    placeholder="Min"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-xs font-medium text-gray-600">Max Value</label>
                  <input
                    className="w-full px-3 py-2 text-sm border rounded focus:ring-2 focus:ring-blue-500"
                    value={form.max_value}
                    onChange={(e) => setForm({ ...form, max_value: e.target.value })}
                    placeholder="Max"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-xs font-medium text-gray-600">Unit</label>
                <select
                  className="w-full px-3 py-2 text-sm border rounded focus:ring-2 focus:ring-blue-500"
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                >
                  <option value="">Select unit</option>
                  {units.map((u) => (
                    <option key={u._id} value={u._id}>{u.unit_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 text-xs font-medium text-gray-600">Price</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 text-sm border rounded focus:ring-2 focus:ring-blue-500"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="Enter price"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t rounded-b-lg bg-gray-50">
              <button ref={cancelButtonRef} onClick={onClose} className="px-4 py-2 text-xs font-semibold text-gray-600 border rounded hover:bg-gray-100">Cancel</button>
              <button
                onClick={addSubtest}
                disabled={loading}
                className={`px-4 py-2 text-xs font-semibold text-white rounded ${loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"}`}
              >
                {loading ? "Saving..." : "Add Subtest"}
              </button>
            </div>

          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
