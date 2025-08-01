import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Eye,
  EyeOff,
  Calendar,
  Users,
  Building2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";

const schema = yup
  .object({
    username: yup.string().required("El usuario es requerido"),
    password: yup.string().required("La contraseña es requerida"),
  })
  .required();

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const result = await login(data.username, data.password);

      if (result.success) {
        toast.success("¡Bienvenido!");
        navigate("/dashboard");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Error al iniciar sesión");
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
        {/* Header */}
        <div className="text-center">
          <div className="relative mx-auto h-20 w-20 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl group hover:shadow-primary-500/25 transition-all duration-500 hover:scale-110">
            <Calendar className="h-10 w-10 text-white" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Sparkles className="absolute -top-2 -right-2 h-4 w-4 text-yellow-300 opacity-0 group-hover:opacity-100 animate-pulse" />
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-secondary-900 to-primary-600 dark:from-white dark:to-primary-400 bg-clip-text text-transparent mb-2">
            Bienvenido
          </h2>
          <p className="text-secondary-600 dark:text-gray-400 text-lg">
            Inicia sesión en tu cuenta de gestión de eventos
          </p>
        </div>

        {/* Login Form */}
        <div className="card backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 shadow-2xl border-0">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2"
              >
                Usuario
              </label>
              <div className="relative group">
                <input
                  {...register("username")}
                  type="text"
                  id="username"
                  className="input-field pl-12 pr-4 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-secondary-300/50 dark:border-gray-600/50 focus:border-primary-500 dark:focus:border-primary-400 transition-all duration-300"
                  placeholder="Ingresa tu usuario"
                />
                <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400 dark:text-gray-500 group-focus-within:text-primary-500 transition-colors duration-300" />
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
              <label
                htmlFor="password"
                className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2"
              >
                Contraseña
              </label>
              <div className="relative group">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="input-field pl-12 pr-12 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-secondary-300/50 dark:border-gray-600/50 focus:border-primary-500 dark:focus:border-primary-400 transition-all duration-300"
                  placeholder="Ingresa tu contraseña"
                />
                <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400 dark:text-gray-500 group-focus-within:text-primary-500 transition-colors duration-300" />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-secondary-400 dark:text-gray-500 hover:text-secondary-600 dark:hover:text-gray-300 transition-colors duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
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
                      Iniciar Sesión
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </div>
              </button>
            </div>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gradient-to-r from-secondary-50 to-primary-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-secondary-200/50 dark:border-gray-600/50">
            <h4 className="text-sm font-medium text-secondary-900 dark:text-white mb-2 flex items-center">
              <Sparkles className="h-4 w-4 mr-2 text-primary-500" />
              Credenciales de Demo:
            </h4>
            <div className="text-xs text-secondary-600 dark:text-gray-400 space-y-1">
              <p>
                <strong>Usuario:</strong> admin
              </p>
              <p>
                <strong>Contraseña:</strong> admin123
              </p>
            </div>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-secondary-600 dark:text-gray-400">
              ¿No tienes una cuenta?{" "}
              <Link
                to="/register"
                className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-all duration-200 hover:underline"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
