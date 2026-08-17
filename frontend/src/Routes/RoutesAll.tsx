import { BrowserRouter, Routes, Route } from "react-router";
import App from "../App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";

const queryClient = new QueryClient();

const RoutesAll = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<App />} />
        </Routes>
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
