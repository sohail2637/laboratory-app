import React, { useContext, useEffect, useRef, useState } from 'react';
import AuthContext from '../../AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { IoArrowBackSharp } from "react-icons/io5";

export default function PatientPreviewDownload({ patients, units }) {
    const authContext = useContext(AuthContext);
    const today = new Date().toISOString().split("T")[0];
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const componentRef = useRef();

    const MAX_TESTS_PER_PAGE = 15;
   
    useEffect(() => {
        if (patients && units) {
            setLoading(false);
        }
    }, [patients, units]);
   

    return (
        <>
          
            {loading ? (
                <div className='spinner-container '>
                    <div className='spinner'></div>
                </div>
            ) : (
                    <div ref={componentRef} id="capture">
                        <div className="A4-page page">
                            <div>
                                {/* <h1 className="text-[25px] font-bold text-center text-red-600">Farhad Clinic</h1>
                                <p className="text-center text-sm text-gray-600">674-A Peoples Colony No. 1, Near Faisal Hospital, Faisalabad, Pakistan</p>
                                <p className="text-center text-sm text-gray-600">Ph: 041-5383830, 0300-7903294</p> */}

                                <div className="mt-24">
                                    <div className="flex justify-between text-sm">
                                        <div>
                                            <p><strong>Patient Name:</strong> {patients.patient_name}</p>
                                            <p><strong>Age:</strong> {patients.patient_age}</p>
                                            <p><strong>Ref. By:</strong> {patients.refer_by}</p>
                                        </div>
                                        <div className="text-right">
                                            <p><strong>Lab Number:</strong> {patients.lab_no}</p>
                                            <p><strong>Date:</strong> {today}</p>
                                            <p><strong>Specimen:</strong> {patients.specimen}</p>
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-semibold mt-6 text-center text-gray-800">HAEMATOLOGY</h3>

                                   <table className="w-full text-left mt-4">
                                            <thead>
                                                <tr className="border-t border-b border-gray-300">
                                                    <th className="px-4 py-2 font-semibold text-gray-900">Test</th>
                                                    <th className="px-4 py-2 font-semibold text-gray-900">Result</th>
                                                    <th className="px-4 py-2 font-semibold text-gray-900">Normal Range</th>
                                                    <th className="px-4 py-2 font-semibold text-gray-900">Unit</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {patients.test_type.map((test, index) => {
                                                    if (test.selectedSubtests?.length > 0) {
                                                        return test.selectedSubtests.map((subtest) => (
                                                            <tr key={subtest._id}>
                                                                <td className='px-4'>{subtest.test_name}</td>
                                                                <td className='px-4'>{subtest.result || "Pending"}</td>
                                                                <td className="px-4">{subtest.min_value} - {subtest.max_value}</td>
                                                                <td className="px-4">
                                                             {(() => {
                                                                const matchedUnit = units.find((unit) => unit._id === test.unit._id);
                                                                return matchedUnit ? matchedUnit.unit_abb : "N/A";
                                                            })()}
                                                        </td>
                                                            </tr>
                                                        ));
                                                    } else {
                                                        return (
                                                            <tr key={test.id}>
                                                                <td className='px-4'>{test.test_name}</td>
                                                                <td className='px-4'>{test.result || "Pending"}</td>
                                                                <td className='px-4'>{test.min_value} - {test.max_value}</td>
                                                                <td className="px-4">
                                                                {(() => {
                                                                const matchedUnit = units.find((unit) => unit._id === test.unit._id);
                                                                return matchedUnit ? matchedUnit.unit_abb : "N/A";
                                                            })()}
                                                            </td>
                                                            </tr>
                                                        )
                                                    }
                                                }

                                                )}

                                            </tbody>
                                        </table>
                                </div>
                            </div>

                            {/* <div className="text-center text-red-600 text-sm mt-auto">
                                <p className='text-[14px] font-normal'>This report is only for management purpose. Not valid for any court Law.</p>
                                <hr className="my-2 border-red-600 w-[94%] " />
                                <div className='flex items-center justify-between px-4 pr-14'>
                                    <p className='text-[16px] font-medium'>Mr.Mian Umar Farooq</p>
                                    <p className='text-[16px] font-medium'>Lab Incharge</p>
                                </div>
                            </div> */}
                        </div>
                        
                </div>
            )}
        </>
    );
}
