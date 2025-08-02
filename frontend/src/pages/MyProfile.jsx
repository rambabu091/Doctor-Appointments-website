import React, { use, useContext, useState } from 'react'

import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets_frontend/assets';
import { toast } from 'react-toastify';
import axios from 'axios';

const MyProfile = () => {
const {userData,setUserData,token,backendUrl,getUserData} =useContext(AppContext);

 const [isEdit,useIsEdit] = useState(false);

 const [image,setImage]=useState(false);


 const updateUserProfile=async()=>{
    try {
      const formData = new FormData();
      formData.append('name',userData.name);
      formData.append('phone',userData.phone);
      formData.append('address',JSON.stringify(userData.address));
      formData.append('dob',userData.dob);
      formData.append('gender',userData.gender);
      if(image){
        formData.append('image',image);
      }
      const {data} = await axios.post(backendUrl+'/api/user/update-profile',formData,{headers:{token}});
      if(data.success){
        toast.success(data.message);
        await getUserData();
        useIsEdit(false);
        setImage(false);
      }else{
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
 }



  return userData && (
    <div className='max-w-lg flex flex-col gap-2 text-sm'>
    {
      isEdit ?
      <label htmlFor='image'>
      <div className='inline-block relative cursor-pointer'>
        <img className='w-36 rounded opacity-75' src={image ? URL.createObjectURL(image) : userData.image}/>
      <img className='w-10 absolute bottom-12 right-12' src={image ? '' :assets.upload_icon }/>
      </div>
      <input onChange={(e)=>setImage(e.target.files[0])} type='file' id='image' hidden/>
      </label>
      : <img className='w-36 rounded' src={userData.image}/>
    }
     
      {
        isEdit ?
       
          <input className='bg-gray-100 text-3xl font-medium max-w-60 mt-4 ' type='text' value={userData.name} onChange={(e)=>setUserData({...userData,name:e.target.value})}></input>
          :
          <p className='text-3xl font-medium text-neutral-800 mt-4'>{userData.name}</p>
         }
           <hr className='bg-zinc-400 h[-1px] w-full mt-2 '/>
           <div className=''>
            <p className='text-netural-500 underline mt-3'>CONTACT INFORMATION</p>
            <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-netural-700'>
              <p className='font-medium'>E-mail:</p>
               <p className='text-blue-600 '>{userData.email}</p>
               <p className='font-medium'>Phone:</p>
               {
        isEdit ?
       
          <input className='bg-gray-100 max-w-52 ' type='text' value={userData.phone} onChange={(e)=>setUserData({...userData,phone:e.target.value})}></input>
          :
          <p className='text-blue-400 '>{userData.phone}</p>
         }

         <p className='font-medium'>Address:</p>
         { isEdit ?
         <p>
          <input className='bg-gray-100 max-w-52 ' type='text' value={userData.address.line1} onChange={(e)=>setUserData({...userData,address:{...userData.address,line1:e.target.value}})}></input>
          <br/>
          <input className='bg-gray-100 max-w-52 ' type='text' value={userData.address.line2} onChange={(e)=>setUserData({...userData,address:{...userData.address,line2:e.target.value}})}></input>
         </p>
         :<p className='text-gray-500 '>
          {userData.address.line1}
          <br/>
          {userData.address.line2}
         </p>
         }
            </div>
           </div>
           <div>
            <p className='text-netural-500 underline mt-3'>BASIC INFORMATION</p>
            <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-netural-700'>
              <p className='font-medium'>Gender:</p>
              {
        isEdit ?
       
          <select className='max-w-20 bg-gray-100'   onChange={(e)=>setUserData({...userData,gender:e.target.value})}>
            <option value='male'>Male</option>
            <option value='female'>Female</option>
            <option value='other'>Other</option>
            
          </select>

          :
          <p className='text-gray-400'>{userData.gender}</p>
         }

         <p className='font-medium'>
          Date of Birth:</p>
          {
            isEdit ?
       
          <input className='bg-gray-100 max-w-28 ' type='date' value={userData.dob} onChange={(e)=>setUserData({...userData,dob:e.target.value})}></input>
          :
          <p className='text-gray-400'>{userData.dob}</p>
          }
            </div>
            
           </div>
           <div className='mt-10'>
            {
              isEdit ?
              <button className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all' onClick={updateUserProfile}>Save</button>
              :
              <button className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all' onClick={()=>useIsEdit(true)}>Edit</button>
            }
           </div>
    </div>
  )
}

export default MyProfile;
