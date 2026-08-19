import { useState } from "react";
import { useForm, type FieldError } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./Authcontext";
import Nav from "../Components/HOME/Nav/Nav";
import Footer from "../Components/HOME/Footer";

type LoginFormValues = {
  phone: string;
  password: string;
};

const getMessage = (message: string | FieldError | undefined) =>
  typeof message === "string" ? message : "";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>();

  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: LoginFormValues) => {
    setServerError("");
    try {
      await login({ phone: data.phone, password: data.password });
      navigate("/");
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error !== null && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;

      setServerError(message || "Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF5F7] flex flex-col font-sans">
      {/* Navigation */}
      <Nav />
      
      {/* Main Container with top padding to prevent Nav overlap */}
      <div className="flex-1 flex pt-24 pb-12 px-4 sm:px-6 lg:px-8 items-center justify-center">
        
        {/* Split Screen Card */}
        <div className="w-full max-w-5xl bg-white rounded-none shadow-[0_20px_50px_-12px_rgba(225,29,72,0.1)] overflow-hidden flex flex-col lg:flex-row min-h-150 border border-rose-50">
          
          {/* Left Side: Elegant Brand Image (Hidden on mobile) */}
          <div className="hidden lg:block lg:w-1/2 relative bg-rose-100">
            {/* Soft pink silk/satin texture image for lingerie aesthetic */}
            <img 
              src="https://images.unsplash.com/photo-1599839770015-53df36f312a8?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Soft silk fabric texture" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Elegant gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-rose-900/80 via-rose-900/20 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
              <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold tracking-widest uppercase mb-4">
                New Collection
              </span>
              <h2 className="text-4xl font-serif mb-4 tracking-wide">Comfort Meets Elegance</h2>
              <p className="text-white/90 text-lg font-light leading-relaxed max-w-md">
                Discover intimate wear designed to make you feel beautiful, confident, and comfortable in your own skin.
              </p>
            </div>
          </div>

          {/* Right Side: Login Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 xl:p-16">
            <div className="w-full max-w-sm">
              
              <div className="text-center lg:text-left mb-10">
                <h1 className="text-3xl font-serif text-slate-800 mb-3 tracking-wide">Welcome Back...</h1>
                <p className="text-slate-500 font-light">Please enter your details to sign in.</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
                
                {/* Phone Number Input */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="01XXXXXXXXX"
                      className={`w-full pl-11 pr-4 py-3.5 rounded-none text-sm transition-all focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 bg-slate-50/50 ${
                        errors.phone ? 'border-red-300 bg-red-50' : 'border border-slate-200'
                      }`}
                      {...register("phone", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^01[3-9]\d{8}$/,
                          message: "Please enter a valid phone number",
                        },
                      })}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs font-medium text-red-500 mt-2 ml-1">
                      {getMessage(errors.phone.message)}
                    </p>
                  )}
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                      Password
                    </label>
                   
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className={`w-full pl-11 pr-12 py-3.5 rounded-none text-sm transition-all focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 bg-slate-50/50 ${
                        errors.password ? 'border-red-300 bg-red-50' : 'border border-slate-200'
                      }`}
                      {...register("password", {
                        required: "Password is required",
                        minLength: { value: 6, message: "Password must be at least 6 characters" },
                      })}
                    />
                    {/* Password Toggle Button */}
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-rose-500 transition-colors focus:outline-none"
                    >
                      {showPassword ? (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs font-medium text-red-500 mt-2 ml-1">
                      {getMessage(errors.password.message)}
                    </p>
                  )}
                </div>

                {/* Server Error Message */}
                {serverError && (
                  <div className="bg-red-50 text-red-600 rounded-xl p-3.5 text-sm flex items-start gap-2.5">
                    <svg className="w-5 h-5 shrink-0 mt-0.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="font-medium">{serverError}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-4 w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold text-base  py-4 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_8px_20px_-6px_rgba(244,63,94,0.4)] hover:shadow-[0_12px_24px_-8px_rgba(244,63,94,0.6)] hover:-translate-y-0.5 flex justify-center items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              {/* Registration Link */}
              <div className="mt-8 text-center">
                <p className="text-sm text-slate-500">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-rose-500 font-semibold hover:text-rose-600 transition-colors">
                    Create one
                  </Link>
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>



       <Footer></Footer>
    </div>
  );
}