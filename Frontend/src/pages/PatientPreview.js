// import React, { useContext, useEffect, useRef, useState } from 'react';
// import AuthContext from '../AuthContext';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useNavigate, useParams } from 'react-router-dom';
// import html2canvas from 'html2canvas';
// import { jsPDF } from 'jspdf';
// import { IoArrowBackSharp } from "react-icons/io5";
// import GlobalApiState from '../utilis/globalVariable';

// export default function PatientPreview() {
//     const authContext = useContext(AuthContext);
//     const [units, setAllUnits] = useState([]);
//     const today = new Date().toISOString().split("T")[0];
//     const [loading, setLoading] = useState(false);

//     const [patients, setPatients] = useState({
//         userId: authContext.user,
//         patient_name: "",
//         refer_by: "",
//         patient_age: "",
//         lab_no: "",
//         specimen: "",
//         patient_bill: "",
//         date: today,
//         test_type: [],
//         result: "",
//     });

//     const params = useParams();
//     const navigate = useNavigate();
//     const componentRef = useRef();

//     const MAX_TESTS_PER_PAGE = 15;

//     const downloadReport = () => {
//         const pages = document.getElementsByClassName('page');
//         const pdf = new jsPDF('p', 'mm', 'a4');
//         let promises = [];

//         Array.from(pages).forEach((page, index) => {
//             promises.push(
//                 html2canvas(page, { scale: 2 }).then((canvas) => {
//                     const imgData = canvas.toDataURL('image/png');
//                     const pdfWidth = pdf.internal.pageSize.getWidth();
//                     const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

//                     if (index > 0) pdf.addPage();
//                     pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
//                 })
//             );
//         });

//         Promise.all(promises)
//             .then(() => pdf.save('patient-report.pdf'))
//             .catch((error) => console.error('Error generating PDF:', error));
//     };


//     useEffect(() => {
//         const fetchData = async () => {
//             setLoading(true);

//             try {
//                 const testResponse = await fetch(`${GlobalApiState.DEV_BASE_LIVE}/api/test/listing_test/${authContext.user}`);
//                 const testData = await testResponse.json();

//                 const options = testData.map((item) => ({
//                     test_name: item.test_name,
//                     min_value: item.min_value,
//                     max_value: item.max_value,
//                     price: item.price,
//                     unit: item.unit,
//                     id: item._id,
//                     subtests: item.subtests || [],
//                 }));


//                 if (params.id) {
//                     const patientResponse = await fetch(`${GlobalApiState.DEV_BASE_LIVE}/api/patient/edit_patient/${params.id}`);
//                     const patientData = await patientResponse.json();
//                     const formattedDate = new Date(patientData.date).toISOString().split("T")[0];


//                     const selectedTests = patientData.test_type.map(test => {
//                         const matchedOption = options.find(option => option.id === test.test);

//                         if (matchedOption) {
//                             return {
//                                 ...matchedOption,
//                                 result: test.result || "",
//                                 subtests: matchedOption.subtests
//                                     .map(subtest => {
//                                         if (test.subtests && Array.isArray(test.subtests)) {
//                                             const matchedSubtest = test.subtests.find(st => st.subtest === subtest._id);
//                                             return matchedSubtest
//                                                 ? { ...subtest, result: matchedSubtest.result || "" }
//                                                 : null;
//                                         }
//                                         return null;
//                                     })
//                                     .filter(Boolean),
//                             };
//                         }
//                         return null;
//                     }).filter(Boolean);

//                     setPatients({
//                         ...patientData,
//                         date: formattedDate,
//                         test_type: selectedTests
//                     });

//                     const unitResponse = await fetch(`${GlobalApiState.DEV_BASE_LIVE}/api/unit/listing_unit/${authContext.user}`);
//                     const unitData = await unitResponse.json();
//                     setAllUnits(unitData);
//                 }
//             } catch (error) {
//                 console.error("Failed to load data:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, [params.id]);

//     const pages = [];
//     for (let i = 0; i < patients.test_type.length; i += MAX_TESTS_PER_PAGE) {
//         pages.push(patients.test_type.slice(i, i + MAX_TESTS_PER_PAGE));
//     }


//     return (
//         <>
//             <div>
//                 <button onClick={() => { navigate("/") }}><IoArrowBackSharp color='grey' size={'28px'} /></button>
//             </div>
//             {loading ? (
//                 <div className='spinner-container '>
//                     <div className='spinner'></div>
//                 </div>
//             ) : (
//                 <div className="flex items-center justify-center flex-col w-[76vw] min-h-[100vh]">
//                     <div ref={componentRef} id="capture">
//                         {pages.map((pageTests, pageIndex) => (
//                             <div key={pageIndex} className="A4-page page">
//                                 <div>
//                                     {/* <h1 className="text-2xl font-bold text-center text-red-600">Farhad Clinic</h1>
//                                     <p className="text-sm text-center text-gray-600">674-A Peoples Colony No. 1, Near Faisal Hospital, Faisalabad, Pakistan</p>
//                                     <p className="text-sm text-center text-gray-600">Ph: 041-5383830, 0300-7903294</p> */}

//                                     <div className="mt-24">
//                                         <div className="flex justify-between text-sm">
//                                             <div>
//                                                 <p><strong>Patient Name:</strong> {patients.patient_name}</p>
//                                                 <p><strong>Age:</strong> {patients.patient_age}</p>
//                                                 <p><strong>Ref. By:</strong> {patients.refer_by}</p>
//                                             </div>
//                                             <div className="text-right">
//                                                 <p><strong>Lab Number:</strong> {patients.lab_no}</p>
//                                                 <p><strong>Date:</strong> {patients.date}</p>
//                                                 <p><strong>Specimen:</strong> {patients.specimen}</p>
//                                             </div>
//                                         </div>

//                                         <h3 className="mt-6 text-lg font-semibold text-center text-gray-800">HAEMATOLOGY</h3>

//                                         <table className="w-full mt-4 text-left">
//                                             <thead>
//                                                 <tr className="border-t border-b border-gray-300">
//                                                     <th className="px-4 py-2 font-semibold text-gray-900">Test</th>
//                                                     <th className="px-4 py-2 font-semibold text-gray-900">Result</th>
//                                                     <th className="px-4 py-2 font-semibold text-gray-900">Normal Range</th>
//                                                     <th className="px-4 py-2 font-semibold text-gray-900">Unit</th>
//                                                 </tr>
//                                             </thead>
//                                             <tbody>
//                                                 {pageTests.map((test, index) => {
//                                                     const matchedUnit = units.find((unit) => unit._id === test.unit?._id);
//                                                     const unitAbb = matchedUnit ? matchedUnit.unit_abb : "N/A";

//                                                     return (
//                                                         <React.Fragment key={test.id}>
//                                                             {/* Main Test Row */}
//                                                             <tr className="">
//                                                                 <td className="px-4 font-semibold">{test.test_name}</td>
//                                                                 <td className="px-4">{test.subtests?.length > 0 ? "" : test.result || "Pending"}</td>
//                                                                 <td className="px-4">{test.subtests?.length > 0 ? "" : `${test.min_value} - ${test.max_value}`}</td>
//                                                                 <td className="px-4">{test.subtests?.length > 0 ? "" : unitAbb}</td>
//                                                             </tr>

//                                                             {/* Subtests Rows (If Any) */}
//                                                             {test.subtests?.map((subtest) => (
//                                                                 <tr key={subtest._id}>
//                                                                     <td className="px-4 pl-8 text-gray-700">-{subtest.test_name}</td>
//                                                                     <td className="px-4">{subtest.result || "Pending"}</td>
//                                                                     <td className="px-4">{subtest.min_value} - {subtest.max_value}</td>
//                                                                     <td className="px-4">{unitAbb}</td>
//                                                                 </tr>
//                                                             ))}
//                                                         </React.Fragment>
//                                                     );
//                                                 })}
//                                             </tbody>
//                                         </table>

//                                     </div>
//                                 </div>

//                                 {/* <div className="mt-auto text-sm text-center text-red-600">
//                                     <p className='text-[14px] font-normal'>This report is only for management purpose. Not valid for any court Law.</p>
//                                     <hr className="my-2 border-red-600 w-[94%] " />
//                                     <div className='flex items-center justify-between px-4 pr-14'>
//                                         <p className='text-[16px] font-medium'>Mr.Mian Umar Farooq</p>
//                                         <p className='text-[16px] font-medium'>Lab Incharge</p>
//                                     </div>
//                                 </div> */}
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}



//             <div className='absolute right-[5%] top-[95px]'>
//                 <button onClick={downloadReport} className='p-3 text-white bg-red-700 rounded-md'>Download</button>
//             </div>
//         </>
//     );
// }
import React, { useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { IoArrowBackSharp } from "react-icons/io5";
import GlobalApiState from "../utilis/globalVariable";
import { toast, ToastContainer } from "react-toastify";
import clinicLogo from "../assets/clinic.jpg";

export default function PatientPreview() {
  const authContext = useContext(AuthContext);
  const params = useParams();
  const navigate = useNavigate();
  const componentRef = useRef();

  const today = new Date().toISOString().split("T")[0];

  const [loading, setLoading] = useState(false);
  const [units, setUnits] = useState([]);
  const [patients, setPatients] = useState({
    userId: authContext.user,
    patient_name: "",
    refer_by: "",
    patient_age: "",
    lab_no: "",
    specimen: "",
    date: today,
    test_type: [],
  });

  // Track generated bill
  const [bill, setBill] = useState(null);
  const [generating, setGenerating] = useState(false);

  /* ===================== PRINT FUNCTION ===================== */
  const printReport = () => {
    const printContents = document.getElementById("capture").innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = `
      <html>
        <head>
          <style>
            @page { size: A4; margin: 20mm; }
            body { font-family: Arial, sans-serif; }
            .A4-page { page-break-after: always; width: 210mm; min-height: 297mm; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 6px; }
          </style>
        </head>
        <body>${printContents}</body>
      </html>`;

    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  /* ===================== GENERATE BILL ===================== */
  const generateBill = async () => {
    if (!patients._id) return;

    setGenerating(true);
    try {
      const res = await fetch(
        `${GlobalApiState.DEV_BASE_LIVE}/api/bill/generate/${patients._id}`,
        {
          method: "POST", headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userID: authContext.user
          })
        }

      );
      const data = await res.json();

      if (res.ok) {
        toast.success("Bill generated successfully!");
        setBill(data.bill);
        // Redirect to billing page
        navigate(`/billing/${patients._id}`);
      } else {
        toast.error(data.message || "Failed to generate bill");
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  /* ===================== DATA FETCH ===================== */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const testRes = await fetch(
          `${GlobalApiState.DEV_BASE_LIVE}/api/test/listing_test/${authContext.user}`
        );
        const testData = await testRes.json();

        const unitRes = await fetch(
          `${GlobalApiState.DEV_BASE_LIVE}/api/unit/listing_unit/${authContext.user}`
        );
        const unitData = await unitRes.json();
        setUnits(unitData);

        if (params.id) {
          const patientRes = await fetch(
            `${GlobalApiState.DEV_BASE_LIVE}/api/patient/edit_patient/${params.id}`
          );
          const patientData = await patientRes.json();
          const selectedTests = await Promise.all(
            patientData.test_type.map(async (pt) => {
              const masterTest = testData.find((t) => t._id === pt.test);
              if (!masterTest) return null;

              if (masterTest.type === "simple") {
                return {
                  id: masterTest._id,
                  test_name: masterTest.test_name,
                  type: "simple",
                  result: pt.result || "Pending",
                  min_value: masterTest.min_value,
                  max_value: masterTest.max_value,
                  unit: masterTest.unit,
                };
              }

              const subRes = await fetch(
                `${GlobalApiState.DEV_BASE_LIVE}/api/test/${masterTest._id}/subtests`
              );
              const subtests = await subRes.json();
              return {
                id: masterTest._id,
                test_name: masterTest.test_name,
                type: "group",
                subtests: subtests
                  .map((sub) => {
                    const matchedSub = pt.subtests.find(
                      (s) => s.subtest === sub._id
                    );
                    if (!matchedSub) return null;
                    return {
                      ...sub,
                      result: matchedSub.result || "Pending",
                    };
                  })
                  .filter(Boolean),
              };
            })
          );

          setPatients({
            ...patientData,
            date: new Date(patientData.date).toISOString().split("T")[0],
            test_type: selectedTests.filter(Boolean),
          });
        }
      } catch (error) {
        console.error("Error loading preview:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id, authContext.user]);

  /* ===================== PAGINATION ===================== */
  // const simpleTests = patients.test_type.filter((t) => t.type === "simple");
  // const groupSubtests = patients.test_type
  //   .filter((t) => t.type === "group")
  //   .flatMap((group) =>
  //     group.subtests.map((sub) => ({
  //       ...sub,
  //       parentTestName: group.test_name,
  //     }))
  //   );

  // const pages = [];
  // if (simpleTests.length > 0) pages.push(simpleTests);
  // groupSubtests.forEach((subtest) => pages.push([subtest]));
  /* ===================== PAGINATION ===================== */

  const ROWS_PER_PAGE = 18;

  // 1️⃣ Simple tests → single page
  const simpleTests = patients.test_type.filter(t => t.type === "simple");

  // 2️⃣ Group tests → chunk subtests per test
  const groupPages = patients.test_type
    .filter(t => t.type === "group")
    .flatMap(group => {
      const pages = [];

      for (let i = 0; i < group.subtests.length; i += ROWS_PER_PAGE) {
        pages.push({
          type: "group",
          parentTestName: group.test_name,
          tests: group.subtests.slice(i, i + ROWS_PER_PAGE),
        });
      }

      return pages;
    });

  // 3️⃣ Final pages array
  const pages = [];

  if (simpleTests.length > 0) {
    pages.push({
      type: "simple",
      tests: simpleTests,
    });
  }

  pages.push(...groupPages);

  /* ===================== RENDER ===================== */
  return (
    <>
      <ToastContainer />

      <button onClick={() => navigate("/")} className="p-2">
        <IoArrowBackSharp size={28} />
      </button>

      {loading ? (
        <div className="spinner-container">Loading...</div>
      ) : (
        <div className="flex justify-center w-[76vw] bg-gray-100 py-6">
          <div ref={componentRef} id="capture">
            {pages.map((page, index) => {
              // const isSimplePage = pageTests[0].type === "simple";
              const isSimplePage = page.type === "simple";

              return (
                <div
                  key={index}
                  className="px-10 py-8 mx-auto my-6 bg-white shadow-lg A4-page flex flex-col justify-between min-h-[29.7cm]"
                >
                  {/* ===== Header ===== */}
                  <table className="w-full pb-4 mb-6 border-b border-gray-200">
                    <tbody>
                      <tr>
                        {/* LEFT SIDE */}
                        <td className="w-1/2 align-top">
                          <div className="flex items-start gap-3">
                            <img
                              src={clinicLogo}
                              alt="Farhad Clinic Logo"
                              className="object-contain w-14 h-14"
                            />

                            <div>
                              <h1 className="text-2xl font-bold text-gray-900">
                                Farhad Clinic
                              </h1>
                              <p className="text-sm font-semibold text-red-700">
                                Diagnostic & Laboratory Services
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* RIGHT SIDE */}
                        <td className="w-1/2 text-right align-top">
                          <p className="text-sm font-semibold text-gray-900">
                            674-A Peoples Colony No 1
                          </p>
                          <p className="text-sm text-gray-700">
                            Near Faisal Hospital, Faisalabad, Pakistan
                          </p>

                          <div className="flex items-center justify-end gap-2 mt-2">
                            {/* Phone Icon */}
                            <svg
                              className="w-4 h-4 text-gray-600"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>

                            <p className="text-sm font-medium text-gray-900">
                              041-5383830
                            </p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>


                  {/* ===== Table ===== */}
                  <div className="mb-auto">
                    {!isSimplePage && (
                      <h2 className="mb-2 text-lg font-bold text-center uppercase">
                        {page.parentTestName}
                      </h2>
                    )}


                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="border-y bg-gray-50">
                          <th className="px-2 py-2 font-semibold text-left">Test</th>
                          <th className="px-2 py-2 font-semibold text-center">Result</th>
                          <th className="px-2 py-2 font-semibold text-center">Normal Range</th>
                          <th className="px-2 py-2 font-semibold text-center">Unit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isSimplePage
                          ? page.tests.map((test, idx) => {
                            const unitAbb =
                              units.find(u => u._id === test.unit?._id)?.unit_abb || "N/A";

                            return (
                              <tr key={test.id} className="border-b">
                                <td className="px-2 py-2">{test.test_name}</td>
                                <td className="px-2 py-2 font-medium text-center">{test.result}</td>
                                <td className="px-2 py-2 text-center">
                                  {test.min_value} – {test.max_value}
                                </td>
                                <td className="px-2 py-2 text-center">{unitAbb}</td>
                              </tr>
                            );
                          })
                          : page.tests.map(sub => {
                            const unitAbb =
                              units.find(u => u._id === sub.unit?._id)?.unit_abb || "N/A";

                            return (
                              <tr key={sub._id} className="border-b">
                                <td className="px-2 py-2">{sub.test_name}</td>
                                <td className="px-2 py-2 font-medium text-center">{sub.result}</td>
                                <td className="px-2 py-2 text-center">
                                  {sub.min_value} – {sub.max_value}
                                </td>
                                <td className="px-2 py-2 text-center">{unitAbb}</td>
                              </tr>
                            );
                          })}

                      </tbody>
                    </table>
                  </div>

                  {/* ===== Footer ===== */}
                  <div className="flex items-center justify-between pt-4 mt-6 text-xs text-gray-600 border-t border-gray-300">
                    <div className="text-left">
                      <p>Dr. Mian Umar Farooq</p>
                    </div>

                    <div className="flex-1 text-center">
                      <p className="text-[10px] text-red-600">
                        This report is only for management purpose. Not valid for any court of Law.
                      </p>
                    </div>

                    <div className="text-right">
                      <p>Lab Incharge</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      )}

      {/* Print & Generate Bill Buttons */}
      <div className="fixed flex flex-col gap-3 top-24 right-10">
        <button
          onClick={printReport}
          className="p-3 text-white bg-red-700 rounded"
        >
          Print
        </button>

        {!bill && (
          <button
            onClick={generateBill}
            disabled={generating}
            className={`p-3 text-white bg-blue-700 rounded ${generating ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {generating ? "Generating..." : "Generate Bill"}
          </button>
        )}
      </div>
    </>
  );
}
