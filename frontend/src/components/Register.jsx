import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const schema = yup
  .object({
    username: yup
      .string()
      .required("El nombre de usuario es requerido")
      .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
      .max(20, "El nombre de usuario no puede exceder 20 caracteres"),
    email: yup
      .string()
      .required("El email es requerido")
      .email("El email debe ser válido"),
    password: yup
      .string()
      .required("La contraseña es requerida")
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: yup
      .string()
      .required("Confirma tu contraseña")
      .oneOf([yup.ref("password")], "Las contraseñas deben coincidir"),
  })
  .required();

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await registerUser(
        data.username,
        data.email,
        data.password
      );

      if (result.success) {
        toast.success("¡Registro exitoso! Bienvenido a la aplicación");
        reset();
        // Redirigir al dashboard después del registro exitoso
        navigate("/dashboard");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Error al registrarse");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Fondo animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-secondary-50 to-primary-100 dark:from-gray-900 dark:via-gray-800 dark:to-black">
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <div className="relative mx-auto h-20 w-20 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl group hover:shadow-primary-500/25 transition-all duration-500 hover:scale-110">
            <User className="h-10 w-10 text-white" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Sparkles className="absolute -top-2 -right-2 h-4 w-4 text-yellow-300 opacity-0 group-hover:opacity-100 animate-pulse" />
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-secondary-900 to-primary-600 dark:from-white dark:to-primary-400 bg-clip-text text-transparent mb-2">
            Crear cuenta
          </h2>
          <p className="text-secondary-600 dark:text-gray-400 text-lg">
            Únete a nuestra aplicación de gestión de eventos
          </p>
        </div>

        <div className="card backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 shadow-2xl border-0">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                Nombre de Usuario
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-secondary-400 dark:text-gray-500 group-focus-within:text-primary-500 transition-colors duration-300" />
                </div>
                <input
                  {...register("username")}
                  type="text"
                  className="input-field pl-12 pr-4 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-secondary-300/50 dark:border-gray-600/50 focus:border-primary-500 dark:focus:border-primary-400 transition-all duration-300"
                  placeholder="Ingresa tu nombre de usuario"
                />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary-500/0 via-primary-500/5 to-primary-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
              </div>
              {errors.username && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <span className="w-1 h-1 bg-red-500 rounded-full mr-2" />
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-secondary-400 dark:text-gray-500 group-focus-within:text-primary-500 transition-colors duration-300" />
                </div>
                <input
                  {...register("email")}
                  type="email"
                  className="input-field pl-12 pr-4 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-secondary-300/50 dark:border-gray-600/50 focus:border-primary-500 dark:focus:border-primary-400 transition-all duration-300"
                  placeholder="Ingresa tu email"
                />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary-500/0 via-primary-500/5 to-primary-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <span className="w-1 h-1 bg-red-500 rounded-full mr-2" />
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                Contraseña
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-secondary-400 dark:text-gray-500 group-focus-within:text-primary-500 transition-colors duration-300" />
                </div>
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  className="input-field pl-12 pr-12 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-secondary-300/50 dark:border-gray-600/50 focus:border-primary-500 dark:focus:border-primary-400 transition-all duration-300"
                  placeholder="Ingresa tu contraseña"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-secondary-400 dark:text-gray-500 hover:text-secondary-600 dark:hover:text-gray-300 transition-colors duration-200" />
                  ) : (
                    <Eye className="h-5 w-5 text-secondary-400 dark:text-gray-500 hover:text-secondary-600 dark:hover:text-gray-300 transition-colors duration-200" />
                  )}
                </button>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary-500/0 via-primary-500/5 to-primary-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <span className="w-1 h-1 bg-red-500 rounded-full mr-2" />
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                Confirmar Contraseña
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-secondary-400 dark:text-gray-500 group-focus-within:text-primary-500 transition-colors duration-300" />
                </div>
                <input
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  className="input-field pl-12 pr-12 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-secondary-300/50 dark:border-gray-600/50 focus:border-primary-500 dark:focus:border-primary-400 transition-all duration-300"
                  placeholder="Confirma tu contraseña"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-secondary-400 dark:text-gray-500 hover:text-secondary-600 dark:hover:text-gray-300 transition-colors duration-200" />
                  ) : (
                    <Eye className="h-5 w-5 text-secondary-400 dark:text-gray-500 hover:text-secondary-600 dark:hover:text-gray-300 transition-colors duration-200" />
                  )}
                </button>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary-500/0 via-primary-500/5 to-primary-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
              </div>
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <span className="w-1 h-1 bg-red-500 rounded-full mr-2" />
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="relative w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg hover:shadow-xl hover:shadow-primary-500/25 hover:scale-[1.02]"
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex justify-center items-center">
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-2" />
                      Registrarse
                    </>
                  )}
                </div>
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-secondary-300/50 dark:border-gray-600/50" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-secondary-500 dark:text-gray-400 rounded-lg">
                  ¿Ya tienes una cuenta?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/login"
                className="relative w-full flex justify-center items-center px-4 py-3 border border-secondary-300/50 dark:border-gray-600/50 rounded-xl shadow-sm text-sm font-medium text-secondary-700 dark:text-gray-300 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm hover:bg-secondary-50 dark:hover:bg-gray-600/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300 group hover:scale-[1.02]"
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-secondary-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center">
                  <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                  Ir al Login
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
