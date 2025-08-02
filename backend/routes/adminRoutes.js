import express from "express";
import {addDoctor,adminLogin, getAllDoctors,appointmentsAdmin,appointmentCancel,adminDashboard,deleteDoctor} from "../controllers/adminController.js"
import upload from "../middlewares/multer.js"; 
import authAdmin from "../middlewares/authAdmin.js";
import { changeAvailablity } from "../controllers/doctorController.js";




const adminRouter=express.Router();

adminRouter.post('/add-doctor',authAdmin,upload.single('image'),addDoctor);



adminRouter.post('/login',adminLogin);
adminRouter.post('/all-doctors',authAdmin,getAllDoctors);
adminRouter.post('/change-availability',authAdmin,changeAvailablity);
adminRouter.get('/appointments',authAdmin,appointmentsAdmin);
adminRouter.post('/cancel-appointment',authAdmin,appointmentCancel);
adminRouter.get('/dashboard',authAdmin,adminDashboard);
adminRouter.post('/delete-doctor',authAdmin,deleteDoctor);






export default adminRouter;