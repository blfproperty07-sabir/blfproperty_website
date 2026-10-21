import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ShoppingBag, KeyRound, Building2, Info, Phone, Search, Menu, X, ChevronDown, UserRound, LogOut, LayoutDashboard, Plus, ArrowUpRight } from 'lucide-react';
import BrandLogo from '../../common/brand/BrandLogo.jsx';
import Button from '../../common/button/Button.jsx';
import useNavbar from './useNavbar';

const iconMap = {
  Home, Buy: ShoppingBag, Rent: KeyRound, Properties: Building2,
  About: Info, Contact: Phone,
};

const Navbar = () => {
  const {
    user, navigationLinks, isMenuOpen, isAccountMenuOpen,
    setIsMenuOpen, setIsAccountMenuOpen, isActive, closeMenus,
    handleLogout, dashboardPath,
  } = useNavbar();

  const renderLinks = (mobile = false) => navigationLinks.map((link) => {
    const Icon = iconMap[link.label] || Building2;
    const active = isActive(link.to);

    return (
      <Link
        key={link.to}
        to={link.to}
        onClick={closeMenus}
        aria-current={active ? 'page' : undefined}
        className={`group inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold no-underline transition-all duration-200 ${
          active
            ? 'bg-blue-950/[0.06] text-blue-950'
            : 'text-slate-600 hover:bg-slate-100 hover:text-blue-950'
        } ${mobile ? 'w-full justify-start' : ''}`}
      >
        <Icon size={16} strokeWidth={1.8} className={active ? 'text-red-600' : 'text-slate-400 group-hover:text-blue-950'} />
        {link.label}
        {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-red-600 xl:hidden" />}
      </Link>
    );
  });

  const accountLinks = (
    <>
      <Link to="/profile" onClick={closeMenus} role="menuitem" className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 no-underline hover:bg-slate-50">
        <UserRound size={16} /> Profile
      </Link>
      <Link to={dashboardPath} onClick={closeMenus} role="menuitem" className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 no-underline hover:bg-slate-50">
        <LayoutDashboard size={16} /> Dashboard
      </Link>
      {(user?.role === 'seller' || user?.role === 'admin') && (
        <Link to="/dashboard" onClick={closeMenus} role="menuitem" className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 no-underline hover:bg-slate-50">
          <Plus size={16} /> List a property
        </Link>
      )}
      <button type="button" role="menuitem" onClick={handleLogout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50">
        <LogOut size={16} /> Sign out
      </button>
    </>
  );

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4 lg:px-8">
      <nav
        aria-label="Main navigation"
        className="relative mx-auto flex min-h-[76px] max-w-[1500px] items-center justify-between gap-3 rounded-2xl border border-white/80 bg-white/85 px-4 shadow-[0_12px_45px_rgba(15,23,42,0.09)] backdrop-blur-2xl sm:px-5 lg:gap-5 lg:px-6"
      >
        <Link to="/" onClick={closeMenus} className="group flex min-w-0 shrink-0 items-center gap-2.5 text-slate-900 no-underline sm:gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white ring-1 ring-slate-200/80 sm:h-12 sm:w-12">
            <BrandLogo className="h-full w-full object-contain" />
          </span>
          <span className="flex min-w-0 flex-col gap-1">
            <span className="whitespace-nowrap text-[19px] font-black leading-none tracking-[-0.055em] text-blue-950 sm:text-[22px]">
              BLF <span className="font-semibold tracking-[-0.045em] text-slate-700">Property</span>
            </span>
            <span className="whitespace-nowrap text-[8px] font-bold uppercase tracking-[0.13em] text-slate-500 sm:text-[9px] sm:tracking-[0.16em]">
              Trusted Property Solutions
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-0.5 rounded-2xl border border-slate-100 bg-slate-50/80 p-1 lg:flex">
          {renderLinks()}
        </div>

        <div className="hidden shrink-0 items-center gap-2 xl:flex">
          <a href="tel:+911234567890" className="mr-1 flex items-center gap-2 rounded-xl px-2 py-2 text-slate-700 no-underline transition hover:bg-slate-50">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600"><Phone size={17} /></span>
            <span className="flex flex-col">
              <span className="text-[10px] font-medium text-slate-400">Talk to an expert</span>
              <span className="text-xs font-bold text-slate-800">Contact us</span>
            </span>
          </a>

          <span className="h-8 w-px bg-slate-200" />

          <Button
            type="button"
            variant="ghost"
            aria-label="Search properties"
            title="Search properties"
            onClick={() => window.location.assign('/properties')}
            className="!flex !h-10 !w-10 !items-center !justify-center !rounded-xl !border !border-slate-200 !bg-white !p-0 !text-slate-700 transition hover:!border-slate-300 hover:!bg-slate-50"
          >
            <Search size={18} />
          </Button>

          {user ? (
            <div className="relative">
              <Button
                type="button"
                variant="ghost"
                aria-expanded={isAccountMenuOpen}
                aria-haspopup="menu"
                onClick={() => setIsAccountMenuOpen((open) => !open)}
                className="!flex !min-h-10 !items-center !gap-2 !rounded-xl !border !border-slate-200 !bg-white !px-3 !py-2 !text-slate-700"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-950 text-xs font-bold text-white">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
                <span className="max-w-[100px] truncate text-sm font-semibold">{user.name}</span>
                <ChevronDown size={15} />
              </Button>
              {isAccountMenuOpen && (
                <div role="menu" className="absolute right-0 top-[calc(100%+10px)] z-50 w-52 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
                  {accountLinks}
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="inline-flex min-h-10 items-center rounded-xl px-3 text-sm font-semibold text-slate-700 no-underline transition hover:bg-slate-50 hover:text-blue-950">
                Sign in
              </Link>
              <Link to="/register" className="group inline-flex min-h-10 items-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-bold text-white no-underline shadow-[0_5px_14px_rgba(220,38,38,0.20)] transition hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-lg">
                Create account <ArrowUpRight size={16} />
              </Link>
            </>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2 lg:hidden">
          <Button
            type="button"
            variant="ghost"
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMenuOpen}
            aria-controls="blf-mobile-navigation"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="!flex !h-10 !w-10 !items-center !justify-center !rounded-xl !border !border-slate-200 !bg-white !p-0 !text-blue-950"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>

        {isMenuOpen && (
          <div id="blf-mobile-navigation" className="absolute inset-x-0 top-[calc(100%+10px)] z-50 max-h-[calc(100vh-120px)] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_20px_50px_rgba(15,23,42,0.16)] lg:hidden sm:inset-x-0">
            <div className="grid gap-1">{renderLinks(true)}</div>
            <div className="mt-3 grid gap-1 border-t border-slate-100 pt-3">
              {user ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-slate-800">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-950 text-white">{user.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                    {user.name}
                  </div>
                  {accountLinks}
                </>
              ) : (
                <>
                  <Link to="/properties" onClick={closeMenus} className="flex min-h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-slate-700 no-underline hover:bg-slate-50">
                    <Search size={16} /> Search properties
                  </Link>
                  <Link to="/login" onClick={closeMenus} className="flex min-h-10 items-center rounded-xl px-3 text-sm font-semibold text-slate-700 no-underline hover:bg-slate-50">Sign in</Link>
                  <Link to="/register" onClick={closeMenus} className="mt-1 flex min-h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-bold text-white no-underline hover:bg-red-700">
                    Create account <ArrowUpRight size={16} />
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
