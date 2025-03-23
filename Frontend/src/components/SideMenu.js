// import { Link, useLocation } from "react-router-dom";
// import { GrCatalog } from 'react-icons/gr'; // FontAwesome List icon
// import { MdLocalHospital } from "react-icons/md";
// import { GiTestTubes } from "react-icons/gi";
// import { AiOutlineFileText } from "react-icons/ai"
// import { Avatar } from "@mui/material";

// const Sidebar = () => {
//   const location = useLocation();

//   const localStorageData = JSON.parse(localStorage.getItem("user"));



//   return (
//     <div className="h-full flex-col justify-between bg-white hidden lg:flex">
//       <div className="px-4 py-6">
//         <nav aria-label="Main Nav" className="mt-6 flex flex-col space-y-1">
//         <Link
//             to="/"
//             className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
//           >
//             <MdLocalHospital size={20} color="grey" />
//             <span className="text-sm font-medium">Patients</span>
//           </Link>
//           <Link
//             to="/test-details"
//             className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
//           >
//             <AiOutlineFileText size={22} color="gray" />
//             <span className="text-sm font-medium">Tests</span>
//           </Link>
//           <Link
//             to="/unit-details"
//             className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
//           >
//             <GiTestTubes size={22} color="gray" />
//             <span className="text-sm font-medium"> Units</span>
//           </Link>

//         </nav>
//       </div>

//       <div>
//         <div className="inset-x-0 bottom-0 border-t border-gray-100">
//           <div className="flex items-center gap-2 bg-white p-4 hover:bg-gray-50">
//             <Avatar
//               // alt={localStorageData?.user?.name || "User"}
//               // src={localStorageData?.user?.imageUrl || ""}
//               // sx={{ width: 54, height: 54, mb: 2 }}
//             />

//             {/* <div>
//               <p className="text-xs">
//                 <strong className="block font-medium">
//                   {localStorageData?.user?.firstName + " " + localStorageData?.user?.lastName}
//                 </strong>
//                 <span>{localStorageData?.user?.email}</span>
//               </p>
//             </div> */}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { MdLocalHospital } from "react-icons/md";
import { GiTestTubes } from "react-icons/gi";
import { AiOutlineFileText } from "react-icons/ai";
import { Avatar } from "@mui/material";

const Sidebar = () => {
  const location = useLocation();
  const localStorageData = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="h-full flex-col justify-between bg-white hidden lg:flex shadow-lg w-64">
      <div className="px-4 py-6">
        <nav aria-label="Main Nav" className="mt-6 flex flex-col space-y-2">
          <Link
            to="/"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-300 text-gray-600 hover:bg-blue-100 hover:text-blue-600 ${
              location.pathname === "/" ? "bg-blue-500 text-white" : ""
            }`}
          >
            <MdLocalHospital size={20} />
            <span className="text-sm font-medium">Patients</span>
          </Link>

          <Link
            to="/test-details"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-300 text-gray-600 hover:bg-blue-100 hover:text-blue-600 ${
              location.pathname === "/test-details" ? "bg-blue-500 text-white" : ""
            }`}
          >
            <AiOutlineFileText size={22} />
            <span className="text-sm font-medium">Tests</span>
          </Link>

          <Link
            to="/unit-details"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-300 text-gray-600 hover:bg-blue-100 hover:text-blue-600 ${
              location.pathname === "/unit-details" ? "bg-blue-500 text-white" : ""
            }`}
          >
            <GiTestTubes size={22} />
            <span className="text-sm font-medium">Units</span>
          </Link>
        </nav>
      </div>

      {/* User Profile Section */}
      <div className="border-t border-gray-200 p-4 flex items-center gap-3 bg-gray-50">
        <Avatar
          sx={{ width: 50, height: 50 }}
          alt={localStorageData?.name || "User"}
          src={localStorageData?.imageUrl || ""}
        />
        <div>
          <p className="text-xs">
            <strong className="block font-medium">
              {localStorageData?.firstName + " " + localStorageData?.lastName}
            </strong>
            <span>{localStorageData?.email}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
