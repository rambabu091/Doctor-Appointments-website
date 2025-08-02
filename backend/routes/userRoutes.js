import express from "express";
import { registerUser, loginUser, getProfile, updateProfile, bookAppointment,listAppointment,cancelAppointment,paymentRazoarpay,verifyRazorpay } from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";
import upload from "../middlewares/multer.js";


const userRouter=express.Router();

userRouter.post('/register',registerUser);
userRouter.post('/login',loginUser);
userRouter.get('/profile',authUser,getProfile);
userRouter.post('/update-profile',upload.single('image'),authUser,updateProfile);
userRouter.post('/book-appointment',authUser,bookAppointment)
userRouter.get('/appointment',authUser,listAppointment)
userRouter.post('/cancel-appointment',authUser,cancelAppointment)
userRouter.post('/payment',authUser,paymentRazoarpay)
userRouter.post('/verify-payment',authUser,verifyRazorpay)



export default userRouter;