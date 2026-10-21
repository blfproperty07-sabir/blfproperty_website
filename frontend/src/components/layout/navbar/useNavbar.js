import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const navigationLinks = [
  { to: '/', label: 'Home' },
  { to: '/properties?listingType=sale', label: 'Buy' },
  { to: '/properties?listingType=rent', label: 'Rent' },
  { to: '/properties', label: 'Properties' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const useNavbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const isActive = (to) => {
    const [pathname, search = ''] = to.split('?');
    if (pathname !== location.pathname) return false;
    if (!search) return location.pathname !== '/properties' || !location.search;
    return new URLSearchParams(location.search).get('listingType')
      === new URLSearchParams(search).get('listingType');
  };

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsAccountMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenus();
  };

  return {
    user,
    navigationLinks,
    isMenuOpen,
    isAccountMenuOpen,
    setIsMenuOpen,
    setIsAccountMenuOpen,
    isActive,
    closeMenus,
    handleLogout,
    dashboardPath: user?.role === 'admin' ? '/admin/dashboard' : '/dashboard',
  };
};

export default useNavbar;
