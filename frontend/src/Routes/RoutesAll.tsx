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
import AdminOrders from "../Components/AdminDashboard/AdminOrders";
import AdminAddProduct from "../Components/AdminDashboard/AdminAddProduct";
import AdminAllProducts from "../Components/AdminDashboard/AdminAllProducts";
import AdminCustomers from "../Components/AdminDashboard/AdminCustomers";
import AdminReport from "../Components/AdminDashboard/AdminReport";

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
              <Route path="orders" element={<AdminOrders />} />
              <Route path="add-products" element={<AdminAddProduct />} />
              <Route path="all-products" element={<AdminAllProducts />} />
              <Route path="all-customers" element={<AdminCustomers />} />
              <Route path="reports" element={<AdminReport />} />
              <Route path="admin-all-products" element={<AdminAllProducts />} />

            </Route>
          </Routes>

        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default RoutesAll;