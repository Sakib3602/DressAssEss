import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";

import App from "../App";
import Register from "../AUTH/Register";
import Login from "../AUTH/Login";
import { AuthProvider } from "../AUTH/Authcontext";

import ADMINPROTECTED from "../Components/AdminDashboard/ADMINPROTECTED/ADMINPROTECTED";
import AdminHome from "../Components/AdminDashboard/AdminHome";
import AdminDashboard from "../Components/AdminDashboard/AdminDashboard";

const queryClient = new QueryClient();

const RoutesAll = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ToastContainer />

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<App />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin Routes */}
            <Route
              path="/dashboard/secure/protected"
              element={
                <ADMINPROTECTED>
                  <AdminHome />
                </ADMINPROTECTED>
              }
            >
              <Route index element={<AdminDashboard />} />
            </Route>
          </Routes>

        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default RoutesAll;