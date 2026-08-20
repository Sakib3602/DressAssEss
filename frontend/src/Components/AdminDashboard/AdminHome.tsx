import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { 
  Activity, 
  Home, 
  ShoppingBag, 
  PlusCircle, 
  Package, 
  Users, 
  FileText, 
  CreditCard, 
  Truck,
  Settings,
  LogOut, 
  Menu,
  X
} from "lucide-react";

// মেইন মেন্যু আইটেমগুলোর লিস্ট
const mainNavItems = [
  { label: "Dashboard", to: "/dashboard", icon: <Home size={19} /> },
  { label: "Orders", to: "/dashboard/secure/protected/orders", icon: <ShoppingBag size={19} /> },
  { label: "Add Product", to: "/dashboard/secure/protected/add-products", icon: <PlusCircle size={19} /> },
  { label: "Inventory", to: "/dashboard/secure/protected/all-products", icon: <Package size={19} /> },
  { label: "Customers", to: "/dashboard/secure/protected/all-customers", icon: <Users size={19} /> },
  { label: "Payments", to: "/dashboard/payments", icon: <CreditCard size={19} /> },
  { label: "All Products", to: "/dashboard/secure/protected/admin-all-products", icon: <Package size={19} /> },
  { label: "Reports", to: "/dashboard/secure/protected/reports", icon: <FileText size={19} /> },
  { label: "Steadfast Courier", to: "/dashboard/secure/protected/steadfast", icon: <Truck size={19} /> },
  { label: "Settings", to: "/dashboard/settings", icon: <Settings size={19} /> },
];

export default function AdminHome() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/dashboard" && location.pathname === "/dashboard") return true;
    if (path !== "/dashboard") {
      return location.pathname.includes(path);
    }
    return false;
  };

  return (
    <div 
      // h-screen ব্যবহার করা হয়েছে যেন শুধু ভেতরের অংশ স্ক্রল হয়
      className="h-screen w-full bg-[#13171F] flex flex-col lg:flex-row p-2 sm:p-3 md:p-4 gap-3 md:gap-4 text-slate-100 antialiased overflow-hidden"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      
      {/* ---------------- মোবাইল টপবার ---------------- */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#1A1F2B] rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 text-white">
          <Activity className="w-6 h-6 text-white" />
          <span className="text-lg font-bold tracking-wide">DressAssEss</span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl bg-slate-800/60 text-slate-200 hover:text-white"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ---------------- সাইডবার ---------------- */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#13171F] p-4 flex flex-col justify-between transition-transform duration-300 ease-in-out h-full
        lg:static lg:translate-x-0 lg:p-2 lg:w-[240px] xl:w-[260px]
        ${mobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:shadow-none"}
      `}>
        <div className="flex flex-col gap-6 overflow-hidden h-full">
          {/* Logo (Desktop) */}
          <div className="hidden lg:flex items-center gap-3 px-3 pt-2 text-white shrink-0">
            <Activity className="w-6 h-6 text-white" />
            <span className="text-lg xl:text-xl font-bold tracking-wide">DressAssEss</span>
          </div>

          {/* মেনু আইটেমস (স্ক্রলবার হাইড করা হয়েছে) */}
          <nav className="flex flex-col gap-1 overflow-y-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {mainNavItems.map((item) => (
              <NavItem 
                key={item.label}
                icon={item.icon} 
                label={item.label} 
                to={item.to} 
                active={isActive(item.to)} 
                onClick={() => setMobileMenuOpen(false)} 
              />
            ))}
            <div className="my-4 mx-3 border-t border-slate-800/80"></div>
          </nav>
        </div>

        {/* Log out */}
        <div className="pt-4 border-t border-slate-800/60 lg:border-none shrink-0">
          <NavItem 
            icon={<LogOut size={19} />} 
            label="Log out" 
            to="/logout" 
            active={false} 
            onClick={() => setMobileMenuOpen(false)} 
          />
        </div>
      </aside>

      {/* মোবাইল ব্যাকড্রপ */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)} 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* ---------------- মেইন কার্ড কন্টেইনার ---------------- */}
      <main className="flex-1 bg-[#F2EFE9] rounded-[24px] md:rounded-[28px] lg:rounded-[32px] flex flex-col overflow-hidden h-full shadow-lg relative">
        
        {/* টপ হেডার */}
        <header className="flex items-center justify-between px-6 sm:px-8 md:px-10 pt-7 pb-4 shrink-0">
          <h1 className="text-2xl md:text-3xl font-bold text-[#141821] tracking-tight">
            Admin Panel
          </h1>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 ml-1 pl-1">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop" 
                alt="Admin User" 
                className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-xs" 
              />
              <div className="hidden sm:block">
                <div className="font-bold text-xs md:text-sm text-[#141821]">Admin User</div>
                <div className="text-slate-400 text-[11px] font-medium leading-tight">admin@dressassess.com</div>
              </div>
            </div>
          </div>
        </header>

        {/* আউটলেট (স্ক্রলবার হাইড করা হয়েছে) */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 md:px-10 py-4 text-[#141821] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <Outlet />
        </div>
      </main>

    </div>
  );
}

// সাইডবার লিঙ্ক কম্পোনেন্ট
function NavItem({ 
  icon, 
  label, 
  to, 
  active, 
  onClick 
}: { 
  icon: React.ReactNode, 
  label: string, 
  to: string, 
  active: boolean, 
  onClick: () => void 
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 ${
        active
          ? "bg-white text-[#13171F] shadow-sm"
          : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/40"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}