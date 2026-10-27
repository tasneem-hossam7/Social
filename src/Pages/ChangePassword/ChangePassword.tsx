import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import { Helmet } from "react-helmet";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUserLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (password !== confirmPassword) return toast.error("New passwords do not match");
    if (password.length < 8) return toast.error("Password must be at least 8 characters");
    setLoading(true);
    try {
      const response = await axios.patch("https://route-posts.routemisr.com/users/change-password", { password: currentPassword, newPassword: password }, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
      const token = response.data?.data?.token;
      if (token) { localStorage.setItem("token", token); setUserLogin(token); }
      toast.success(response.data?.message || "Password changed successfully");
      setCurrentPassword(""); setPassword(""); setConfirmPassword("");
      if (!token) navigate("/profile");
    } catch (error: any) { toast.error(error.response?.data?.message || "Couldn't change password. Check your current password and try again."); }
    finally { setLoading(false); }
  }
  return <main className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 px-4 py-28">
    <Helmet><title>Change Password</title></Helmet>
    <form onSubmit={handleSubmit} className="mx-auto max-w-lg rounded-3xl border border-pink-100 bg-white p-6 shadow-xl sm:p-8">
      <h1 className="mb-2 text-center text-3xl font-extrabold text-pink-500">Change Password</h1><p className="mb-7 text-center text-sm text-gray-500">Choose a strong password to keep your account safe.</p>
      <label className="mb-2 block font-semibold text-gray-700">Current password</label><input required type="password" autoComplete="current-password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="mb-5 w-full rounded-xl border border-pink-200 p-3 outline-none focus:border-pink-400" />
      <label className="mb-2 block font-semibold text-gray-700">New password</label><input required minLength={8} type="password" autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} className="mb-5 w-full rounded-xl border border-pink-200 p-3 outline-none focus:border-pink-400" />
      <label className="mb-2 block font-semibold text-gray-700">Confirm new password</label><input required minLength={8} type="password" autoComplete="new-password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="mb-6 w-full rounded-xl border border-pink-200 p-3 outline-none focus:border-pink-400" />
      <button disabled={loading} className="w-full rounded-full bg-pink-500 px-6 py-3 font-bold text-white hover:bg-pink-600 disabled:opacity-50">{loading ? "Updating..." : "Update Password"}</button>
    </form>
  </main>;
}
