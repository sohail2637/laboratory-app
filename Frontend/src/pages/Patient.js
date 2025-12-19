import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import AuthContext from '../AuthContext';
import { ToastContainer } from 'react-toastify';
import DeletePatient from '../components/Patients/DeletePatient';
import { FiDownload } from "react-icons/fi";
import PatientPreviewDownload from '../components/Patients/PatientPreviewDownload';
import PatientTestBill from '../components/Patients/PatientTestBill';
import ReactDOMServer from 'react-dom/server';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import GlobalApiState from '../utilis/globalVariable';

function Patient() {
    const authContext = useContext(AuthContext);
const navigate = useNavigate()
    const [showCatalogueModal, setCatalogueModal] = useState(false);
    const [showDeleteModal, setDeleteModal] = useState(false);
    const [patient, setAllPatient] = useState([]);
    const [singlePatient, setSinglePatient] = useState([]);
    const [updatePage, setUpdatePage] = useState(true);
    const [nameSearchTerm, setNameSearchTerm] = useState("");
    const [referSearchTerm, setReferSearchTerm] = useState("");
    const [labNumber, setLabNumber] = useState("");
    const [phoneSearchTerm, setPhoneSearchTerm] = useState(null);

    const addCatalogueModel = () => {
        setCatalogueModal(!showCatalogueModal);
    };
    const deleteModel = () => {
        setDeleteModal(!showDeleteModal);
    };
    const handlePageUpdate = () => {
        setUpdatePage(!updatePage);
    };
    const filterPatient = patient.filter((element) => {

        if (!nameSearchTerm.trim() && !referSearchTerm.trim() && !phoneSearchTerm && !labNumber.trim()) {
            return true;
        }

        const matchedName = nameSearchTerm && element.patient_name.toLowerCase().includes(nameSearchTerm.toLowerCase());
        const matchedReferBy = referSearchTerm && element.refer_by.toLowerCase().includes(referSearchTerm.toLowerCase());
        const matchLabNumber = labNumber && element.lab_no.toLowerCase().includes(labNumber.toLowerCase());
        const matchedPhone = phoneSearchTerm && element.phone_number.toString().includes(phoneSearchTerm);

        return matchedName || matchedReferBy || matchedPhone || matchLabNumber;
    });




    const fetchCatalogeData = () => {
        fetch(`${GlobalApiState.DEV_BASE_LIVE}/api/patient/listing_patient/${authContext.user}`)
            .then((response) => response.json())
            .then((data) => {
                setAllPatient(data);
            })
            .catch((err) => console.log(err));
    };
    const fetchSinglePatientData = (id) => {
        fetch(`${GlobalApiState.DEV_BASE_LIVE}/api/patient/edit_patient/${id}`)
            .then((response) => response.json())
            .then((data) => {
                setSinglePatient(data);
            })
            .catch((err) => console.log(err));
    };


    const fetchData = async (patientId) => {
        const [testResponse, patientResponse, unitResponse] = await Promise.all([
            fetch(`${GlobalApiState.DEV_BASE_LIVE}/api/test/listing_test/${authContext.user}`).then(res => res.json()),
            fetch(`${GlobalApiState.DEV_BASE_LIVE}/api/patient/edit_patient/${patientId}`).then(res => res.json()),
            fetch(`${GlobalApiState.DEV_BASE_LIVE}/api/unit/listing_unit/${authContext.user}`).then(res => res.json())
        ]);

        // Process test data
        const testOptions = testResponse.map(item => ({
            test_name: item.test_name,
            min_value: item.min_value,
            max_value: item.max_value,
            price: item.price,
            unit: item.unit,
            id: item._id,
            subtests: item.subtests || [],
        }));

        // Process patient data with matched tests
        const selectedTests = patientResponse.test_type.map(test => {
            const matchedOption = testOptions.find(option => option.id === test.test);
            if (!matchedOption) return null;

            return {
                ...matchedOption,
                result: test.result || "",
                selectedSubtests: matchedOption.subtests
                    .map(subtest => {
                        const matchedSubtest = test.subtests.find(st => st.subtest === subtest._id);
                        return matchedSubtest ? { ...subtest, result: matchedSubtest.result || "" } : null;
                    })
                    .filter(Boolean),
            };
        }).filter(Boolean);

        return {
            patientData: { ...patientResponse, test_type: selectedTests },
            unitData: unitResponse
        };
    };

    const generatePDF = async (Component, fileName, props) => {
        const htmlString = ReactDOMServer.renderToString(<Component {...props} />);

        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = htmlString;
        tempDiv.style.position = "absolute";
        tempDiv.style.top = "-999px";
        tempDiv.style.left = "-9999px";
        document.body.appendChild(tempDiv);

        setTimeout(async () => {
            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            const canvas = await html2canvas(tempDiv, { scale: 2 });
            const imgData = canvas.toDataURL("image/png");
            const imgHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, Math.min(imgHeight, pdfHeight));
            document.body.removeChild(tempDiv);

            pdf.save(fileName);
        }, 100);
    };

    const downloadJSX = async (patientId, type) => {
        const { patientData, unitData } = await fetchData(patientId);

        if (type === "report") {
            await generatePDF(PatientPreviewDownload, "patient-report.pdf", { patients: patientData, units: unitData });
        } else if (type === "bill") {
            await generatePDF(PatientTestBill, "patient-bill.pdf", { patients: patientData, units: unitData });
        }
    };


    useEffect(() => {
        fetchCatalogeData();
    }, [updatePage]);

    return (
        <>

            <div className="flex justify-center col-span-12 mt-3 lg:col-span-10">

                <div className="flex flex-col w-11/12 gap-5 ">



                    {showDeleteModal && (
                        <DeletePatient
                            deleteModel={deleteModel}
                            updatePage={updatePage}
                            setUpdatePage={setUpdatePage}
                            singlePatient={singlePatient}
                        />
                    )}
                    <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg ">
                        <ToastContainer />
                        <div className="flex items-start justify-start gap-4 p-5 ">
                            <span className="font-bold">Patient Details</span>
                        </div>
                        <div className="flex flex-col gap-2 p-3 md:flex-row md:justify-between md:gap-4">
                            <div className="flex flex-col w-full gap-2 md:flex-row md:gap-4">
                                {[
                                    { placeholder: "Search by name", value: nameSearchTerm, onChange: setNameSearchTerm },
                                    { placeholder: "Search by number", value: phoneSearchTerm, onChange: setPhoneSearchTerm },
                                    { placeholder: "Search by refer", value: referSearchTerm, onChange: setReferSearchTerm },
                                    { placeholder: "Search by lab number", value: labNumber, onChange: setLabNumber }
                                ].map((field, index) => (
                                    <div key={index} className="flex items-center px-2 border-2 rounded-md w-full md:w-auto h-[40px] ">
                                        <img
                                            alt="search-icon"
                                            className="w-5 h-5"
                                            src={require("../assets/search-icon.png")}
                                        />
                                        <input
                                            className="w-full p-1 text-xs border-none outline-none input-field"
                                            type="text"
                                            placeholder={field.placeholder}
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.target.value)}
                                        />
                                    </div>
                                ))}

                            </div>
                            <div className="flex justify-center md:justify-start">
                                <Link to={"/patient-form"}>
                                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs rounded h-[40px] lg:w-[120px] w-full">
                                        Add Patient
                                    </button>
                                </Link>
                            </div>
                        </div>
                        <table className="min-w-full text-sm divide-y-2 divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 font-medium text-left text-gray-900 whitespace-nowrap">
                                        Patient Name
                                    </th>
                                    <th className="px-4 py-2 font-medium text-left text-gray-900 whitespace-nowrap">
                                        Phone Number
                                    </th>
                                    <th className="px-4 py-2 font-medium text-left text-gray-900 whitespace-nowrap">
                                        Refer by
                                    </th>
                                    <th className="px-4 py-2 font-medium text-left text-gray-900 whitespace-nowrap">
                                        Lab Number
                                    </th>
                                    <th className="px-4 py-2 font-medium text-left text-gray-900 whitespace-nowrap">
                                        Total Bill
                                    </th>
                                    <th className="px-4 py-2 font-medium text-left text-gray-900 whitespace-nowrap">
                                        Specimen
                                    </th>
                                    <th className="px-4 py-2 font-medium text-left text-gray-900 whitespace-nowrap">
                                        Preview
                                    </th>
                                    {/* <th className="px-4 py-2 font-medium text-left text-gray-900 whitespace-nowrap">
                                        Report
                                    </th> */}
                                    <th className="px-4 py-2 font-medium text-left text-gray-900 whitespace-nowrap">
                                        Bill
                                    </th>
                                    <th className="px-4 py-2 font-medium text-left text-gray-900 whitespace-nowrap">
                                        Edit
                                    </th>
                                    <th className="px-4 py-2 font-medium text-left text-gray-900 whitespace-nowrap">
                                        Delete
                                    </th>
                                </tr>
                            </thead>


                            <tbody className="divide-y divide-gray-200">
                                {
                                    filterPatient.length == 0 ? (
                                        <tr>
                                            <td colSpan="4" className="p-6 text-center text-blue-600 whitespace-nowrap">
                                                Record Not Found
                                            </td>
                                        </tr>) : (

                                        filterPatient.map((element, index) => {
                                            return (
                                                <tr key={element._id}>

                                                    <td className="px-4 py-2 text-gray-700 whitespace-nowrap">
                                                        {element.patient_name}
                                                    </td>
                                                    <td className="px-4 py-2 text-gray-700 whitespace-nowrap">
                                                        {"0" + element.phone_number}
                                                    </td>
                                                    <td className="px-4 py-2 text-gray-700 whitespace-nowrap">
                                                        {element.refer_by}
                                                    </td>
                                                    <td className="px-4 py-2 text-gray-700 whitespace-nowrap">
                                                        {element.lab_no}
                                                    </td>
                                                    <td className="px-4 py-2 text-gray-700 whitespace-nowrap">
                                                        {element.patient_bill ? element.patient_bill : "-"}
                                                    </td>
                                                    <td className="px-4 py-2 text-gray-700 whitespace-nowrap">
                                                        {element.specimen}
                                                    </td>
                                                    <td className="px-4 py-2 text-gray-700 whitespace-nowrap">
                                                        <Link to={`/patient-preview/${element._id}`}>
                                                            <span>
                                                                <FaEye color="gray" size={22} cursor={'pointer'}
                                                                />
                                                            </span>
                                                        </Link>
                                                    </td>
                                                    {/* <td className="px-4 py-2 text-gray-700 whitespace-nowrap">

                                                        <span>
                                                            <FiDownload color="green" size={22} cursor={'pointer'}
                                                                onClick={() => downloadJSX(element._id ,"report")}
                                                            />
                                                        </span>

                                                    </td> */}
                                                    <td className="px-4 py-2 text-gray-700 whitespace-nowrap">

                                                        <span>
                                                            <FiDownload color="red" size={22} cursor={'pointer'}
                                                                // onClick={() => downloadJSX(element._id ,"bill")}
                                                                onClick={() => navigate(`/billing/${element._id}`)}
                                                            />
                                                        </span>

                                                    </td>
                                                    <td className="px-4 py-2 text-gray-700 whitespace-nowrap">

                                                        <Link to={`/patient-form/${element._id}`}>
                                                            <span onClick={() => {
                                                                // fetchSinglePatientData(element._id);
                                                                // editCatalogueModel(element)
                                                            }}>
                                                                <FaRegEdit color="gray" size={22} cursor={'pointer'}

                                                                />
                                                            </span>
                                                        </Link>
                                                    </td>
                                                    <td className="px-4 py-2 text-gray-700 whitespace-nowrap">

                                                        <RiDeleteBinLine color="gray" size={22} cursor={'pointer'}
                                                            // onClick={() => deleteItem(element._id)}
                                                            onClick={() => {
                                                                fetchSinglePatientData(element._id);
                                                                deleteModel()
                                                            }}
                                                        />
                                                    </td>
                                                </tr>
                                            );
                                        })

                                    )
                                }

                            </tbody>
                        </table>

                    </div>
                </div>
            </div>

        </>
    )
}

export default Patient
