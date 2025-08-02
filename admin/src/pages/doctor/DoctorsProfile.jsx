import React, { useState } from 'react'
import { useContext } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'

import { useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const DoctorsProfile = () => {
  const {dToken,getProfileData,profileData,setProfiledata,backendUrl}=useContext(DoctorContext)
  const {currency}=useContext(AppContext);
  const [isEdit,setIsEdit]=useState(false);

  const updateProfile=async()=>{
    try {
      const updateData={

        fees:profileData.fees,
        address:{
          line1:profileData.address.line1,
          line2:profileData.address.line2},
        available:profileData.available
      
      }
      const {data}= await axios.post(backendUrl +'/api/doctor/update-profile',updateData,{headers:{dToken}});
      if(data.success){
        toast.success(data.message);
        setIsEdit(false);
        getProfileData();
      }else{
        toast.error(data.message);
      }
      
    } catch (error) {
      console.log(error);
      toast.error(error.message);

    }
  }

  useEffect(()=>{
    if(dToken){
      getProfileData();
    }
  },[dToken])
  return profileData && (
    <div>
      <div className='flex flex-col gap-4 m-5'>
     
        <div>
          <img className='bg-primary/80 w-full sm:max-w-64 rounded-lg' src={profileData.image}/>
        </div>
         
        <div className='flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white'>
         <p className='flex items-center gap-2 text-2xl font-medium text-gray-700'>{profileData.name}</p>
          <div className=' items-center gap-2 mt-1 text-gray-600'>
            <p>Email:{profileData.email}</p>
          <p >{profileData.degree} - {profileData.speciality}</p>
          <button className='py-0.5 px-2 border text-xs rounded-full'>{profileData.experience}</button>
          </div>
          <div>
            <p  className='flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3'>
              ABOUT:
            </p>
            <p className='text-sm max-w-[700px] text-gray-600 mt-1'>{profileData.about}</p>
          
          </div>
          <p className='text-gray-600 font-medium mt-3'>Appointment Fees:  <span className='text-gray-800'>{currency}{isEdit?<input type='number'onChange={(e)=>setProfiledata(prev=>({...prev,fees:e.target.value}))} value={profileData.fees} ></input>: profileData.fees}</span></p>
         <div className='flex gap-2 py-2'>
          <p>Address:</p>
          <p className='text-gray-600 text-sm'>{ isEdit?<input type='text' onChange={(e)=>setProfiledata(prev=>({...prev,address:{...profileData.address,line1:e.target.value}}))} value={profileData.address.line1} ></input>: profileData.address.line1 }
          <br/>
          { isEdit?<input type='text' onChange={(e)=>setProfiledata(prev=>({...prev,address:{...profileData.address,line2:e.target.value}}))} value={profileData.address.line2} ></input>: profileData.address.line2 }</p>
         </div>
         <div className='flex gap-1 pt-2'>
          <input onChange={()=> isEdit && setProfiledata(prev=>({...prev,available:!prev.available}))} checked= {profileData.available} type='checkbox'/>
          <label>Available</label>
         </div>

         {
          isEdit ? <button onClick={updateProfile} className='px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all'>Save</button>
          :<button onClick={()=>setIsEdit(true)} className='px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all'>Update</button>
         }
          
        
        </div>
      </div>
    </div>
  )
}

export default DoctorsProfile
