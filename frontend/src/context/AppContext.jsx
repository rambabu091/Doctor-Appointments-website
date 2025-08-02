import React, { useEffect } from 'react'
import { createContext } from 'react';
import {toast} from 'react-toastify';
import { useState } from 'react';

import axios from 'axios';


 export const AppContext = createContext();

const AppContextProvider = (props) => {
   
    const currency = "₹";
     const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const [doctors, setDoctors] = useState([]);
      const[token,setToken]=useState(localStorage.getItem('token')?localStorage.getItem('token'):false);
      const [userData,setUserData]=useState(false);
   
    const getAllDoctors=async()=>{
        try {
            const {data}=await axios.get(backendUrl+'/api/doctor/list',{});
            if(data.success){  
              setDoctors(data.doctors);
            }
            else{
              toast.error(data.message);
            }
          }
          catch (error) {
            console.log(error);
            toast.error(error.message);
          }
        }

        const getUserData=async()=>{
          try {
            const {data}=await axios.get(backendUrl+'/api/user/profile',{headers:{token}});
            if(data.success){  
              setUserData(data.userData);
            }
            else{
              toast.error(data.message);
            }
          } catch (error) {
            console.log(error);
            toast.error(error.message);
          }
        }

         const value={
         doctors,currency,
         getAllDoctors,
         token,setToken,
         backendUrl,
         userData,setUserData,
         getUserData

    }

        useEffect(()=>{
          getAllDoctors();
        },[])

        useEffect(()=>{
          if(token){
            getUserData();
          }else{
            setUserData(false);
          }
        },[token])
        


  return (
    <div>
      <AppContext.Provider value={value}>
        {props.children}
      </AppContext.Provider>
    </div>
  )
}

export default AppContextProvider
