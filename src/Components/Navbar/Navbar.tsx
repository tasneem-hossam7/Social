import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaXmark } from "react-icons/fa6";
import { AuthContext } from "../../context/AuthContext";
import Swal from "sweetalert2";


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { userLogin, setUserLogin } = useContext(AuthContext);

  const navigate = useNavigate(); // Import useNavigate from react-router-dom           


  async function logout() {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "Do you really want to logout?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, Logout",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#ec4899",
    cancelButtonColor: "#6b7280",
  });

  if (result.isConfirmed) {
    localStorage.removeItem("token");

    setUserLogin(null);

    navigate("/login");
  }
}

  return (
    <nav className="bg-pink-500 shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-white"
          >
            Social
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">

            {userLogin ? <>      <Link
              to="/"
              className="text-white font-medium hover:text-pink-200 transition"
            >
              Home
            </Link>

            <Link
              to="/profile"
              className="text-white font-medium hover:text-pink-200 transition"
            >
              Profile
            </Link>
            <Link to="/change-password" className="text-white font-medium hover:text-pink-200 transition">Change Password</Link>

              <button className="bg-white text-pink-500 px-5 py-2 rounded-full font-semibold hover:bg-pink-100 transition" onClick={logout}>
              LogOut
            </button>

              </> : <>        <Link
              to="/register"
              className="text-white font-medium hover:text-pink-200 transition"
            >
              Register
            </Link>

            <Link
              to="/login"
              className="text-white font-medium hover:text-pink-200 transition"
            >
              Login
            </Link>
</>}
          
          </div>

          {/* Mobile Button */}
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white text-2xl" >
                {isOpen ? <FaXmark /> : <FaBars />}
            </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">

            {userLogin ? <>
              <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="block text-white font-medium px-3 py-2 rounded-lg hover:bg-pink-600"
            >
              Home
            </Link>


            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="block text-white font-medium px-3 py-2 rounded-lg hover:bg-pink-600"
            >
              Profile
            </Link>
            <Link to="/change-password" onClick={() => setIsOpen(false)} className="block text-white font-medium px-3 py-2 rounded-lg hover:bg-pink-600">Change Password</Link>

             <button className="w-full bg-white text-pink-500 px-5 py-2 rounded-lg font-semibold" onClick={logout}>
              LogOut
            </button>


            </> : <>
            
            <Link
              to="/register"
              onClick={() => setIsOpen(false)}
              className="block text-white font-medium px-3 py-2 rounded-lg hover:bg-pink-600"
            >
              Register
            </Link>

            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="block text-white font-medium px-3 py-2 rounded-lg hover:bg-pink-600"
            >
              Login
            </Link>

            </>}

             

           
          </div>
        )}
      </div>
    </nav>
  );
}

