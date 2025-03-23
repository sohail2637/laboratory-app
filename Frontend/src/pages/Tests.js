import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import AuthContext from '../AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import AddTest from '../components/Tests/AddTest';
import EditTest from '../components/Tests/EditTest';
import GlobalApiState from '../utilis/globalVariable';

function Tests() {
  const authContext = useContext(AuthContext);

  const [showTestModel, setTestModel] = useState(false);
  const [showEditTestModel, setEditTestModel] = useState(false);
  const [showDeleteUnitModel, setDeleteUnitModel] = useState(false);
  const [tests, setAllTest] = useState([]);
  const [singleTest, setSingleTest] = useState([]);
  const [updatePage, setUpdatePage] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [units, setAllUnits] = useState([]);

  const addTestModel = () => {
    setTestModel(!showTestModel);
  };
  
  const editTestModel = (element) => {
    setEditTestModel(!showEditTestModel);
    setSingleTest(element)
  };
  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };
  const filteredCatalogue = tests?.filter((element) =>
    element?.test_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const fetchTestData = () => {
    fetch(`${GlobalApiState.DEV_BASE_LIVE}/api/test/listing_test/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => {
        setAllTest(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.log(err));
  };

  const fetchUnitData = () => {
    fetch(`${GlobalApiState.DEV_BASE_LIVE}/api/unit/listing_unit/${authContext.user}`)
        .then((response) => response.json())
        .then((data) => {
            setAllUnits(data);
        })
        .catch((err) => console.log(err));
};

  const deleteItem = async (id) => {

    try {
      const response = await fetch(`${GlobalApiState.DEV_BASE_LIVE}/api/test/delete_test/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();

      setUpdatePage(!updatePage);
      toast.success("Test Delete Successfully")
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };


  useEffect(() => {
    fetchTestData();
    fetchUnitData()
  }, [updatePage]);

  return (
    <>

      <div className="col-span-12 lg:col-span-10 mt-3 flex justify-center">

        <div className=" flex flex-col gap-5 w-11/12">

          {showTestModel && (
            <AddTest
              addTestModel={addTestModel}
              handlePageUpdate={handlePageUpdate}
              units={units}
            />
          )}
          {showEditTestModel && (
            <EditTest
              editTestModel={editTestModel}
              handlePageUpdate={handlePageUpdate}
              testData={singleTest}
              units={units}
            />
          )}

          <div className="overflow-x-auto rounded-lg border bg-white border-gray-200 ">
            <ToastContainer />
            <div className="flex gap-4 justify-start items-start p-5 ">
              <span className="font-bold">Tests Detail</span>
            </div>
            <div className="flex justify-between md:flex-row flex-col gap-2 pt-5 pb-3 px-3">
              <div className="flex justify-center items-center px-2 h-[40px] border-2 rounded-md ">
                <img
                  alt="search-icon"
                  className="w-5 h-5"
                  src={require("../assets/search-icon.png")}
                />
                <input
                  className="border-none outline-none text-xs"
                  type="text"
                  placeholder="Search here"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-4">
                <button
                  className="bg-blue-500 hover:bg-blue-700 h-[40px] lg:w-[120px] w-full text-white font-bold p-2 text-xs  rounded"
                  onClick={addTestModel}
                >
                  Add Test
                </button>
              </div>
            </div>
            <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
              <thead>
                <tr>
                  <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                    Test Nmae
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                    Min Value
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                    Max Value
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                   Unit
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                   Price
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                    Edit
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                    Delete
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {
                  filteredCatalogue.length == 0 ? (
                    <tr>
                      <td colSpan="4" className="whitespace-nowrap p-6 text-blue-600 text-center">
                        Record Not Found
                      </td>
                    </tr>) : (

                    filteredCatalogue.map((element, index) => {
                      return (
                        <tr key={element._id}>

                          <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                            {element.test_name}
                          </td>

                          <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                            {element.min_value ? element.min_value : "-"}
                          </td>
                          
                          <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                            {element.max_value ? element.max_value : "-"}
                          </td>
                          
                          <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                            {element?.unit?.unit_abb ? element?.unit?.unit_abb :""}
                          </td>
                          <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                            {element?.price || 0}
                          </td>
                          <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                            <span onClick={() => {
                              editTestModel(element)
                            }}>
                              <FaRegEdit color="gray" size={22} cursor={'pointer'}

                              />
                            </span>

                          </td>
                          <td className="whitespace-nowrap px-4 py-2 text-gray-700">

                            <RiDeleteBinLine color="gray" size={22} cursor={'pointer'}
                              onClick={() => {
                                deleteItem(element._id)
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

export default Tests
