import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  ArrowRight,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, eventsResponse] = await Promise.all([
        axios.get("/api/events/stats/summary"),
        axios.get("/api/events?limit=5"),
      ]);

      setStats(statsResponse.data);
      setRecentEvents(eventsResponse.data.events);
    } catch (error) {
      toast.error("Error al cargar los datos del dashboard");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "reunión":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
      case "presentación":
        return "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200";
      case "entrevista":
        return "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200";
      case "capacitación":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "consulta":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
    }
  };

  const getCategoryText = (category) => {
    switch (category) {
      case "reunión":
        return "Reunión";
      case "presentación":
        return "Presentación";
      case "entrevista":
        return "Entrevista";
      case "capacitación":
        return "Capacitación";
      case "consulta":
        return "Consulta";
      default:
        return category || "General";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <Sparkles className="absolute -top-2 -right-2 h-4 w-4 text-primary-500 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-secondary-900 to-primary-600 dark:from-white dark:to-primary-400 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-secondary-600 dark:text-gray-400 mt-2 text-lg">
            Resumen de eventos y estadísticas
          </p>
        </div>
        <Link
          to="/events/new"
          className="relative mt-4 sm:mt-0 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 group shadow-lg hover:shadow-xl hover:shadow-primary-500/25 hover:scale-105 flex items-center space-x-2"
        >
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative flex items-center">
            <Plus className="h-5 w-5" />
            <span>Nuevo Evento</span>
            <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
          </div>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card card-hover group hover:scale-105 transition-all duration-300">
          <div className="flex items-center">
            <div className="relative p-3 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 rounded-xl group-hover:shadow-lg transition-all duration-300">
              <Calendar className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-primary-500 opacity-0 group-hover:opacity-100 animate-pulse" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600 dark:text-gray-400">
                Total Eventos
              </p>
              <p className="text-2xl font-bold text-secondary-900 dark:text-white">
                {stats?.total_events || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card card-hover group hover:scale-105 transition-all duration-300">
          <div className="flex items-center">
            <div className="relative p-3 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 rounded-xl group-hover:shadow-lg transition-all duration-300">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              <TrendingUp className="absolute -top-1 -right-1 h-3 w-3 text-green-500 opacity-0 group-hover:opacity-100 animate-pulse" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600 dark:text-gray-400">
                Próximos Eventos
              </p>
              <p className="text-2xl font-bold text-secondary-900 dark:text-white">
                {stats?.upcoming_events || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card card-hover group hover:scale-105 transition-all duration-300">
          <div className="flex items-center">
            <div className="relative p-3 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900 dark:to-orange-800 rounded-xl group-hover:shadow-lg transition-all duration-300">
              <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-orange-500 opacity-0 group-hover:opacity-100 animate-pulse" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600 dark:text-gray-400">
                Eventos de Día Completo
              </p>
              <p className="text-2xl font-bold text-secondary-900 dark:text-white">
                {stats?.all_day_events || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card card-hover group hover:scale-105 transition-all duration-300">
          <div className="flex items-center">
            <div className="relative p-3 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 rounded-xl group-hover:shadow-lg transition-all duration-300">
              <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-purple-500 opacity-0 group-hover:opacity-100 animate-pulse" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600 dark:text-gray-400">
                Eventos con Hora
              </p>
              <p className="text-2xl font-bold text-secondary-900 dark:text-white">
                {stats?.timed_events || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Events */}
      <div className="card backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 shadow-2xl border-0">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-secondary-900 to-primary-600 dark:from-white dark:to-primary-400 bg-clip-text text-transparent">
            Eventos Recientes
          </h2>
          <Link
            to="/events"
            className="text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 text-sm font-medium flex items-center space-x-1 transition-all duration-200 hover:scale-105"
          >
            <span>Ver todos</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>

        {recentEvents.length === 0 ? (
          <div className="text-center py-12">
            <div className="relative mx-auto h-16 w-16 bg-gradient-to-br from-secondary-100 to-secondary-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-secondary-400 dark:text-gray-500" />
              <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-secondary-500 animate-pulse" />
            </div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-2">
              No hay eventos recientes
            </h3>
            <p className="text-secondary-500 dark:text-gray-400 mb-6">
              Comienza creando tu primer evento.
            </p>
            <Link
              to="/events/new"
              className="inline-flex items-center bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Plus className="h-4 w-4 mr-2" />
              Crear Evento
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentEvents.map((event, index) => (
              <div
                key={event.id}
                className="group flex items-center justify-between p-4 border border-secondary-200/50 dark:border-gray-700/50 rounded-xl hover:bg-secondary-50/50 dark:hover:bg-gray-700/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-sm font-medium text-secondary-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
                      {event.title}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                        event.category
                      )}`}
                    >
                      {getCategoryText(event.category)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-secondary-500 dark:text-gray-400">
                    <span className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>
                        {event.is_all_day
                          ? format(
                              new Date(event.start_datetime),
                              "EEEE, d 'de' MMMM",
                              {
                                locale: es,
                              }
                            )
                          : format(
                              new Date(event.start_datetime),
                              "EEEE, d 'de' MMMM 'a las' HH:mm",
                              {
                                locale: es,
                              }
                            )}
                      </span>
                    </span>
                    {event.location && (
                      <span className="flex items-center space-x-1">
                        <span>•</span>
                        <span>{event.location}</span>
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/events/edit/${event.id}`}
                    className="text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 text-sm font-medium transition-all duration-200 hover:scale-110"
                  >
                    Editar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">
            Acciones Rápidas
          </h3>
          <div className="space-y-3">
            <Link
              to="/events/new"
              className="flex items-center space-x-3 p-3 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors duration-200"
            >
              <Plus className="h-5 w-5 text-primary-600" />
              <span className="text-primary-700 font-medium">
                Crear Nuevo Evento
              </span>
            </Link>
            <Link
              to="/events"
              className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200"
            >
              <Calendar className="h-5 w-5 text-secondary-600" />
              <span className="text-secondary-700 font-medium">
                Ver Todos los Eventos
              </span>
            </Link>
            <Link
              to="/stats"
              className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200"
            >
              <AlertCircle className="h-5 w-5 text-secondary-600" />
              <span className="text-secondary-700 font-medium">
                Ver Estadísticas
              </span>
            </Link>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">
            Información del Sistema
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-secondary-600">Versión:</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">Estado:</span>
              <span className="text-green-600 font-medium">Activo</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">Última actualización:</span>
              <span className="font-medium">
                {format(new Date(), "dd/MM/yyyy")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
