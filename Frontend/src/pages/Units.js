import React, { useContext, useEffect, useState } from 'react'
import AddCatalogue from '../components/AddCatalogue';
import { Link } from 'react-router-dom';
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import AuthContext from '../AuthContext';
import EditCatalogue from '../components/EditCatalogue';
import DeleteCataloge from '../components/DeleteCataloge';
import { toast, ToastContainer } from 'react-toastify';
import AddUnits from '../components/AddUnits';
import EditUnit from '../components/EditUnit';

function Units() {
  const authContext = useContext(AuthContext);

  const [showUnitModel, setUnitModel] = useState(false);
  const [showEditUnitModel, setEditUnitModel] = useState(false);
  const [showDeleteUnitModel, setDeleteUnitModel] = useState(false);
  const [units, setAllUnits] = useState([]);
  const [singleUnit, setSingleUnit] = useState([]);
  const [updatePage, setUpdatePage] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const addUnitModel = () => {
    setUnitModel(!showUnitModel);
  };
  
  const editUnitModel = (element) => {
    setEditUnitModel(!showEditUnitModel);
    setSingleUnit(element)
  };
  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };
  const filteredCatalogue = units.filter((element) =>
    element.unit_name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const fetchCatalogeData = () => {
    fetch(`http://localhost:4000/api/unit/listing_unit/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => {
        setAllUnits(data);
      })
      .catch((err) => console.log(err));
  };
  // const fetchSingleCatalogeData = (id) => {
  //   fetch(`http://localhost:4000/api/cataloge/edit_unit/${id}`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setSingleUnit(data);
  //     })
  //     .catch((err) => console.log(err));
  // };


  const deleteItem = async (id) => {

    try {
      const response = await fetch(`http://localhost:4000/api/unit/delete_unit/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();

      setUpdatePage(!updatePage);
      toast.success("Unit Delete Successfully")
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };


  useEffect(() => {
    fetchCatalogeData();
    // toast.success("hello")
  }, [updatePage]);

  return (
    <>

      <div className="col-span-12 lg:col-span-10  flex justify-center">

        <div className=" flex flex-col gap-5 w-11/12">

          {showUnitModel && (
            <AddUnits
              addUnitModel={addUnitModel}
              handlePageUpdate={handlePageUpdate}
            />
          )}
          {showEditUnitModel && (
            <EditUnit
              editUnitModel={editUnitModel}
              handlePageUpdate={handlePageUpdate}
              singleUnit={singleUnit}
            />
          )}

          <div className="overflow-x-auto rounded-lg border bg-white border-gray-200 ">
            <ToastContainer />
            <div className="flex gap-4 justify-start items-start p-5 ">
              <span className="font-bold">Units Detail</span>
            </div>
            <div className="flex justify-between pt-5 pb-3 px-3">
              <div className="flex justify-center items-center px-2 border-2 rounded-md ">
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
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs  rounded"
                  onClick={addUnitModel}
                >
                  Add Units
                </button>
              </div>
            </div>
            <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
              <thead>
                <tr>
                  <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                    Units
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                    Abbreviation
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
                            {element.unit_name}
                          </td>

                          <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                            {element.unit_abb}
                          </td>
                          <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                            <span onClick={() => {
                              editUnitModel(element)
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

export default Units