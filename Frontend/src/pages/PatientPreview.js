import React, { useContext, useEffect, useRef, useState } from 'react';
import AuthContext from '../AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { IoArrowBackSharp } from "react-icons/io5";

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

    const params = useParams();
    const navigate = useNavigate();
    const componentRef = useRef();

    const MAX_TESTS_PER_PAGE = 15; 

    const downloadReport = () => {
        debugger
        const pages = document.getElementsByClassName('page'); 
        const pdf = new jsPDF('p', 'mm', 'a4');
        let promises = [];
      
        Array.from(pages).forEach((page, index) => {
          promises.push(
            html2canvas(page, { scale: 2 }).then((canvas) => {
              const imgData = canvas.toDataURL('image/png');
              const pdfWidth = pdf.internal.pageSize.getWidth();
              const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
              if (index > 0) pdf.addPage(); 
              pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            })
          );
        });
      
        // Wait for all pages to be rendered before saving
        Promise.all(promises)
          .then(() => pdf.save('patient-report.pdf'))
          .catch((error) => console.error('Error generating PDF:', error));
      };
      

    useEffect(() => {
        if (params.id) {
            fetch(`http://localhost:4000/api/patient/edit_patient/${params.id}`)
                .then((response) => response.json())
                .then((data) => {
                    const formattedDate = new Date(data.date).toISOString().split("T")[0];
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

    const pages = [];
    for (let i = 0; i < patients.test_type.length; i += MAX_TESTS_PER_PAGE) {
        pages.push(patients.test_type.slice(i, i + MAX_TESTS_PER_PAGE));
    }

    return (
        <>
            <div>
                <button onClick={() => { navigate("/") }}><IoArrowBackSharp color='grey' size={'28px'} /></button>
            </div>

            <div className="flex items-center justify-center flex-col w-[62vw] min-h-[100vh]">
                <div ref={componentRef} id="capture">
                    {pages.map((pageTests, pageIndex) => (
                        <div key={pageIndex} className="A4-page page">
                            <div>
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
                                            {pageTests.map((test, index) => (
                                                <tr key={index} className="text-gray-700">
                                                    <td className="px-4">{test.test.test_name}</td>
                                                    <td className="px-4">{test.result}</td>
                                                    <td className="px-4">
                                                        {test.test.min_value} - {test.test.max_value}
                                                    </td>
                                                    <td className="px-4">
                                                        {(() => {
                                                            const matchedUnit = units.find((unit) => unit._id === test.test.unit);
                                                            return matchedUnit ? matchedUnit.unit_abb : "N/A";
                                                        })()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
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
                    ))}
                </div>
            </div>

            <div className='absolute right-[5%] top-[95px]'>
                <button onClick={downloadReport} className='bg-red-700 text-white p-3 rounded-md'>Download</button>
            </div>
        </>
    );
}
