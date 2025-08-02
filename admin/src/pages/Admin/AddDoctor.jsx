import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets_admin/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";


const AddDoctor = () => {
  const [docImg, setDocImg] = useState(false);
  const [docName, setDocName] = useState("");
  const [docEmail, setDocEmail] = useState("");
  const [docPassword, setDocPassword] = useState("");
  const [docExperience, setDocExperience] = useState("");
  const [docFees, setDocFees] = useState("");
  const [docSpeciality, setDocSpeciality] = useState("");
  const [docEducation, setDocEducation] = useState("");
  const [docAddress1, setDocAddress1] = useState("");
  const [docAddress2, setDocAddress2] = useState("");
  const [docAbout, setDocAbout] = useState("");

  const { backendUrl, aToken } = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (!docImg) {
        return toast.error("Please upload doctor image");
      }
      const formData = new FormData();
      formData.append("image", docImg);
      formData.append("name", docName);
      formData.append("email", docEmail);
      formData.append("password", docPassword);
      formData.append("experience", docExperience);
      formData.append("fees", Number(docFees));
      formData.append("speciality", docSpeciality);
      formData.append("degree", docEducation);
      formData.append(
        "address",
        JSON.stringify({ line1: docAddress1, line2: docAddress2 })
      );

      formData.append("about", docAbout);
      formData.forEach((value, key) => {
        console.log(`${key} : ${value}`);
      });

      const { data } = await axios.post(
        backendUrl + "/api/admin/add-doctor",
        formData,
        { headers: { aToken } }
      );
      if (data.success) {
        toast.success(data.message);
        setDocImg(false);
        setDocName("");
        setDocEmail("");
        setDocPassword("");
        
        setDocFees("");
       
        setDocEducation("");
        setDocAddress1("");
        setDocAddress2("");
        setDocAbout("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
        toast.error(error.message);
        console.log(error);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="m-5 w-full">
      <p className="mb-3 text-lg text-medium">Add Doctor</p>
      <div className="bg-white px-8 py-8 border w-full rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
        <div className="flex items-center gap-4 mb-8 text-gray-500">
          <label htmlFor="doc-img">
            <img
              className="w-16 bg-gray-100 rounded-full cursor-pointer"
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
            />
          </label>
          <input
            onChange={(e) => setDocImg(e.target.files[0])}
            type="file"
            id="doc-img"
            hidden
          ></input>
          <p>
            Upload doctor <br /> picture
          </p>
        </div>
        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor name</p>
              <input
                onChange={(e) => setDocName(e.target.value)}
                value={docName}
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Doctor name"
                required
              ></input>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor Email</p>
              <input
                onChange={(e) => setDocEmail(e.target.value)}
                value={docEmail}
                className="border rounded px-3 py-2"
                type="email"
                placeholder="Email"
                required
              ></input>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor Password</p>
              <input
                onChange={(e) => setDocPassword(e.target.value)}
                value={docPassword}
                className="border rounded px-3 py-2"
                type="password"
                placeholder="Enter password"
                required
              ></input>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Experience</p>
              <select
                onChange={(e) => setDocExperience(e.target.value)}
                value={docExperience} name=" " id=" "
                className="border rounded px-3 py-2"
              >
                <option value={"1 Year"}>1 Year</option>
                <option value={"2 Year"}>2 Year</option>
                <option value={"3 Year"}>3 Year</option>
                <option value={"4 Year"}>4 Year</option>
                <option value={"5 Year"}>5 Year</option>
                <option value={"6 Year"}>6 Year</option>
                <option value={"7 Year"}>7 Year</option>
                <option value={"8 Year"}>8 Year</option>
                <option value={"9 Year"}>9 Year</option>
                <option value={"10 Year"}>10 Year</option>
              </select>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Fees</p>
              <input
                onChange={(e) => setDocFees(e.target.value)}
                value={docFees}
                className="border rounded px-3 py-2"
                type="number"
                placeholder="Enter Fees"
                required
              ></input>
            </div>
          </div>
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Speciality</p>
              <select
                onChange={(e) => setDocSpeciality(e.target.value)}
                value={docSpeciality}
                className="border rounded px-3 py-2" name=" " id=" "
              >
            
                <option value={"General physician"}>General physician</option>
                <option value={"Gynecologist"}>Gynecologist</option>
                <option value={"Dermatologist"}>Dermatologist</option>
                <option value={"Pediatricians"}>Pediatricians</option>
                <option value={"Neurologist"}>Neurologist</option>
                <option value={"Gastroenterologist"}>Gastroenterologist</option>
              </select>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Education</p>
              <input
                onChange={(e) => setDocEducation(e.target.value)}
                value={docEducation}
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Education"
                required
              ></input>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Address</p>
              <input
                onChange={(e) => setDocAddress1(e.target.value)}
                value={docAddress1}
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Addesss 1"
                required
              ></input>
              <input
                onChange={(e) => setDocAddress2(e.target.value)}
                value={docAddress2}
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Addesss 2"
                required
              ></input>
            </div>
          </div>
        </div>
        <div>
          <p className=" mt-4 mb-2">About me</p>
          <textarea
            onChange={(e) => setDocAbout(e.target.value)}
            value={docAbout}
            className="w-full px-4 pt-2 border rounded"
            placeholder="Write about doctor"
            rows={5}
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className=" bg-primary px-10 py-3 mt-4 text-white rounded-full"
        >
          Add doctor
        </button>
      </div>
    </form>
  );
};

export default AddDoctor;
