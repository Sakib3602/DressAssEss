import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "../App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import Register from "../AUTH/Register";
import Login from "../AUTH/Login";
import { AuthProvider } from "../AUTH/Authcontext";

const queryClient = new QueryClient();

const RoutesAll = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ToastContainer />
        <AuthProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};
export default RoutesAll;

// <Routes>
//   <Route index element={<Home />} />
//   <Route path="about" element={<About />} />

//   <Route element={<AuthLayout />}>
//     <Route path="login" element={<Login />} />
//     <Route path="register" element={<Register />} />
//   </Route>

//   <Route path="concerts">
//     <Route index element={<ConcertsHome />} />
//     <Route path=":city" element={<City />} />
//     <Route path="trending" element={<Trending />} />
//   </Route>
// </Routes>
