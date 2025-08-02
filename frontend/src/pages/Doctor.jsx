import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext'

const Doctor = () => {
  const { speciality } = useParams();
  const navigate = useNavigate();
  const [filterDoc, setfilterDoc] = useState([]);
  const [showFilter , setShowFilter]=useState(false);
  const { doctors } = useContext(AppContext);

  const applyFilter = () => {
    if (speciality) {
      setfilterDoc(doctors.filter((doc) => doc.speciality === speciality));
    } else {
      setfilterDoc(doctors);
    }
  }

  useEffect(() => {
    applyFilter();
  }, [speciality, doctors]);

  return (
    <div>
      <p className='text-gray-600'>Browse through the doctors specialist.</p>
       <div className='flex flex-col sm:flex-row items-start  gap-4 mt-5'>
       <button className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-primary text-white' : ''} `} onClick={()=>setShowFilter(prev=>!prev)}>Filters</button>
       <div className={` flex flex-col gap-4 text-sm text-gray-600 ${showFilter ?'flex' : 'hidden sm:flex'}`}>
      <p  onClick ={()=>speciality ==='General physician' ? navigate('/doctor') : navigate('/doctor/General physician') }className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality==="General physician"? "bg-indigo-100 text-black" :" "}`}>General physician</p>
      <p  onClick ={()=>speciality ==='Gynecologist' ? navigate('/doctor') : navigate('/doctor/Gynecologist') }className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality==="Gynecologist"? "bg-indigo-100 text-black" :" "}`}>Gynecologist</p>
      <p  onClick ={()=>speciality ==='Dermatologist' ? navigate('/doctor') : navigate('/doctor/Dermatologist') }className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality==="Dermatologist"? "bg-indigo-100 text-black" :" "}`}>Dermatologist</p>
      <p  onClick ={()=>speciality ==='Pediatricians' ? navigate('/doctor') : navigate('/doctor/Pediatricians') }className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality==="Pediatricians"? "bg-indigo-100 text-black" :" "}`}>Pediatricians</p>
      <p  onClick ={()=>speciality ==='Neurologist' ? navigate('/doctor') : navigate('/doctor/Neurologist') }className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality==="Neurologist"? "bg-indigo-100 text-black" :" "}`}>Neurologist</p>
      <p  onClick ={()=>speciality ==='Gastroenterologist' ? navigate('/doctor') : navigate('/doctor/Gastroenterologist') }className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality==="Gastroenterologist"? "bg-indigo-100 text-black" :" "}`}>Gastroenterologist</p>
        </div>
        <div className=' w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 sm:px-0'>
          {
            filterDoc.map((item, index) => (
              <div onClick={() => navigate(`/appointment/${item._id}`)} key={index} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500'>
                <img className='bg-blue-50' src={item.image} alt=" " />
                <div className='p-4'>
                        <div className={`flex items-center gap-2 text-sm text-center ${item.available?'text-green-600':'text-gray-600' } `}>
                            <p className={`h-2 w-2 ${item.available?'bg-green-600':'bg-gray-600' } rounded-full`}></p><p>{item.available?'Available':'Not Available'}</p>
                        </div>
                  <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                  <p className='text-gray-600 text-sm'>{item.speciality}</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Doctor
