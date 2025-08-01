import { useState, useEffect } from "react";
import {
  BarChart3,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const Stats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get("/api/events/stats/summary");
      setStats(response.data);
    } catch (error) {
      toast.error("Error al cargar las estadísticas");
    } finally {
      setLoading(false);
    }
  };

  const calculatePercentage = (value, total) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">Estadísticas</h1>
        <p className="text-secondary-600 mt-1">
          Resumen detallado de eventos y métricas
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">
                Total de Eventos
              </p>
              <p className="text-3xl font-bold text-secondary-900">
                {stats?.total_events || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">
                Eventos de Día Completo
              </p>
              <p className="text-3xl font-bold text-secondary-900">
                {stats?.all_day_events || 0}
              </p>
              <p className="text-sm text-green-600">
                {calculatePercentage(
                  stats?.all_day_events || 0,
                  stats?.total_events || 0
                )}
                % del total
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">
                Eventos con Hora
              </p>
              <p className="text-3xl font-bold text-secondary-900">
                {stats?.timed_events || 0}
              </p>
              <p className="text-sm text-purple-600">
                {calculatePercentage(
                  stats?.timed_events || 0,
                  stats?.total_events || 0
                )}
                % del total
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Event Type Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Distribución por Tipo de Evento
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm font-medium text-secondary-700">
                  Eventos de Día Completo
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-secondary-900">
                  {stats?.all_day_events || 0}
                </span>
                <span className="text-sm text-secondary-600 ml-1">
                  (
                  {calculatePercentage(
                    stats?.all_day_events || 0,
                    stats?.total_events || 0
                  )}
                  %)
                </span>
              </div>
            </div>

            <div className="w-full bg-secondary-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${calculatePercentage(
                    stats?.all_day_events || 0,
                    stats?.total_events || 0
                  )}%`,
                }}
              ></div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-sm font-medium text-secondary-700">
                  Eventos con Hora
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-secondary-900">
                  {stats?.timed_events || 0}
                </span>
                <span className="text-sm text-secondary-600 ml-1">
                  (
                  {calculatePercentage(
                    stats?.timed_events || 0,
                    stats?.total_events || 0
                  )}
                  %)
                </span>
              </div>
            </div>

            <div className="w-full bg-secondary-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${calculatePercentage(
                    stats?.timed_events || 0,
                    stats?.total_events || 0
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Timeline Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Distribución Temporal
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-sm font-medium text-secondary-700">
                  Próximos Eventos
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-secondary-900">
                  {stats?.upcoming_events || 0}
                </span>
                <span className="text-sm text-secondary-600 ml-1">
                  (
                  {calculatePercentage(
                    stats?.upcoming_events || 0,
                    stats?.total_events || 0
                  )}
                  %)
                </span>
              </div>
            </div>

            <div className="w-full bg-secondary-200 rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${calculatePercentage(
                    stats?.upcoming_events || 0,
                    stats?.total_events || 0
                  )}%`,
                }}
              ></div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-secondary-500 rounded"></div>
                <span className="text-sm font-medium text-secondary-700">
                  Eventos Pasados
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-secondary-900">
                  {stats?.past_events || 0}
                </span>
                <span className="text-sm text-secondary-600 ml-1">
                  (
                  {calculatePercentage(
                    stats?.past_events || 0,
                    stats?.total_events || 0
                  )}
                  %)
                </span>
              </div>
            </div>

            <div className="w-full bg-secondary-200 rounded-full h-2">
              <div
                className="bg-secondary-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${calculatePercentage(
                    stats?.past_events || 0,
                    stats?.total_events || 0
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="p-3 bg-blue-100 rounded-lg w-fit mx-auto mb-3">
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
          <h4 className="text-lg font-semibold text-secondary-900">
            {stats?.total_events || 0}
          </h4>
          <p className="text-sm text-secondary-600">Total de Eventos</p>
        </div>

        <div className="card text-center">
          <div className="p-3 bg-green-100 rounded-lg w-fit mx-auto mb-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <h4 className="text-lg font-semibold text-secondary-900">
            {stats?.all_day_events || 0}
          </h4>
          <p className="text-sm text-secondary-600">Día Completo</p>
        </div>

        <div className="card text-center">
          <div className="p-3 bg-purple-100 rounded-lg w-fit mx-auto mb-3">
            <Users className="h-6 w-6 text-purple-600" />
          </div>
          <h4 className="text-lg font-semibold text-secondary-900">
            {stats?.timed_events || 0}
          </h4>
          <p className="text-sm text-secondary-600">Con Hora</p>
        </div>

        <div className="card text-center">
          <div className="p-3 bg-yellow-100 rounded-lg w-fit mx-auto mb-3">
            <Clock className="h-6 w-6 text-yellow-600" />
          </div>
          <h4 className="text-lg font-semibold text-secondary-900">
            {stats?.upcoming_events || 0}
          </h4>
          <p className="text-sm text-secondary-600">Próximos</p>
        </div>
      </div>

      {/* Additional Info */}
      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">
          Información Adicional
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-secondary-900 mb-2">
              Eventos de Día Completo
            </h4>
            <p className="text-3xl font-bold text-green-600">
              {calculatePercentage(
                stats?.all_day_events || 0,
                stats?.total_events || 0
              )}
              %
            </p>
            <p className="text-sm text-secondary-600">
              {stats?.all_day_events || 0} de {stats?.total_events || 0} eventos
              son de día completo
            </p>
          </div>

          <div>
            <h4 className="font-medium text-secondary-900 mb-2">
              Eventos Próximos
            </h4>
            <p className="text-3xl font-bold text-blue-600">
              {calculatePercentage(
                stats?.upcoming_events || 0,
                stats?.total_events || 0
              )}
              %
            </p>
            <p className="text-sm text-secondary-600">
              {stats?.upcoming_events || 0} de {stats?.total_events || 0}{" "}
              eventos están próximos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
