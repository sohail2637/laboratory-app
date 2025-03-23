import React from "react";

const PatientTestBill = ({ patients }) => {

    return (
        <div className="w-[210mm] h-[297mm] mx-auto p-12 bg-white shadow-lg rounded-lg border border-gray-300 text-gray-800">
            <h2 className="text-3xl font-bold mb-8 text-center">Patient Bill</h2>
            <p className="text-xl font-semibold text-center pb-3">Patient: {patients.patient_name}</p>

            <div className="mt-6">
                <table className="w-full border-collapse border border-gray-300">
                    {/* Table Head */}
                    <thead className="bg-gray-100">
                        <tr className="text-left">
                            <th className="border border-gray-300 px-4 py-2">Test Name</th>
                            <th className="border border-gray-300 px-4 py-2">Price</th>
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody>
                        {patients.test_type.map((test, index) => (
                            <React.Fragment key={index}>
                                {/* Main Test Row (Only show if no subtests exist) */}
                                {(!test.selectedSubtests || test.selectedSubtests.length === 0) && (
                                    <tr className="font-semibold text-lg">
                                        <td className="border border-gray-300 px-4 py-2">{test.test_name}</td>
                                        <td className="border border-gray-300 px-4 py-2">{test.price || 0}</td>
                                    </tr>
                                )}

                                {/* Subtests Rows (if any) */}
                                {test.selectedSubtests?.length > 0 && (
                                    test.selectedSubtests.map((subtest) => (
                                        <tr key={subtest._id} className="text-gray-700 font-semibold text-lg">
                                            <td className="border border-gray-300 px-4 py-2">{subtest.test_name}</td>
                                            <td className="border border-gray-300 px-4 py-2">{subtest.price || 0}</td>
                                        </tr>
                                    ))
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>

                </table>
            </div>


            {/* Grand Total Calculation */}
            <div className="mt-8 pt-6 flex justify-between text-2xl font-bold text-gray-900">
                <span>Grand Total:</span>
                <span>
                    {patients.test_type.reduce((total, test) => {
                        if (test.selectedSubtests?.length > 0) {
                            return total + test.selectedSubtests.reduce((subSum, subtest) => subSum + (subtest.price || 0), 0);
                        }
                        return total + (test.price || 0);
                    }, 0)}
                </span>
            </div>

        </div>


    );
};

export default PatientTestBill;
