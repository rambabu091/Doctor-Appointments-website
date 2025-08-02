import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext()

const AdminContextProvider = (props) => {
    const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '')
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const[dashData,setDashData]=useState(false);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const getAllDoctors = async () => {
        try {
            
            const { data } = await axios.post(backendUrl + '/api/admin/all-doctors', {}, { headers: { 'aToken': aToken } });
            if (data.success) {
                setDoctors(data.doctors); 
                console.log(data.doctors); 
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const changeAvailablity = async (docId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/change-availability', { docId }, { headers: { 'aToken': aToken } });
            if (data.success) {
                toast.success(data.message);
                getAllDoctors();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const getllAppointments = async () => {
        try {
            const {data} = await axios.get(backendUrl + '/api/admin/appointments', { headers: { 'aToken': aToken } });
            if (data.success) {
                setAppointments(data.appointments.reverse());
                console.log(data.appointments);
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
             toast.error(error.message);
        }
    }

    const appointmentCancel = async (appointmentId) => {
        try {
            const {data} = await axios.post(backendUrl + '/api/admin/cancel-appointment', { appointmentId }, { headers: { 'aToken': aToken } });
            if (data.success) {
                toast.success(data.message);
                getllAppointments();
            
            }else{
                 toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
             toast.error(error.message);
        }
    }

    const getDashData=async()=>{
        try {
            const {data}=await axios.get(backendUrl + '/api/admin/dashboard', { headers: { 'aToken': aToken } });
            if (data.success) {
                setDashData(data.dashData);
                console.log(data.dashData);
               
                
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.log(error);
             toast.error(error.message);
        }
    }

    const deleteDoctor=async(docId)=>{
        try {
            const {data}=await axios.post(backendUrl + '/api/admin/delete-doctor', { docId }, { headers: { 'aToken': aToken } });
            if(data.success){
                toast.success(data.message);
                getAllDoctors();
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
             toast.error(error.message);
        }
    }

    



    const value = {
        aToken,
        setAToken,
        backendUrl,
        doctors,
        getAllDoctors,
        changeAvailablity,
        appointments,
        setAppointments,
        getllAppointments,
        appointmentCancel,
        dashData,
        getDashData,
        deleteDoctor
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider;
