import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Layout from "./Layout/Layout";
import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
import Profile from "./Pages/Profile/Profile";
import Register from "./Pages/Register/Register";
import Notfound from "./Pages/Notfound/Notfound";
import AuthContextprovider from "./context/AuthContext";
import ProtectedRoutes from "./protected/protectedRoutes";
import Protected from "./protected/protected";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PostDetails from "./Pages/PostDetails/Postdetails";
import ChangePassword from "./Pages/ChangePassword/ChangePassword";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();
const router = createBrowserRouter([{
  path: "/", element: <Layout />, children: [
    { index: true, element: <ProtectedRoutes><Home /></ProtectedRoutes> },
    { path: "home", element: <ProtectedRoutes><Home /></ProtectedRoutes> },
    { path: "login", element: <Protected><Login /></Protected> },
    { path: "register", element: <Protected><Register /></Protected> },
    { path: "postdetails/:id", element: <ProtectedRoutes><PostDetails /></ProtectedRoutes> },
    { path: "profile", element: <ProtectedRoutes><Profile /></ProtectedRoutes> },
    { path: "change-password", element: <ProtectedRoutes><ChangePassword /></ProtectedRoutes> },
    { path: "*", element: <Notfound /> }
  ]
}]);
export default function App() {
  return <QueryClientProvider client={queryClient}>
    <AuthContextprovider>
      <Toaster position="top-right" />
      <RouterProvider router={router} />
    </AuthContextprovider>
  </QueryClientProvider>;
}
