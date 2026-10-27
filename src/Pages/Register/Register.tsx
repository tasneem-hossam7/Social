import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as zod from"zod";
import { FaCircleExclamation } from "react-icons/fa6";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import {Helmet} from "react-helmet";



/*interface */
interface useData {
  "name": string,
  "email": string,
  "dateOfBirth": string,
  "gender": "Male" | "Female",
  "password": string,
  "rePassword": string

}
/*schema */
const schema = zod.object({
  /*name */
  name: zod
    .string()
    .nonempty("Name is required")
    .min(3, "Minimum 3 characters")
    .max(10, "Maximum 10 characters"),

    /*email */
  email: zod
    .string()
    .nonempty("Email is required")
    .regex(
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  "Please enter a valid email (e.g. example@gmail.com)"
    ),

  /*birthday */
  dateOfBirth: zod
  .string()
  .nonempty("Date of Birth is required")
  .refine((value) => {
    const today = new Date();
    const birthDate = new Date(value);

    const age = today.getFullYear() - birthDate.getFullYear();

    return age > 0 && age <= 120;
  }, "Invalid date of birth"),

  /*gender */
  gender: zod
  .enum (["Male", "Female"], "Invalid gender"),

  /*password */
  password: zod
  .string( )
  .nonempty("password required")
  .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, "Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character"),

  /*repassword */
  rePassword : zod
  .string()
  .nonempty("repassword required")

}).refine((data) => data.password === data.rePassword, {
  path: ["rePassword"],
  message: "Passwords do not match",
});



export default function Register() {

const navigate = useNavigate();
const [isLoading, setIsLoading] = useState(false);

 const form = useForm <useData>({
  defaultValues: {
  "name": "",
  "email": "",
  "dateOfBirth": "",
  "gender":"Female",
  "password": "",
  "rePassword": ""
    },
    
    resolver: zodResolver(schema),

    mode: "onChange",
 });

 let { register, handleSubmit, formState: { errors }} = form;

function handleRegister(data: useData) {
  setIsLoading(true);

  console.log("FORM DATA:", data);

  axios
    .post(
      "https://route-posts.routemisr.com/users/signup",
      {
        ...data,
        gender: data.gender.toLowerCase(),
      }
    )

    .then((res) => {

      console.log("SUCCESS:", res.data);

      if (res.data.success) {

        Swal.fire({
          icon: "success",
          title: "Account Created!",
          text:
            res.data.message ||
            "Your account has been created successfully.",
          confirmButtonText: "Go to Login",
          confirmButtonColor: "#ec4899",
        }).then(() => {
          navigate("/login");
        });

      }

    })

    .catch((err) => {

      console.log("ERROR:", err.response?.data);

      const message = err.response?.data?.message || "";

      if (
        message.toLowerCase().includes("already") ||
        message.toLowerCase().includes("exist")
      ) {

        Swal.fire({
          icon: "warning",
          title: "Account Already Exists",
          text: "This account already exists. Please login.",
          confirmButtonText: "Go to Login",
          confirmButtonColor: "#ec4899",
        }).then(() => {
          navigate("/login");
        });

      } else {

        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text:
            message ||
            "Something went wrong. Please try again.",
          confirmButtonColor: "#ec4899",
        });

      }

    })

   .finally(() => {
  setIsLoading(false);
});

}

  return <>
    
  <Helmet>
      <title>Register</title>
    </Helmet>

    
 <div className='pt-10'>
  <form onSubmit={handleSubmit(handleRegister)} className="w-full max-w-lg bg-pink-200 rounded-2xl shadow-xl p-8 mx-auto my-10">

    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold text-pink-500 mb-2">
        Create Account
      </h2>
      <p className="text-pink-500 text-sm">
        Sign up to create your account
      </p>
    </div>
    {/* Name */}
    <div className="relative z-0 w-full mb-7 group">
      <input
      {...register("name")}
        type="text"
        id="name"
        className="block py-3 px-0 w-full text-sm text-pink-500 bg-transparent border-0 border-b-2 border-pink-500 appearance-none focus:outline-none focus:ring-0 focus:border-pink-500 peer"
        placeholder=" "
      />

      <label
        htmlFor="name"
        className="absolute text-sm text-pink-500 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-focus:left-0 peer-focus:text-pink-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
      >
        Enter your Name
      </label>

       {errors.name && (
    <div className="mt-2 flex items-center gap-2 rounded-lg border border-red-200 bg-pink-100 px-3 py-2 text-sm font-medium text-pink-500">
       <FaCircleExclamation className="text-pink-500" />
    {errors.name.message}
  </div>
)}

    </div>

    {/* Email */}
    <div className="relative z-0 w-full mb-7 group">
      <input
        {...register("email")}
        type="email"
        id="email"
        className="block py-3 px-0 w-full text-sm text-pink-500 bg-transparent border-0 border-b-2 border-pink-500 appearance-none focus:outline-none focus:ring-0 focus:border-pink-500 peer"
        placeholder=" "
      />

      <label
        htmlFor="email"
        className="absolute text-sm text-pink-500 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-focus:left-0 peer-focus:text-pink-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
      >
        Enter your Email
      </label>
       
       {errors.email && (
    <div className="mt-2 flex items-center gap-2 rounded-lg border border-red-200 bg-pink-100 px-3 py-2 text-sm font-medium text-pink-500">
       <FaCircleExclamation className="text-pink-500" />
    {errors.email.message}
  </div>
)}
    </div>

    {/* Birthday */}
    <div className="relative z-0 w-full mb-7 group">
      <input
      {...register("dateOfBirth")}
        type="date"
        id="dateOfBirth"
        className="block py-3 px-0 w-full text-sm text-pink-500 bg-transparent border-0 border-b-2 border-pink-500 appearance-none focus:outline-none focus:ring-0 focus:border-pink-500 peer"
      />

      <label
        htmlFor="dateOfBirth"
        className="absolute text-sm text-pink-500 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0]"
      >
        Birthday
      </label>

      
       {errors.dateOfBirth && (
    <div className="mt-2 flex items-center gap-2 rounded-lg border border-red-200 bg-pink-100 px-3 py-2 text-sm font-medium text-pink-500">
       <FaCircleExclamation className="text-pink-500" />
    {errors.dateOfBirth.message}
  </div>
)}
    </div>

    {/* Password */}
    <div className="relative z-0 w-full mb-7 group">
      <input
       {...register("password")}
        type="password"
        id="password"
        className="block py-3 px-0 w-full text-sm text-pink-500 bg-transparent border-0 border-b-2 border-pink-500 appearance-none focus:outline-none focus:ring-0 focus:border-pink-500 peer"
        placeholder=" "
      />

      <label
        htmlFor="password"
        className="absolute text-sm text-pink-500 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-focus:left-0 peer-focus:text-pink-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
      >
        Enter your Password
      </label>

      
       {errors.password && (
    <div className="mt-2 flex items-center gap-2 rounded-lg border border-red-200 bg-pink-100 px-3 py-2 text-sm font-medium text-pink-500">
       <FaCircleExclamation className="text-pink-500" />
    {errors.password.message}
  </div>
)}
    </div>

    {/* Confirm Password */}
    <div className="relative z-0 w-full mb-8 group">
      <input
      {...register("rePassword")}
        type="password"
        id="rePassword"
        className="block py-3 px-0 w-full text-sm text-pink-500 bg-transparent border-0 border-b-2 border-pink-500 appearance-none focus:outline-none focus:ring-0 focus:border-pink-500 peer"
        placeholder=" "
      />

      <label
        htmlFor="rePassword"
        className="absolute text-sm text-pink-500 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-focus:left-0 peer-focus:text-pink-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
      >
        Confirm your Password
      </label>

      
       {errors.rePassword && (
    <div className="mt-2 flex items-center gap-2 rounded-lg border border-red-200 bg-pink-100 px-3 py-2 text-sm font-medium text-pink-500">
       <FaCircleExclamation className="text-pink-500" />
    {errors.rePassword.message}
  </div>
)}
    </div>

    {/* Gender */}
<div className="flex items-center mb-4 gap-5">

  <div className="flex items-center gap-2">
    <input
      id="Male"
      type="radio"
      value="Male"
      {...register("gender")}
      className="w-4 h-4 accent-pink-500"
  
    />
    <label
      htmlFor="Male"
      className="select-none text-sm font-medium text-pink-500"
    >
      Male
    </label>

    
       {errors.gender && (
    <div className="mt-2 flex items-center gap-2 rounded-lg border border-red-200 bg-pink-100 px-3 py-2 text-sm font-medium text-pink-500">
       <FaCircleExclamation className="text-pink-500" />
    {errors.gender.message}
  </div>
)}
  </div>

  <div className="flex items-center gap-2">
    <input
      id="Female"
      type="radio"
      value="Female"
      {...register("gender")}
      className="w-4 h-4 accent-pink-500"
    />
    <label
      htmlFor="Female"
      className="select-none text-sm font-medium text-pink-500"
    >
      Female
    </label>
  </div>

</div>
   {/* Button */}
    <button
    disabled={isLoading}
      type="submit"
      className="disabled:bg-pink-300 w-full text-white bg-pink-500 hover:bg-pink-500 focus:ring-4 focus:outline-none focus:ring-pink-600 font-medium rounded-lg text-sm px-5 py-3.5 text-center transition duration-300"
    >
      {isLoading ? "loading..." : "create account"}
    </button>

    {/* Login Link */}
    <div className="mt-4 flex justify-center items-center gap-2">
      <p className="text-sm font-light text-pink-500">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-pink-500 hover:underline">
          Login here
        </Link>
      </p>
    </div>


  </form>
  </div>
  </>
}
