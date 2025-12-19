import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import GlobalApiState from "../../utilis/globalVariable";
import AuthContext from "../../AuthContext";

function AddPaymentModal({ billing, onClose, onPaymentAdded }) {
  const [amount, setAmount] = useState(billing.balanceAmount);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const authContext = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || amount <= 0) {
      return toast.error("Enter a valid amount");
    }

    if (amount > billing.balanceAmount) {
      return toast.error("Amount cannot exceed balance");
    }

    setLoading(true);
    try {
      const res = await fetch(`${GlobalApiState.DEV_BASE_LIVE}/api/payment/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userID :authContext.user,
          billingId: billing._id,
          amount,
          paymentMethod,
          note,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Payment failed");

      toast.success("Payment added successfully");
      onPaymentAdded(data.billing);
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h3 className="mb-4 text-lg font-bold">Add Payment</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Amount</label>
            <input
              type="number"
              value={amount}
              max={billing.balanceAmount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Balance available: {billing.balanceAmount}
            </p>
          </div>

          {/* <div>
            <label className="block mb-1 text-sm font-medium">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            >
              <option>Cash</option>
              <option>Card</option>
              <option>Online</option>
            </select>
          </div> */}

          <div>
            <label className="block mb-1 text-sm font-medium">Note (Optional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
            >
              {loading ? "Processing..." : "Add Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPaymentModal;
