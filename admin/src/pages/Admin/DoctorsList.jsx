import React from 'react'
import { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';

const DoctorsList = () => {
  const { doctors, getAllDoctors, aToken,changeAvailablity,deleteDoctor } = useContext(AdminContext); 
  
  useEffect(() => {
    if (aToken) {
      getAllDoctors(); 
    }
  }, [aToken])


  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-lg font-medium'>All Doctors</h1>
      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
        {
          doctors.map((item, index) => {
            return (
              <div className='border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group' key={index}>
                <img className='bg-indigo-50 group-hover:bg-primary transition-all duration-500' src={item.image} alt={item.name}></img>
                <div className='p-4'>
                  <p className='text-neutral-800 text-lg font-medium'>{item.name}</p>
                  <p className='text-zinc-600 text-sm'>{item.speciality}</p>
                  <div className='mt-2 flex  items-center gap-2 text-sm'>
                    <input onChange={()=>changeAvailablity(item._id)} type="checkbox" checked={item.available}/>
                    <p>Available</p>
                    <button onClick={()=>deleteDoctor(item._id)} className='px-4 py-1 border  text-sm rounded-full  hover:bg-red-500 hover:text-white transition-all' >delete</button>
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default DoctorsList
