"use client";

import { createAssignment, getDrivers, search } from "@/services/assignment";
import { searchDriver } from "@/services/driver";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";

const MapWithNoSSR = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

export default function VehicleAssignment() {
  const vehicleSearchRef = useRef<HTMLInputElement>(null);
  const [vehicleSearched, setVehicleSearched] = useState<boolean>(false);
  const [vehicle, setVehicle] = useState<any>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string>("");
  const driverSearchRef = useRef<HTMLInputElement>(null);
  const [driverSearched, setDriverSearched] = useState<boolean>(false);
  const [driver, setDriver] = useState<any>([]);
  const [selectedDriver, setSelectedDriver] = useState<string[]>([]);
  // const [inviteAllDrivers, setInviteAllDrivers] = useState<boolean>(true);
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [showMap, setShowMap] = useState<boolean>(false);
  const [locationName, setLocationName] = useState<string>("");
  const radiusRef = useRef<HTMLInputElement>(null);

  const handleMapClick = (lat: number, lng: number) => {
    setCoordinates({ lat, lng });
    setShowMap(false);
    getDriversList();
  };

  const updateStartTime = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentTime = new Date();
    const selectedTime = new Date(event.target.value);
    if (selectedTime > currentTime) {
      setStartTime(event.target.value);
    } else {
      toast.error("Start time must be greater than the current time");
    }
  };

  const updateEndTime = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentTime = new Date();
    const selectedTime = new Date(event.target.value);
    if (selectedTime > currentTime) {
      setEndTime(event.target.value);
    } else {
      toast.error("End time must be greater than the current time");
    }
  };

  function handleSelectedDriver(id: string) {
    if (selectedDriver.includes(id)) {
      setSelectedDriver(selectedDriver.filter((d) => d !== id));
    } else {
      setSelectedDriver([...selectedDriver, id]);
    }
  }

  const searchVehicle = async (e: any) => {
    e.preventDefault();
    const vehicleSearch = vehicleSearchRef.current?.value;
    try {
      const token = await localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to continue");
        window.location.href = "/login";
        return;
      }
      const res = await search(token, vehicleSearch || "");
      if (res.error) {
        toast.error(res.message.message);
        return;
      }
      setVehicleSearched(true);
      setVehicle(res.response.vehicles);
    } catch (e) {
      console.log(e);
      toast.error("Something went wrong");
    }
  };

  // const searchDrivers = async (e: any) => {
  //   e.preventDefault();
  //   const driverSearch = driverSearchRef.current?.value;
  //   try {
  //     const token = await localStorage.getItem("token");
  //     if (!token) {
  //       toast.error("Please login to continue");
  //       window.location.href = "/login";
  //       return;
  //     }
  //     const res = await searchDriver(token, driverSearch || "");
  //     if (res.error) {
  //       toast.error(res.message.message);
  //       return;
  //     }
  //     setDriverSearched(true);
  //     setDriver(res.response.drivers);
  //     console.log(res.response);
  //   } catch (e) {
  //     console.log(e);
  //     toast.error("Something went wrong");
  //   }
  // };
  const getDriversList = async () => {
    const driverSearch = driverSearchRef.current?.value;
    try {
      const token = await localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to continue");
        window.location.href = "/login";
        return;
      }
      // const radius = Number(radiusRef.current?.value) || 10;
      // if (radius < 1) {
      //   toast.error("Radius must be greater than 1");
      //   return;
      // }
      const res = await getDrivers(token, coordinates);
      if (res.error) {
        toast.error(res.message.message);
        return;
      }

      setDriverSearched(true);
      setDriver(res.response.drivers);
    } catch (e) {
      console.log(e);
      toast.error("Something went wrong");
    }
  };

  async function handleSubmit(e: any) {
    e.preventDefault();
    if (coordinates.lat === 0 || coordinates.lng === 0) {
      toast.error("Please enter location");
      return;
    }
    const location = {
      type: "Point",
      coordinates: [coordinates.lng, coordinates.lat],
    };
    if (!startTime) {
      toast.error("Please enter start time");
      return;
    }
    if (!endTime) {
      toast.error("Please enter end time");
      return;
    }
    if (!selectedVehicle) {
      toast.error("Please select a vehicle");
      return;
    }
    if (!selectedDriver.length) {
      toast.error("Please select a driver");
      return;
    }
    let driverId: any = selectedDriver;

    const body = JSON.stringify({
      location: location,
      startTime: startTime,
      endTime: endTime,
      vehicle: selectedVehicle,
      driverId,
    });
    try {
      const token = await localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to continue");
        window.location.href = "/login";
        return;
      }
      const res = await createAssignment(token, body);
      if (res?.error) {
        toast.error(res.message.message);
        return;
      }
      toast.success("Assignment created successfully");
      setCoordinates({ lat: 0, lng: 0 });
      setLocationName("");
      setStartTime("");
      setEndTime("");
      setSelectedVehicle("");
      setSelectedDriver([]);
      // setInviteAllDrivers(true);
      return;
    } catch (e) {
      console.log(e);
      toast.error("Something went wrong");
    }
  }

  return (
    <div className="p-5 h-full overflow-y-scroll">
      <h1 className="text-2xl font-bold mb-6">Vehicle Assignment</h1>
      <form>
        <div className="mb-4">
          <label
            htmlFor="location"
            className="block text-gray-700 font-bold mb-2"
          >
            Location
          </label>
          <input
            type="text"
            id="location"
            value={locationName}
            onClick={() => setShowMap(true)}
            contentEditable={false}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {showMap && (
            <div className="mt-4">
              <MapWithNoSSR
                center={[12.9055, 79.1318]}
                onClick={handleMapClick}
                setLocationName={setLocationName}
              />
            </div>
          )}
        </div>
        <div className="flex gap-5">
          <div className="md:w-1/2 mb-4">
            <label
              htmlFor="startTime"
              className="block text-gray-700 font-bold mb-2"
            >
              Start Time
            </label>
            <input
              type="datetime-local"
              id="startTime"
              value={startTime}
              onChange={updateStartTime}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:w-1/2 mb-4">
            <label
              htmlFor="endTime"
              className="block text-gray-700 font-bold mb-2"
            >
              End Time
            </label>
            <input
              type="datetime-local"
              id="endTime"
              value={endTime}
              onChange={updateEndTime}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="vehicle-search"
            className="block text-gray-700 font-bold mb-2"
          >
            Vehicle
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              ref={vehicleSearchRef}
              id="vehicle-search"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              className="bg-blue-500 text-white px-4 rounded-lg"
              onClick={searchVehicle}
            >
              Search
            </button>
          </div>
          {vehicleSearched && (
            <ul className="mt-4 max-h-40 overflow-y-scroll">
              {vehicle.length === 0 && (
                <li className="mb-2">No vehicle found</li>
              )}
              {vehicle.map((v: any) => (
                <li key={v.licensePlate} className="mb-2">
                  <div
                    className={`px-4 ${
                      selectedVehicle == v._id
                        ? "bg-green-300 bg-opacity-40"
                        : "bg-primary bg-opacity-5"
                    }  py-2 rounded-md`}
                    onClick={() => setSelectedVehicle(v._id)}
                  >
                    {v.model} - {v.licensePlate}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* <label className="inline-flex items-center cursor-pointer mb-4">
          <input
            type="checkbox"
            checked={inviteAllDrivers}
            className="sr-only peer"
            onClick={() => setInviteAllDrivers(!inviteAllDrivers)}
          />
          <span className="block text-gray-700 font-bold">
            Send invite to all drivers.
          </span>
          <div className="ms-3 relative w-11 h-6 bg-gray-200 peer-focus:outline-none  rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label> */}

        <div className="mb-4">
          <div className="flex items-center justify-between">
            <label
              htmlFor="vehicle-search"
              className="block text-gray-700 font-bold"
            >
              Driver
            </label>
            {/* <input
                ref={radiusRef}
                min={1}
                type="number"
                name="radius"
                placeholder="radius"
                className="w-1/5 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></input> */}
          </div>

          {/* <div className="flex gap-2">
              <input
                type="text"
                ref={driverSearchRef}
                id="driver-search"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                className="bg-blue-500 text-white px-4 rounded-lg"
                onClick={searchDrivers}
              >
                Search
              </button>
            </div> */}
          {driverSearched && (
            <ul className="mt-4 max-h-40 overflow-y-scroll">
              {driver.length === 0 && <li className="mb-2">No driver found</li>}
              {driver.map((d: any) => (
                <li key={d._id} className="mb-2">
                  <div
                    className={`px-4 ${
                      selectedDriver.includes(d._id)
                        ? "bg-green-300 bg-opacity-40"
                        : "bg-primary bg-opacity-5"
                    }  py-2 rounded-md`}
                    onClick={() => handleSelectedDriver(d._id)}
                  >
                    {d.name} - {d.driverId} ({Math.floor(d.distance) / 1000} km
                    away)
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          onClick={handleSubmit}
          className="mt-10 w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Assign
        </button>
      </form>
    </div>
  );
}

// import { setToast, ShowToast } from "@/helper/toast";
// import { getAvailableEntities } from "@/services/assignment";
// import { useState } from "react";
// import { toast } from "react-toastify";

// export default function VehicleAssignment() {
//   const [startTime, setStartTime] = useState<string>("");
//   const [endTime, setEndTime] = useState<string>("");
//   const [drivers, setDrivers] = useState<{ driverId: string; name: string }[]>(
//     []
//   );
//   const [vehicles, setVehicles] = useState<
//     { licencePlate: string; model: string }[]
//   >([]);
//   const [availableFetched, setAvailableFetched] = useState(false);
//   const [selectedDrivers, setSelectedDrivers] = useState<String[]>([]);

//   const updateStartTime = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setStartTime(event.target.value);
//   };

//   const updateEndTime = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setEndTime(event.target.value);
//   };

//   const selectDriver = (id: string, checked: boolean) => {
//     const driver = drivers.find((driver) => driver.driverId === id);
//     if (!driver) {
//       return;
//     }
//     setSelectedDrivers((prevSelectedDrivers) => {
//       if (checked) {
//         return [...prevSelectedDrivers, driver.driverId];
//       } else {
//         return prevSelectedDrivers.filter((d) => d !== id);
//       }
//     });
//   };

//   async function getEntities(e: any) {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setToast("error", "Please login to continue");
//         return;
//       }
//       const response = await getAvailableEntities(token, startTime, endTime);
//       if (response.error) {
//         toast.error(response.message.message);
//         return;
//       }
//       setDrivers(response.response.availableDrivers);
//       setVehicles(response.response.availableVehicles);
//       setAvailableFetched(true);
//     } catch (error) {
//       console.log(error);
//       toast.error("Something went wrong");
//     }
//   }

//   return (
//     <div className="max-w-full mx-auto bg-white p-8 rounded-lg">
//       <h1 className="text-2xl font-bold mb-6">Vehicle Assignment</h1>
//       <form>
//         <div className="mb-4">
//           <label
//             htmlFor="startTime"
//             className="block text-gray-700 font-bold mb-2"
//           >
//             Start Time
//           </label>
//           <input
//             type="datetime-local"
//             id="startTime"
//             value={startTime}
//             onChange={updateStartTime}
//             className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         <div className="mb-4">
//           <label
//             htmlFor="endTime"
//             className="block text-gray-700 font-bold mb-2"
//           >
//             End Time
//           </label>
//           <input
//             type="datetime-local"
//             id="endTime"
//             value={endTime}
//             onChange={updateEndTime}
//             className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         <button
//           onClick={getEntities}
//           className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           Get Available Drivers and Vehicles
//         </button>
//       </form>
//       {availableFetched && (
//         <div className="flex w-full mt-10 gap-5">
//           <div className="w-1/2 bg-primary bg-opacity-5 p-10 rounded-xl">
//             <div className="flex justify-between">
//               <h2 className="text-md font-semibold">Available Drivers</h2>
//               <input
//                 type="text"
//                 placeholder="search"
//                 className="px-2 rounded"
//               />
//             </div>
//             <ul className="mt-2">
//               {drivers.map((driver) => (
//                 <li key={driver.driverId} className="mb-1">
//                   <input
//                     type="checkbox"
//                     onChange={(e) =>
//                       selectDriver(driver.driverId, e.target.checked)
//                     }
//                   />{" "}
//                   &nbsp;
//                   {driver.name}
//                 </li>
//               ))}
//             </ul>
//           </div>
//           <div className="w-1/2 bg-primary bg-opacity-5 p-10 rounded-xl">
//             <h2 className="text-md font-semibold">Available Vehicles</h2>
//             <ul className="mt-2">
//               {vehicles.map((vehicle) => (
//                 <li key={vehicle.licencePlate}>{vehicle.model}</li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
