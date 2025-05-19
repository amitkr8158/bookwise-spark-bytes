
import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { useGlobalContext } from "@/contexts/GlobalContext";
import HeaderLogo from "./HeaderLogo";
import HeaderDesktopNav from "./HeaderDesktopNav";
import HeaderDesktopActions from "./HeaderDesktopActions";
import HeaderMobileMenu from "./HeaderMobileMenu";

const Header = () => {
  const { isAuthenticated, user } = useGlobalContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        {/* Logo */}
        <HeaderLogo />

        {/* Desktop Navigation */}
        <HeaderDesktopNav />

        {/* Desktop Actions */}
        <HeaderDesktopActions />

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 rounded-full hover:bg-muted transition-colors"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Mobile Menu */}
        <HeaderMobileMenu 
          isMenuOpen={isMenuOpen} 
          setIsMenuOpen={setIsMenuOpen} 
        />
      </div>
    </header>
  );
};

export default Header;
