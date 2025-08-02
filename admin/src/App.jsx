import React, { useContext } from 'react'
import Login from './pages/Login'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdminContext } from './context/AdminContext';
import NavBar from './components/NavBar';
import Sidebar from './components/Sidebar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/admin/Dashboard';
import AddDoctor from './pages/admin/AddDoctor';
import DoctorsList from './pages/admin/DoctorsList';
import AllAppointment from './pages/admin/AllAppointment';
import { DoctorContext } from './context/DoctorContext';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorsAppointment from './pages/doctor/DoctorsAppointment';
import DoctorsProfile from './pages/doctor/DoctorsProfile';





const App = () => {
  const {aToken}=useContext(AdminContext);
  const {dToken}=useContext(DoctorContext)
  return aToken || dToken ? (
    
    <div className='bg-[#F8F9FD]' >
  
       <ToastContainer/>
       <NavBar/>
       <div className='flex items-start'>
          <Sidebar/>
          <Routes>
          {/* Admin routes */}
            <Route path='/' element={<></>}/>
           <Route path='/dashboard' element={<Dashboard/>}/>
            <Route path='/add-doctor' element={<AddDoctor/>}/>
            <Route path='/doctors-list' element={<DoctorsList/>}/>
            <Route path='/all-appointment' element={<AllAppointment/>} />

            {/* Doctor routes */}

            <Route path='/doctors-dashboard' element={<DoctorDashboard/>}/>
            <Route path='/doctors-appointments' element={<DoctorsAppointment/>}/>
            <Route path='/doctors-profile' element={<DoctorsProfile/>}/>




            
          </Routes>
        
       </div>
         
    </div>
  ):(
    <>
      <Login/>
      <ToastContainer/>
    </>
  )
}

export default App
