import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef, useState } from "react";
import { toast } from "react-toastify";
import GlobalApiState from "../../utilis/globalVariable";

export default function EditSubtestModal({
  open,
  onClose,
  subtest,
  units,
  handlePageUpdate,
}) {
  const cancelButtonRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    test_name: subtest.test_name || "",
    min_value: subtest.min_value || "",
    max_value: subtest.max_value || "",
    unit: subtest.unit?._id || subtest.unit || "",
    price: subtest.price || "",
  });

  const updateSubtest = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${GlobalApiState.DEV_BASE_LIVE}/api/test/subtest/${subtest._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }

      toast.success("Subtest updated successfully");
      handlePageUpdate();
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to update subtest");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={onClose}
      >
        {/* Overlay */}
        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50" />

        <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white rounded-lg shadow-xl">

            {/* Header */}
            <div className="px-6 py-4 border-b">
              <Dialog.Title className="text-lg font-semibold text-gray-800">
                Edit Subtest
              </Dialog.Title>
              <p className="text-xs text-gray-500">
                Update subtest details below
              </p>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4">

              {/* Subtest Name */}
              <div>
                <label className="block mb-1 text-xs font-medium text-gray-600">
                  Subtest Name
                </label>
                <input
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={form.test_name}
                  onChange={(e) =>
                    setForm({ ...form, test_name: e.target.value })
                  }
                  placeholder="Enter subtest name"
                />
              </div>

              {/* Min / Max */}
              <div className="grid grid-cols-2 gap-3">
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
              <div>
                <label className="block mb-1 text-xs font-medium text-gray-600">
                  Unit
                </label>
                <select
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              <div>
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
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t rounded-b-lg bg-gray-50">
              <button
                ref={cancelButtonRef}
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-gray-600 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={updateSubtest}
                disabled={loading}
                className={`px-4 py-2 text-xs font-semibold text-white rounded
                  ${
                    loading
                      ? "bg-blue-300"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>

          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
