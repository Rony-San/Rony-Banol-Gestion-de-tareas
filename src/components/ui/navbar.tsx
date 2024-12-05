import React from "react";

interface NavbarProps {
  onAuthClick: () => void; // Define la función que se ejecutará al hacer clic en "Iniciar Sesión"
}

const Navbar: React.FC<NavbarProps> = ({ onAuthClick }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
        <h1 className="text-2xl font-bold text-gray-900">TaskMaster</h1>
        <nav className="space-x-4">
          <button
            onClick={onAuthClick}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500">
            Iniciar Sesión
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
