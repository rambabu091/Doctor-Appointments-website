import DoctorModel from "../models/doctorsModel.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";




const changeAvailablity = async(req,res)=>{
    try {
        const {docId}=req.body;
        const docData=await DoctorModel.findById(docId);
        await DoctorModel.findByIdAndUpdate(docId,{available:!docData.available});
        res.json({success:true,message:"Availability changed successfully"});
    } catch (error) {
        console.log(error)
            res.json({success:false,message:error.message});
    }
}

const doctorList =async(req,res)=>{
    try {
        const doctors=await DoctorModel.find({}).select(["-password","-email"]);
        res.json({success:true,doctors});
    } catch (error) {
         console.log(error)
            res.json({success:false,message:error.message});
    }
}

//API for doctor login
const loginDoctor=async(req,res)=>{
    try {
        const{email,password}=req.body;
        const doctor =await DoctorModel.findOne({email});
        if(!doctor){
          return res.json({success:false,message:"Doctor not found"});
        }
        const isMatch=await bcrypt.compare(password,doctor.password);
        if(isMatch){
         const token = jwt.sign({id:doctor._id},process.env.JWT_SECRET);
          res.json({success:true,message:"Doctor logged in successfully",token});
        }
        else{
          res.json({success:false,message:"Invalid credentials"});
        }
     
    }catch(error){
        console.log(error)
            res.json({success:false,message:error.message});
    }
    }

    //API to show appointment of a doctor using doctor id

    const doctorAppointments=async(req,res)=>{
        try {
            
             const docId = req.docId;
             console.log("🔐 docId:", docId);
            const appointments=await appointmentModel.find({docId});
             console.log("📋 Appointments fetched:", appointments);
            res.json({success:true,appointments});
        } catch (error) {
            console.log(error)
            res.json({success:false,message:error.message});
        }
    }

//API to complete  the appointment from doctor panel

const completeAppointment=async(req,res)=>{
    try {
        const docId = req.docId;
        const {appointmentId}=req.body;
        const appointmentData=await appointmentModel.findById(appointmentId);
       if( appointmentData && appointmentData.docId==docId){
        await appointmentModel.findByIdAndUpdate(appointmentId,{isCompleted:true});
         return res.json({success:true,message:"Appointment completed successfully"});
       }else{
        res.json({success:false,message:"Mark Failed"});
       
       }
    } catch (error) {   
        console.log(error)
            res.json({success:false,message:error.message});}
    }
//api to cancel appointment from doc panel
    const cancelAppointment=async(req,res)=>{
    try {
        const docId = req.docId;
        const {appointmentId}=req.body;
        const appointmentData=await appointmentModel.findById(appointmentId);
       if( appointmentData && appointmentData.docId==docId){
        await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true});
        return res.json({success:true,message:"Appointment cancelled successfully"});
       }else{
        res.json({success:false,message:"cancellation Failed"});
       
       }
    } catch (error) {   
        console.log(error)
            res.json({success:false,message:error.message});}
    }

    //API for doctor dashboard

    const doctorDashboard=async(req,res)=>{
        try {
            const docId = req.docId;
            const appointments=await appointmentModel.find({docId});
            let earnings=0;
            appointments.map((item)=>{
                if(item.isCompleted){
                    earnings+=item.docData.fees;
                }
            
            })
            let patient =[]

            appointments.map((item)=>{
                if(!patient.includes(item.userData.name)){
                    patient.push(item.userData.name);
                }
            
            })

            const dashboardData={
                appointments:appointments.length,
                earnings:earnings,
                patients:patient.length,
                latestAppointments:appointments.reverse().slice(0,5)
            }
            res.json({success:true,dashboardData});
        } catch (error) {       
            console.log(error)
            res.json({success:false,message:error.message});
        }
    }

    //API to get doctor profile to doctor panel

    const doctorProfile=async(req,res)=>{

        try {
            const docId = req.docId;
            const profileData=await DoctorModel.findById(docId).select("-password");
            res.json({success:true,profileData})
        } catch (error) {
            console.log(error)
            res.json({success:false,message:error.message});
        }
    }

    //Update doctor profile

    const updateProfile=async(req,res)=>{
        try {
            const docId = req.docId;
            const {fees,address, available}=req.body;
            await DoctorModel.findByIdAndUpdate(docId,{fees,address, available});
            res.json({success:true,message:"Profile updated successfully"});
        }catch{
            console.log(error)
            res.json({success:false,message:error.message});
        }
    }


   



            





export {changeAvailablity,doctorList,loginDoctor,doctorAppointments,completeAppointment,cancelAppointment,doctorDashboard,doctorProfile,updateProfile};