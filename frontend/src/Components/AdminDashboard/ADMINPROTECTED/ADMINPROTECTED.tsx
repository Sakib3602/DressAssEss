
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../../AUTH/Authcontext";


interface AdminProtectedProps {
  children: ReactNode;
}

const ADMINPROTECTED = ({ children }: AdminProtectedProps) => {
  const { user, loading } = useAuth();


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">
        Loading...
      </div>
    );
  }


  if (!user) {
    return <Navigate to="/login" replace />;
  }

 
  if (user.isActive === false) {
    return <Navigate to="/login" replace />;
  }


  if (user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  
  return <>{children}</>;
};

export default ADMINPROTECTED;