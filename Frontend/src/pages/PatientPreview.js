import React, { useContext, useEffect, useRef, useState } from 'react';
import AuthContext from '../AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';

export default function PatientPreview() {
    const authContext = useContext(AuthContext);
    const [units, setAllUnits] = useState([]);
    const today = new Date().toISOString().split("T")[0];

    const [patients, setPatients] = useState({
        userId: authContext.user,
        patient_name: "",
        refer_by: "",
        patient_age: "",
        lab_no: "",
        specimen: "",
        date: today,
        test_type: [],
        result: "",
    });
    // const todaysDate = patients.date.toISOString.split('T')[0]

    const params = useParams();
    const navigate = useNavigate();
    const componentRef = useRef();

    useEffect(() => {
        if (params.id) {
            fetch(`http://localhost:4000/api/patient/edit_patient/${params.id}`)
                .then((response) => response.json())
                .then((data) => {
                    const formattedDate = new Date(data.date).toISOString().split("T")[0]
                    setPatients({
                        ...data,
                        date: formattedDate,
                    });
                })
                .catch((err) => console.error("Failed to load patient data:", err));

            fetch(`http://localhost:4000/api/unit/listing_unit/${authContext.user}`)
                .then((response) => response.json())
                .then((data) => {
                    setAllUnits(data);
                })
                .catch((err) => console.log(err));
        }

    }, [params.id]);

    return (
        <div className="flex items-center justify-center w-[80vw] min-h-[100vh] bg-gray-100">
            <div ref={componentRef} className="A4-page ">
                <div className="">
                    <h1 className="text-2xl font-bold text-center text-red-600">Farhad Clinic</h1>
                    <p className="text-center text-sm text-gray-600">674-A Peoples Colony No. 1, Near Faisal Hospital, Faisalabad, Pakistan</p>
                    <p className="text-center text-sm text-gray-600">Ph: 041-5383830, 0300-7903294</p>

                    <div className="mt-8">
                        <div className="flex justify-between text-sm">
                            <div>
                                <p><strong>Patient Name:</strong> {patients.patient_name}</p>
                                <p><strong>Age:</strong> {patients.patient_age}</p>
                                <p><strong>Ref. By:</strong> {patients.refer_by}</p>
                            </div>
                            <div className="text-right">
                                <p><strong>Lab Number:</strong> {patients.lab_no}</p>
                                <p><strong>Date:</strong> {patients.date}</p>
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
                                {patients.test_type.map((test, index) => (
                                    <tr key={index} className="text-gray-700">
                                        <td className="px-4 ">{test.test.test_name}</td>
                                        <td className="px-4 ">{test.result}</td>
                                        <td className="px-4 ">
                                            {test.test.min_value} - {test.test.max_value}
                                        </td>
                                        <td className="px-4 ">
                                            {/* {units.find((unit)=>unit._id === test.test.unit)?.name} */}
                                            <td className="px-4">
                                                {(() => {
                                                    const matchedUnit = units.find((unit) => {
                                                        return unit._id === test.test.unit;
                                                    });
                                                    return matchedUnit ? matchedUnit.unit_abb : "N/A";
                                                })()}
                                            </td>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <ToastContainer />

                    {/* Footer Section at the Bottom */}

                </div>
                <div className="text-center text-red-600 text-sm mt-auto">
                    <p className='text-[14px] font-normal'>This report is only for management purpose. Not valid for any court Law.</p>
                    <hr className="my-2 border-red-600 w-[94%] " />
                    <div className='flex items-center justify-between px-4 pr-14'>
                        <p className='text-[16px] font-medium'>Mr.Mian Umar Farooq</p>
                        <p className='text-[16px] font-medium'>Lab Incharge</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
