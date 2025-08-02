import React from 'react'
import { useContext } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets_admin/assets';

const DoctorsAppointment = () => {
    
  const {appointments,dToken,getAppointments,cancelAppointment,completeAppointment}=useContext(DoctorContext);
  const {calculateAge,currency}=useContext(AppContext)


  useEffect(()=>{
    if(dToken){
      getAppointments();
    }
  },[dToken])
  return (
    <div className='w-full max-w-6xl m-5'  >
     <p className='mb-3 text-lg font-medium' >All appointments</p>
     <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll' >
      <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b' >
        <p>#</p>
        <p>patient</p>
        <p>payment</p>
        <p>Age</p>
        <p> Date & Time</p>
        <p>Fees</p>
        <p>Action</p>
      </div>
      {
        appointments.reverse().map((item,index)=>(
          <div className='flex flex-wrap justify-between sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 grid-flow-col py-3 px-6 border-b hover:bg-gray-50' key={index} >
              <p className='max-sm:hidden'>{index+1}</p>
               <div className='flex items-center gap-2'>
             <img  className='w-8 rounded-full' src={item.userData.image}/>
               <p>{item.userData.name}</p>
             </div>
           <div>
            <p className='text-xs inline border border-primary px-2 rounded-full'>{
              item.payment ?'Online' : 'CASH'
            }</p>
           </div>
            <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>
             <p>{item.slotDate} , {item.slotTime}</p>
             <p>{currency}{item.docData.fees}</p>

             {
              item.cancelled ?
              <p className='text-red-400 text-xs font-medium'> Cancelled</p>
              :
              item.isCompleted ?
              <p className='text-green-500 text-xs font-medium'>Completed</p>
              :
              <div className='flex'>
              <img onClick={()=>cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon}/>
              <img onClick={()=>completeAppointment(item._id)} className='w-10 cursor-pointer' src={assets.tick_icon}/>
             </div>
             }
             
          </div>
        ))
      }
     </div>
    </div>
  )
}

export default DoctorsAppointment
