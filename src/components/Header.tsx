import React, { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router";
import {
  Search,
  ShoppingBag,
  Heart,
  User as UserIcon,
  ChevronDown,
  X,
  Truck,
  Globe,
  Check,
  Menu,
  ShieldCheck,
  LogOut,
  Circle
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import { toggleCartOpen } from "../store/cartSlice";
import { toggleWishlistOpen } from "../store/wishlistSlice";
import { logout } from "../store/authSlice";
import { AuthModal } from "./AuthModal";

export const Header: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();

  // Redux States
  const cartItems = useAppSelector(state => state.cart.items);
  const wishlistItems = useAppSelector(state => state.wishlist.items);
  const { user, isAuthenticated } = useAppSelector(state => state.auth);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Scroll state
  const [isScrolled, setIsScrolled] = useState(false);

  // Search Input State
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  // Modals & Menus
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [currency, setCurrency] = useState("USD ($)");
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [language, setLanguage] = useState("EN");
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchQuery.trim()) {
      newParams.set("q", searchQuery.trim());
    } else {
      newParams.delete("q");
    }
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const handleCategoryClick = (categorySlug: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (categorySlug !== "all") {
      newParams.set("category", categorySlug);
    } else {
      newParams.delete("category");
    }
    newParams.set("page", "1");
    setSearchParams(newParams);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="relative w-full z-40 bg-black text-white select-none">
      
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-black text-zinc-400 text-xs py-2 px-4 border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="hidden md:flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
              <Truck className="w-3.5 h-3.5 text-zinc-300" /> Free Express Shipping over $75
            </span>
            <span className="text-zinc-700">•</span>
            <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-300" /> Authenticity Guaranteed
            </span>
          </div>

          <div className="flex-1 text-center font-medium tracking-wide text-zinc-200 text-xs">
            SEASON SALE: UP TO 40% OFF &nbsp;•&nbsp; USE CODE <span className="underline font-bold text-white">CIRCLE</span>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-xs">
            <div className="relative">
              <button
                onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-zinc-400" />
                <span>{currency}</span>
                <ChevronDown className="w-3 h-3 text-zinc-500" />
              </button>
              {isCurrencyOpen && (
                <div className="absolute right-0 mt-1 w-28 bg-zinc-950 border border-zinc-800 rounded-lg shadow-xl py-1 z-50">
                  {["USD ($)", "EUR (€)", "GBP (£)", "CAD ($)"].map(c => (
                    <button
                      key={c}
                      onClick={() => { setCurrency(c); setIsCurrencyOpen(false); }}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-zinc-800 flex items-center justify-between ${
                        currency === c ? "text-white font-bold bg-zinc-900" : "text-zinc-400"
                      }`}
                    >
                      {c}
                      {currency === c && <Check className="w-3 h-3 text-white" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="text-zinc-800">|</span>

            <div className="relative">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                <span>{language}</span>
                <ChevronDown className="w-3 h-3 text-zinc-500" />
              </button>
              {isLanguageOpen && (
                <div className="absolute right-0 mt-1 w-24 bg-zinc-950 border border-zinc-800 rounded-lg shadow-xl py-1 z-50">
                  {["EN", "ES", "FR", "DE"].map(l => (
                    <button
                      key={l}
                      onClick={() => { setLanguage(l); setIsLanguageOpen(false); }}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-zinc-800 flex items-center justify-between ${
                        language === l ? "text-white font-bold bg-zinc-900" : "text-zinc-400"
                      }`}
                    >
                      {l}
                      {language === l && <Check className="w-3 h-3 text-white" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER NAVBAR */}
      <div className={`sticky top-0 bg-black border-b border-zinc-800/80 transition-all ${isScrolled ? "py-3 shadow-2xl" : "py-4"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6">
          
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-1.5 text-zinc-400 hover:text-white transition-colors"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
              <Circle className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xl sm:text-2xl font-black tracking-widest text-white uppercase">
              Shop<span className="font-light text-zinc-400 group-hover:text-white transition-colors">Circle</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-zinc-400">
            <button onClick={() => handleCategoryClick("all")} className="hover:text-white transition-colors">All Products</button>
            <button onClick={() => handleCategoryClick("beauty")} className="hover:text-white transition-colors">Beauty</button>
            <button onClick={() => handleCategoryClick("fragrances")} className="hover:text-white transition-colors">Fragrances</button>
            <button onClick={() => handleCategoryClick("furniture")} className="hover:text-white transition-colors">Furniture</button>
            <button onClick={() => handleCategoryClick("groceries")} className="hover:text-white transition-colors">Groceries</button>
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Search Bar */}
            <div ref={searchContainerRef} className="relative hidden sm:block w-48 md:w-64">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-full py-1.5 pl-9 pr-8 text-xs text-white placeholder-zinc-500 focus:border-white focus:outline-none transition-colors"
                />
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 pointer-events-none" />
                {searchQuery && (
                  <button type="button" onClick={() => { setSearchQuery(""); handleSearchSubmit(new Event('submit') as any); }} className="absolute right-3 text-zinc-500 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </form>
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => dispatch(toggleWishlistOpen(true))}
              className="relative p-2 rounded-full text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute top-0 right-0 bg-white text-black font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-black">
                  {wishlistItems.length}
                </span>
              )}
            </button>

            {/* User Profile / Auth Button */}
            <div ref={userMenuRef} className="relative">
              {isAuthenticated && user ? (
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1.5 p-1 rounded-full text-zinc-300 hover:text-white transition-colors"
                >
                  <img src={user.image} alt={user.firstName} className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 object-cover" />
                </button>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="p-2 rounded-full text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
                  title="Sign In (DummyJSON Auth)"
                >
                  <UserIcon className="w-5 h-5" />
                </button>
              )}

              {isUserMenuOpen && isAuthenticated && user && (
                <div className="absolute right-0 mt-2 w-56 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl p-2 z-50 text-white text-xs">
                  <div className="p-3 border-b border-zinc-800 mb-1 flex items-center gap-2">
                    <img src={user.image} alt="" className="w-8 h-8 rounded-full bg-zinc-800" />
                    <div className="min-w-0">
                      <div className="font-bold truncate">{user.firstName} {user.lastName}</div>
                      <div className="text-[10px] text-zinc-400 truncate">{user.email}</div>
                    </div>
                  </div>
                  <div className="p-2 text-[10px] text-zinc-500 font-mono">JWT Token Active</div>
                  <div className="border-t border-zinc-800 my-1 pt-1">
                    <button
                      onClick={() => { dispatch(logout()); setIsUserMenuOpen(false); }}
                      className="w-full text-left p-2 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-lg flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Cart Button */}
            <button
              onClick={() => dispatch(toggleCartOpen(true))}
              className="bg-white hover:bg-zinc-200 text-black font-bold px-3.5 py-1.5 rounded-full text-xs flex items-center gap-2 transition-all shadow-md active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="font-extrabold">{totalCartCount}</span>
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative w-3/4 max-w-xs bg-zinc-950 border-r border-zinc-800 h-full p-5 flex flex-col z-10 text-white">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
              <span className="font-black text-lg tracking-widest uppercase">ShopCircle</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 font-semibold text-sm">
              <button onClick={() => handleCategoryClick("all")} className="block py-2 text-white border-b border-zinc-900 w-full text-left">All Products</button>
              <button onClick={() => handleCategoryClick("beauty")} className="block py-2 text-zinc-300 hover:text-white w-full text-left">Beauty</button>
              <button onClick={() => handleCategoryClick("fragrances")} className="block py-2 text-zinc-300 hover:text-white w-full text-left">Fragrances</button>
              <button onClick={() => handleCategoryClick("furniture")} className="block py-2 text-zinc-300 hover:text-white w-full text-left">Furniture</button>
              <button onClick={() => handleCategoryClick("groceries")} className="block py-2 text-zinc-300 hover:text-white w-full text-left">Groceries</button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal Trigger */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  );
};

export default Header;
