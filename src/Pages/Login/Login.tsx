import { useContext, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as zod from "zod";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import {Helmet} from "react-helmet";

interface LoginData {
  email: string;
  password: string;
}

const schema = zod.object({
  email: zod
    .string()
    .nonempty("Email is required")
    .email("Please enter a valid email"),

  password: zod
    .string()
    .nonempty("Password is required"),
});

export default function Login() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const { setUserLogin } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(schema),
  });

  function handleLogin(data: LoginData) {
    setIsLoading(true);

    axios
      .post("https://route-posts.routemisr.com/users/signin", {
        email: data.email,
        password: data.password,
      })
      .then((res) => {
        console.log(res.data);

        if (res.data.success) {
          localStorage.setItem("token", res.data.data.token);  // Store the token in localStorage

          setUserLogin(res.data.data.token);  // Keep the token in auth state

          Swal.fire({
            icon: "success",
            title: "Login Successful",
            text: "Welcome back!",
            confirmButtonColor: "#ec4899",
          }).then(() => {
            navigate("/");
          });
        }
      })
      .catch((err) => {
        console.log(err.response?.data);

        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text:
            err.response?.data?.message ||
            "Email or password is incorrect",
          confirmButtonColor: "#ec4899",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return <>
     <Helmet>
      <title>Login</title>
    </Helmet>
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit(handleLogin)}
        className="w-full max-w-lg bg-pink-200 rounded-2xl shadow-xl p-8"
      >
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-pink-500 mb-2">
            Welcome Back
          </h2>

          <p className="text-pink-500">
            Login to your account
          </p>
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block mb-2 text-pink-600 font-medium">
            Email
          </label>

          <input
            type="email"
            {...register("email")}
            className="w-full p-3 rounded-lg border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
            placeholder="Enter your email"
          />

          {errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block mb-2 text-pink-600 font-medium">
            Password
          </label>

          <input
            type="password"
            {...register("password")}
            className="w-full p-3 rounded-lg border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
            placeholder="Enter your password"
          />

          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 rounded-lg transition"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        {/* Register */}
        <p className="text-center mt-6 text-pink-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-bold text-pink-500 hover:text-pink-700"
          >
            Create Account
          </Link>
        </p>
      </form>
    </div>
  </>
}