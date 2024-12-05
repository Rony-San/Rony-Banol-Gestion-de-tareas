import Footer from "@/components/ui/footer";
import Navbar from "@/components/ui/navbar";
import { UserAuthForm } from "@/molecules/authForm";
import { useState } from "react";

export default function LandingPage() {
  const [showAuthForm, setShowAuthForm] = useState(false);

  const handleAuthForm = () => {
    setShowAuthForm(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white w-full">
      <Navbar onAuthClick={handleAuthForm} />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-200 via-blue-800 to-blue-200 text-center py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold sm:text-5xl neon-text">
            Organiza tu vida, una tarea a la vez
          </h2>
          <p className="mt-4 text-lg sm:text-xl text-blue-200">
            Simplifica tus proyectos y mantente enfocado con TaskMaster, la
            herramienta definitiva de gestión de tareas.
          </p>
          <div className="mt-8">
            <button
              onClick={handleAuthForm}
              className="bg-blue-500 neon-button px-6 py-3 rounded-lg font-medium text-white shadow-lg transform transition-transform hover:scale-110">
              Comenzar Ahora
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-extrabold text-center text-blue-400 neon-text">
            Características Principales
          </h3>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-blue-900 p-6 rounded-lg shadow-lg text-center transform transition-transform hover:scale-105">
              <h4 className="text-xl font-bold text-blue-300">
                Organización Simple
              </h4>
              <p className="mt-2 text-blue-100">
                Crea y gestiona tareas fácilmente con nuestra interfaz
                intuitiva.
              </p>
            </div>
            <div className="bg-blue-900 p-6 rounded-lg shadow-lg text-center transform transition-transform hover:scale-105">
              <h4 className="text-xl font-bold text-blue-300">Colaboración</h4>
              <p className="mt-2 text-blue-100">
                Trabaja con tu equipo en tiempo real, sin complicaciones.
              </p>
            </div>
            <div className="bg-blue-900 p-6 rounded-lg shadow-lg text-center transform transition-transform hover:scale-105">
              <h4 className="text-xl font-bold text-blue-300">Integraciones</h4>
              <p className="mt-2 text-blue-100">
                Maneja tu tiempo y espacio con nuestra herramienta.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Auth Form Modal */}
      {showAuthForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-white">
          <div className="bg-blue-800 bg-opacity-60 p-8 rounded-lg shadow-lg max-w-md w-full">
            <UserAuthForm />
            <button
              onClick={() => setShowAuthForm(false)}
              className="mt-4 bg-red-500 p-1 w-1/5 rounded-xl text-white hover:text-red-600 transition-colors">
              Cerrar
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
