import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthContext from "../AuthContext";
import GlobalApiState from "../utilis/globalVariable";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddPaymentModal from "../components/Payment/AddPaymentModel";
import clinicLogo from "../assets/clinic.jpg";

function BillingPage() {
  const { patientId } = useParams();
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const [bill, setBill] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handlePaymentAdded = (updatedBilling) => {
    setBill(updatedBilling);
  };

  const fetchBilling = async () => {
    try {
      const res = await fetch(
        `${GlobalApiState.DEV_BASE_LIVE}/api/bill/${patientId}`
      );
      const data = await res.json();

      if (!data.bill) {
        toast.info("No bill found. Redirecting to generate bill...");
        setTimeout(() => navigate(`/patient-preview/${patientId}`), 1500);
      } else {
        setBill(data.bill);
        setPayments(data.payments || []);
      }
      setLoading(false);
    } catch {
      toast.error("Failed to load billing");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBilling();
  }, []);

  if (loading)
    return (
      <div className="p-10 text-center text-gray-600">
        Loading billing details...
      </div>
    );

  if (!bill)
    return (
      <div className="p-10 text-center text-gray-600">
        Redirecting to generate bill...
      </div>
    );

  return (
    <>
      <ToastContainer />

      <div className="flex justify-center mt-6">
        <div
          id="print-area"
          className="w-full max-w-4xl p-8 bg-white shadow-lg"
        >
          <div className="flex flex-col items-start justify-between pb-4 mb-6 border-b border-gray-200 md:flex-row md:items-center">
            {/* Left: Clinic Identity */}
            <div className="flex items-start gap-4 mb-4 md:mb-0">
              <div className="p-2 bg-white border border-gray-100 rounded-lg shadow-sm">
                <img
                  src={clinicLogo}
                  alt="Farhad Clinic Logo"
                  className="object-contain w-16 h-16 md:w-18 md:h-18"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
                  Farhad Clinic
                </h1>
                <p className="mt-1 text-sm font-medium text-red-700">
                  Diagnostic & Laboratory Services
                </p>
                <p className="mt-1 text-xs font-light text-gray-500">
                  Excellence in Healthcare Since 1995
                </p>
              </div>
            </div>

            {/* Right: Contact Information */}
            <div className="text-right">
              <div className="inline-block text-left md:text-right">
                <div className="mb-2">
                  <p className="text-sm font-semibold tracking-wide text-gray-900">
                    674-A Peoples Colony No 1
                  </p>
                  <p className="text-sm text-gray-700">
                    Near Faisal Hospital, Faisalabad, Pakistan
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-end gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <p className="text-sm font-medium text-gray-900">
                      041-5383830
                    </p>
                  </div>


                </div>
              </div>
            </div>
          </div>


          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            {/* <div>
              <p>
                <strong>Patient Name:</strong> {bill.patientName}
              </p>
              <p>
                <strong>Patient ID:</strong> {bill.patient}
              </p>
            </div> */}
            <div className="text-center">
              <p>
                <strong>Invoice No:</strong> {bill.bill_no}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(bill.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className="font-semibold">{bill.status}</span>
              </p>
            </div>
          </div>

          {/* ===== Bill Items ===== */}
          <table className="w-full text-sm border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">#</th>
                <th className="p-2 text-left border">Test Name</th>
                <th className="p-2 text-right border">Price</th>
              </tr>
            </thead>
            <tbody>
              {bill.items.map((item, index) => (
                <tr key={item.testId}>
                  <td className="p-2 text-center border">{index + 1}</td>
                  <td className="p-2 border">{item.test_name}</td>
                  <td className="p-2 text-right border">{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ===== Summary ===== */}
          <div className="flex justify-end mt-6">
            <div className="p-4 text-sm border w-72">
              <div className="flex justify-between py-1">
                <span>Total Amount</span>
                <span>{bill.totalAmount}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Paid</span>
                <span>{bill.paidAmount}</span>
              </div>
              <div className="flex justify-between py-2 mt-2 font-bold border-t">
                <span>Balance</span>
                <span>{bill.balanceAmount}</span>
              </div>
            </div>
          </div>

          {/* ===== Payment History (SCREEN ONLY) ===== */}
          {payments.length > 0 && (
            <div className="mt-6 no-print">
              <h3 className="mb-2 font-semibold">Payment History</h3>
              <table className="w-full text-sm border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border">Date</th>
                    <th className="p-2 text-right border">Amount</th>
                    <th className="p-2 text-right border">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p._id}>
                      <td className="p-2 border">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-2 text-right border">{p.amount}</td>
                      <td className="p-2 text-right border">{p.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}


        </div>
      </div>

      {/* ===== ACTION BUTTONS (NO PRINT) ===== */}
      <div className="flex justify-end max-w-4xl gap-4 mx-auto mt-4 no-print">
        <button
          onClick={() => setShowPaymentModal(true)}
          className="px-5 py-2 text-white bg-green-600 rounded hover:bg-green-700"
        >
          Add Payment
        </button>

        <button
          onClick={() => window.print()}
          className="px-5 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Print Invoice
        </button>
      </div>

      {showPaymentModal && (
        <AddPaymentModal
          billing={bill}
          onClose={() => setShowPaymentModal(false)}
          onPaymentAdded={handlePaymentAdded}
        />
      )}
    </>
  );

}

export default BillingPage;
