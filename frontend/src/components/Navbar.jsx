import { Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  LogOut,
  BarChart3,
  Plus,
  List,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import ThemeToggle from "./ThemeToggle";
import toast from "react-hot-toast";

const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Sesión cerrada exitosamente");
    navigate("/login");
  };

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg border-b border-secondary-200/50 dark:border-gray-700/50 transition-all duration-300 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo y navegación principal */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-3 group">
              <div className="relative h-10 w-10 bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Calendar className="h-6 w-6 text-white" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-yellow-300 opacity-0 group-hover:opacity-100 animate-pulse" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-secondary-900 to-primary-600 dark:from-white dark:to-primary-400 bg-clip-text text-transparent">
                EventosApp
              </span>
            </Link>

            {/* Navegación */}
            <div className="hidden md:ml-10 md:flex md:space-x-2">
              <Link
                to="/dashboard"
                className="text-secondary-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:scale-105"
              >
                Dashboard
              </Link>
              <Link
                to="/events"
                className="text-secondary-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:scale-105 flex items-center space-x-1"
              >
                <List className="h-4 w-4" />
                <span>Eventos</span>
              </Link>
              <Link
                to="/events/new"
                className="text-secondary-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:scale-105 flex items-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>Nuevo Evento</span>
              </Link>
              <Link
                to="/stats"
                className="text-secondary-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:scale-105 flex items-center space-x-1"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Estadísticas</span>
              </Link>
            </div>
          </div>

          {/* Usuario, tema y logout */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-secondary-900 dark:text-white">
                  {user?.username}
                </p>
                <p className="text-xs text-secondary-500 dark:text-gray-400">
                  {user?.role === "admin" ? "Administrador" : "Usuario"}
                </p>
              </div>
              <div className="relative h-10 w-10 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                <span className="text-sm font-bold text-primary-700 dark:text-primary-300 group-hover:text-primary-800 dark:group-hover:text-primary-200 transition-colors duration-200">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>

            {/* Botón de cambio de tema */}
            <ThemeToggle />

            <button
              onClick={handleLogout}
              className="relative p-3 text-secondary-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 rounded-xl transition-all duration-300 hover:scale-110 hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 group"
              title="Cerrar sesión"
            >
              <LogOut className="h-5 w-5" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-red-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Navegación móvil */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-secondary-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md">
          <Link
            to="/dashboard"
            className="text-secondary-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 hover:bg-primary-50 dark:hover:bg-primary-900/20"
          >
            Dashboard
          </Link>
          <Link
            to="/events"
            className="text-secondary-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 hover:bg-primary-50 dark:hover:bg-primary-900/20"
          >
            Eventos
          </Link>
          <Link
            to="/events/new"
            className="text-secondary-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 hover:bg-primary-50 dark:hover:bg-primary-900/20"
          >
            Nuevo Evento
          </Link>
          <Link
            to="/stats"
            className="text-secondary-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 hover:bg-primary-50 dark:hover:bg-primary-900/20"
          >
            Estadísticas
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
