import React, { useContext, useEffect, useRef, useState } from 'react';
import AuthContext from '../AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { IoArrowBackSharp } from "react-icons/io5";
import GlobalApiState from '../utilis/globalVariable';

export default function PatientPreview() {
    const authContext = useContext(AuthContext);
    const [units, setAllUnits] = useState([]);
    const today = new Date().toISOString().split("T")[0];
    const [loading, setLoading] = useState(false);

    const [patients, setPatients] = useState({
        userId: authContext.user,
        patient_name: "",
        refer_by: "",
        patient_age: "",
        lab_no: "",
        specimen: "",
        patient_bill: "",
        date: today,
        test_type: [],
        result: "",
    });

    const params = useParams();
    const navigate = useNavigate();
    const componentRef = useRef();

    const MAX_TESTS_PER_PAGE = 15;

    const downloadReport = () => {
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

        Promise.all(promises)
            .then(() => pdf.save('patient-report.pdf'))
            .catch((error) => console.error('Error generating PDF:', error));
    };


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                const testResponse = await fetch(`${GlobalApiState.DEV_BASE_LIVE}/api/test/listing_test/${authContext.user}`);
                const testData = await testResponse.json();

                const options = testData.map((item) => ({
                    test_name: item.test_name,
                    min_value: item.min_value,
                    max_value: item.max_value,
                    price: item.price,
                    unit: item.unit,
                    id: item._id,
                    subtests: item.subtests || [],
                }));


                if (params.id) {
                    const patientResponse = await fetch(`${GlobalApiState.DEV_BASE_LIVE}/api/patient/edit_patient/${params.id}`);
                    const patientData = await patientResponse.json();
                    const formattedDate = new Date(patientData.date).toISOString().split("T")[0];


                    const selectedTests = patientData.test_type.map(test => {
                        const matchedOption = options.find(option => option.id === test.test);

                        if (matchedOption) {
                            return {
                                ...matchedOption,
                                result: test.result || "",
                                subtests: matchedOption.subtests
                                    .map(subtest => {
                                        if (test.subtests && Array.isArray(test.subtests)) {
                                            const matchedSubtest = test.subtests.find(st => st.subtest === subtest._id);
                                            return matchedSubtest
                                                ? { ...subtest, result: matchedSubtest.result || "" }
                                                : null;
                                        }
                                        return null;
                                    })
                                    .filter(Boolean),
                            };
                        }
                        return null;
                    }).filter(Boolean);

                    setPatients({
                        ...patientData,
                        date: formattedDate,
                        test_type: selectedTests
                    });

                    const unitResponse = await fetch(`${GlobalApiState.DEV_BASE_LIVE}/api/unit/listing_unit/${authContext.user}`);
                    const unitData = await unitResponse.json();
                    setAllUnits(unitData);
                }
            } catch (error) {
                console.error("Failed to load data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
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
            {loading ? (
                <div className='spinner-container '>
                    <div className='spinner'></div>
                </div>
            ) : (
                <div className="flex items-center justify-center flex-col w-[76vw] min-h-[100vh]">
                    <div ref={componentRef} id="capture">
                        {pages.map((pageTests, pageIndex) => (
                            <div key={pageIndex} className="A4-page page">
                                <div>
                                    {/* <h1 className="text-2xl font-bold text-center text-red-600">Farhad Clinic</h1>
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
                                                {pageTests.map((test, index) => {
                                                    const matchedUnit = units.find((unit) => unit._id === test.unit?._id);
                                                    const unitAbb = matchedUnit ? matchedUnit.unit_abb : "N/A";

                                                    return (
                                                        <React.Fragment key={test.id}>
                                                            {/* Main Test Row */}
                                                            <tr className="">
                                                                <td className="px-4 font-semibold">{test.test_name}</td>
                                                                <td className="px-4">{test.subtests?.length > 0 ? "" : test.result || "Pending"}</td>
                                                                <td className="px-4">{test.subtests?.length > 0 ? "" : `${test.min_value} - ${test.max_value}`}</td>
                                                                <td className="px-4">{test.subtests?.length > 0 ? "" : unitAbb}</td>
                                                            </tr>

                                                            {/* Subtests Rows (If Any) */}
                                                            {test.subtests?.map((subtest) => (
                                                                <tr key={subtest._id}>
                                                                    <td className="px-4 pl-8 text-gray-700">-{subtest.test_name}</td>
                                                                    <td className="px-4">{subtest.result || "Pending"}</td>
                                                                    <td className="px-4">{subtest.min_value} - {subtest.max_value}</td>
                                                                    <td className="px-4">{unitAbb}</td>
                                                                </tr>
                                                            ))}
                                                        </React.Fragment>
                                                    );
                                                })}
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
                        ))}
                    </div>
                </div>
            )}



            <div className='absolute right-[5%] top-[95px]'>
                <button onClick={downloadReport} className='bg-red-700 text-white p-3 rounded-md'>Download</button>
            </div>
        </>
    );
}
