import { useState, useEffect } from "react";
// ড্যাশবোর্ড এবং লগআউটের জন্য নতুন আইকন ইম্পোর্ট করা হলো
import { User, UserCog, ShoppingBag, ChevronDown, Menu, X, ArrowRight, LayoutDashboard, LogOut } from "lucide-react";

// ⚠️ আপনার logo file অনুযায়ী path ঠিক করে নিন
import logo from "../../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../AUTH/Authcontext";

const shopCategories = [
  "All Products",
  "Bra's",
  "Panties",
  "Exported Inner",
  "Exported Panties",
  "Night Dress",
  "Co-ord Sets",
  "Ladies Bags",
  "3 Piece's",
  "Combo Offers",
];

export default function Nav() {
  const [shopOpen, setShopOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  
  // logout ফাংশনটিও আনা হলো
  const { user, logout } = useAuth(); 
  const navigate = useNavigate();

  // Role and active status validation
  const isAdmin = user && user.isActive === true && user.role === "ADMIN";
  const isCustomer = user && (user.role === "USER" || user.role === "CUSTOMER");

  const handleLogout = () => {
    if (logout) {
      logout();
    }
    navigate("/login");
  };

  // Prevent body scrolling when full-screen mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileOpen]);

  return (
    <>
      <nav className="w-full bg-white border-b border-gray-100">
        <div className="max-w-[1536px] mx-auto px-6 lg:px-12 flex items-center justify-between h-24 md:h-28">
          
          {/* -------- Left: Logo -------- */}
          <div className="flex-1 flex justify-start items-center">
            <a href="/" className="flex items-center">
              <img src={logo} alt="Shop logo" className="h-12 md:h-16 w-auto object-contain" />
            </a>
          </div>

          {/* -------- Center: Nav links (Desktop) -------- */}
          <div className="hidden lg:flex items-center justify-center gap-8 xl:gap-12">
            <a
              href="/"
              className="text-[14px] xl:text-[15px] uppercase tracking-widest font-medium text-black hover:text-gray-500 transition-colors relative group"
            >
              Home
              <span className="absolute -bottom-1.5 left-0 w-0 h-[2px] bg-gray-800 transition-all duration-300 group-hover:w-full"></span>
            </a>

            <div
              className="relative h-24 md:h-28 flex items-center group"
              onMouseEnter={() => setShopOpen(true)}
              onMouseLeave={() => setShopOpen(false)}
            >
              <button className="flex items-center gap-1.5 text-[14px] xl:text-[15px] uppercase tracking-widest font-medium text-black hover:text-gray-500 transition-colors">
                Shop 
                <ChevronDown size={16} strokeWidth={1.5} className={`transition-transform duration-300 ${shopOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Desktop Dropdown */}
              <div 
                className={`absolute top-full left-1/2 -translate-x-1/2 w-64 bg-white border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.06)] rounded-b-xl transition-all duration-300 transform origin-top z-50 ${
                  shopOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0 pointer-events-none"
                }`}
              >
                <div className="py-3">
                  {shopCategories.map((item) => (
                    <a
                      key={item}
                      href={`/shop/${item.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                      className="flex items-center justify-between px-6 py-2.5 text-sm tracking-wide text-black hover:bg-gray-50 hover:text-gray-900 hover:pl-8 transition-all duration-300"
                    >
                      {item}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <a
              href="/bestseller"
              className="text-[14px] xl:text-[15px] uppercase tracking-widest font-medium text-black hover:text-gray-500 transition-colors relative group"
            >
              Bestseller
              <span className="absolute -bottom-1.5 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
            </a>

            <a
              href="/combo-offers"
              className="text-[14px] xl:text-[15px] uppercase tracking-widest font-medium text-gray-800 hover:text-gray-500 transition-colors relative group"
            >
              Combo Offers
              <span className="absolute -bottom-1.5 left-0 w-0 h-[2px] bg-gray-800 transition-all duration-300 group-hover:w-full"></span>
            </a>
          </div>

          {/* -------- Right: Icons & Mobile Menu Toggle -------- */}
          <div className="flex-1 flex justify-end items-center gap-5 md:gap-7">
            
            {/* User Logic Implementation for Desktop */}
            {isAdmin ? (
              <div className="hidden sm:flex items-center gap-5">
                <Link to="/admin" aria-label="Admin Dashboard" className="text-gray-800 hover:text-gray-500 transition-colors">
                  <UserCog size={22} strokeWidth={1.5} />
                </Link>
                <button onClick={handleLogout} aria-label="Logout" className="text-rose-600 hover:text-rose-400 transition-colors">
                  <LogOut size={22} strokeWidth={1.5} />
                </button>
              </div>
            ) : isCustomer ? (
              <div className="hidden sm:flex items-center gap-5">
                <Link to="/account" aria-label="Dashboard" className="text-gray-800 hover:text-gray-500 transition-colors">
                  <LayoutDashboard size={22} strokeWidth={1.5} />
                </Link>
                <button onClick={handleLogout} aria-label="Logout" className="text-rose-600 hover:text-rose-400 transition-colors">
                  <LogOut size={22} strokeWidth={1.5} />
                </button>
              </div>
            ) : (
              <Link to="/login" aria-label="Login" className="text-gray-800 hover:text-gray-500 transition-colors hidden sm:block">
                <User size={22} strokeWidth={1.5} />
              </Link>
            )}
            
            {/* Cart Icon */}
            <a
              href="/cart"
              aria-label="Cart"
              className="relative text-gray-800 hover:text-gray-500 transition-colors flex items-center"
            >
              <ShoppingBag size={22} strokeWidth={1.5} />
              <span className="absolute -top-1.5 -right-2 bg-gray-900 text-white text-[10px] font-bold w-4.5 h-4.5 px-1.5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                0
              </span>
            </a>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-gray-800 hover:text-gray-500 transition-colors ml-2"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={26} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </nav>

      {/* =========================================
          FULL SCREEN MOBILE MENU
          ========================================= */}
      <div 
        className={`fixed inset-0 bg-white z-[110] flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 h-24 border-b border-gray-100 bg-white">
          <img src={logo} alt="Shop logo" className="h-10 md:h-12 w-auto object-contain" />
          <button 
            className="p-2 -mr-2 text-gray-800 hover:bg-gray-100 transition-colors rounded-full"
            onClick={() => setMobileOpen(false)}
          >
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-10 flex flex-col gap-6">
          <a href="/" className="text-2xl font-light text-gray-800 hover:text-gray-500 transition-colors tracking-wide">Home</a>
          
          <div>
            <button 
              className="w-full flex items-center justify-between text-2xl font-light text-gray-800 hover:text-gray-500 transition-colors tracking-wide pb-2"
              onClick={() => setMobileShopOpen(!mobileShopOpen)}
            >
              Shop
              <ChevronDown size={24} strokeWidth={1} className={`transition-transform duration-300 ${mobileShopOpen ? "rotate-180" : ""}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${mobileShopOpen ? "max-h-[500px] opacity-100 mt-4" : "max-h-0 opacity-0"}`}>
              <div className="flex flex-col gap-4 pl-4 border-l-2 border-gray-200">
                {shopCategories.map((item) => (
                  <a key={item} href={`/shop/${item.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} className="flex items-center justify-between text-base text-gray-600 hover:text-gray-900 transition-colors tracking-wider group">
                    {item}
                    <ArrowRight size={14} strokeWidth={1.5} className="text-gray-300 group-hover:text-gray-900 transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <a href="/bestseller" className="text-2xl font-light text-gray-800 hover:text-gray-500 transition-colors tracking-wide">Bestseller</a>
          <a href="/combo-offers" className="text-2xl font-light text-gray-800 hover:text-gray-500 transition-colors tracking-wide">Combo Offers</a>
        </div>

        {/* User Logic Implementation for Mobile Bottom Bar */}
        <div className="p-6 bg-gray-50 flex items-center justify-center gap-8 border-t border-gray-100">
          {isAdmin ? (
            <>
              <Link to="/admin" className="flex flex-col items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                <UserCog size={24} strokeWidth={1.5} />
                <span className="text-xs uppercase tracking-widest font-medium">Admin</span>
              </Link>
              <button onClick={handleLogout} className="flex flex-col items-center gap-2 text-rose-500 hover:text-rose-700 transition-colors">
                <LogOut size={24} strokeWidth={1.5} />
                <span className="text-xs uppercase tracking-widest font-medium">Logout</span>
              </button>
            </>
          ) : isCustomer ? (
            <>
              <Link to="/account" className="flex flex-col items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                <LayoutDashboard size={24} strokeWidth={1.5} />
                <span className="text-xs uppercase tracking-widest font-medium">Dashboard</span>
              </Link>
              <button onClick={handleLogout} className="flex flex-col items-center gap-2 text-rose-500 hover:text-rose-700 transition-colors">
                <LogOut size={24} strokeWidth={1.5} />
                <span className="text-xs uppercase tracking-widest font-medium">Logout</span>
              </button>
            </>
          ) : (
            <Link to="/login" className="flex flex-col items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <User size={24} strokeWidth={1.5} />
              <span className="text-xs uppercase tracking-widest font-medium">Login</span>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}