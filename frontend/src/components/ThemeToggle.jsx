import React from "react";
import { Sun, Moon, Sparkles } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const ThemeToggle = ({ className = "" }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative p-3 rounded-xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 group ${
        isDarkMode
          ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white hover:from-yellow-300 hover:to-orange-400 focus:ring-yellow-400 shadow-lg shadow-yellow-500/25"
          : "bg-gradient-to-br from-indigo-600 to-purple-700 text-white hover:from-indigo-500 hover:to-purple-600 focus:ring-indigo-500 shadow-lg shadow-purple-500/25"
      } ${className}`}
      aria-label={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      {/* Efecto de brillo */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Icono principal */}
      <div className="relative z-10">
        {isDarkMode ? (
          <div className="flex items-center justify-center">
            <Sun className="h-5 w-5 animate-pulse" />
            <Sparkles className="h-3 w-3 absolute -top-1 -right-1 text-yellow-200 animate-bounce" />
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <Moon className="h-5 w-5" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1 h-1 bg-white rounded-full animate-ping" />
            </div>
          </div>
        )}
      </div>

      {/* Efecto de partículas */}
      <div className="absolute inset-0 rounded-xl overflow-hidden">
        <div
          className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
            isDarkMode
              ? "bg-gradient-to-r from-yellow-200/20 via-transparent to-orange-200/20"
              : "bg-gradient-to-r from-indigo-200/20 via-transparent to-purple-200/20"
          }`}
        />
      </div>
    </button>
  );
};

export default ThemeToggle;
