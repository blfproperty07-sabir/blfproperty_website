import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiFacebook, 
  FiTwitter, 
  FiInstagram, 
  FiLinkedin,
  FiArrowUp
} from 'react-icons/fi';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-2">Eazy Property Solution</h3>
              <p className="text-gray-400 text-sm">& Construction</p>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Your trusted partner in real estate. We help you buy, sell, and rent properties 
              with ease and confidence. Building dreams, one property at a time.
            </p>
            <div className="flex space-x-4">
              <button 
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors duration-200"
                aria-label="Facebook"
                onClick={() => window.open('https://facebook.com', '_blank')}
              >
                <FiFacebook className="w-5 h-5" />
              </button>
              <button 
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors duration-200"
                aria-label="Twitter"
                onClick={() => window.open('https://twitter.com', '_blank')}
              >
                <FiTwitter className="w-5 h-5" />
              </button>
              <button 
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors duration-200"
                aria-label="Instagram"
                onClick={() => window.open('https://instagram.com', '_blank')}
              >
                <FiInstagram className="w-5 h-5" />
              </button>
              <button 
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors duration-200"
                aria-label="LinkedIn"
                onClick={() => window.open('https://linkedin.com', '_blank')}
              >
                <FiLinkedin className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'Properties', path: '/properties' },
                { name: 'About Us', path: '/about' },
                { name: 'Contact', path: '/contact' },
              ].map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="text-gray-300 hover:text-primary-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Our Services</h4>
            <ul className="space-y-3">
              {[
                'Property Sales',
                'Property Rentals',
                'Property Management',
                'Construction Services',
                'Property Valuation',
                'Legal Assistance',
              ].map((service) => (
                <li key={service}>
                  <span className="text-gray-300">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <FiMapPin className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-300 text-sm">
                  123 Property Street<br />
                  Real Estate City<br />
                  State - 123456
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <FiPhone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <a 
                  href="tel:+919876543210" 
                  className="text-gray-300 hover:text-primary-400 transition-colors duration-200"
                >
                  +91 98765 43210
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <FiMail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <a 
                  href="mailto:contact@eazyproperty.com" 
                  className="text-gray-300 hover:text-primary-400 transition-colors duration-200"
                >
                  contact@eazyproperty.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Eazy Property Solution & Construction. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6">
              <Link 
                to="/privacy" 
                className="text-gray-400 hover:text-primary-400 text-sm transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms" 
                className="text-gray-400 hover:text-primary-400 text-sm transition-colors duration-200"
              >
                Terms of Service
              </Link>
              <button
                onClick={scrollToTop}
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors duration-200"
                aria-label="Scroll to top"
              >
                <FiArrowUp className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;