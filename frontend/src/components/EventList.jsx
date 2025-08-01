import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Tag,
  Clock,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchEvents();
  }, [currentPage, search, categoryFilter]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
      });

      if (search) params.append("search", search);
      if (categoryFilter) params.append("category", categoryFilter);

      const response = await axios.get(`/api/events?${params}`);
      setEvents(response.data.events);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error("Error al cargar los eventos");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este evento?")) {
      return;
    }

    try {
      await axios.delete(`/api/events/${id}`);
      toast.success("Evento eliminado exitosamente");
      fetchEvents();
    } catch (error) {
      toast.error("Error al eliminar el evento");
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "reunión":
        return "bg-blue-100 text-blue-800";
      case "presentación":
        return "bg-purple-100 text-purple-800";
      case "entrevista":
        return "bg-orange-100 text-orange-800";
      case "capacitación":
        return "bg-green-100 text-green-800";
      case "consulta":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
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

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Eventos</h1>
          <p className="text-secondary-600 mt-1">
            Gestiona todos los eventos y citas
          </p>
        </div>
        <Link
          to="/events/new"
          className="btn-primary flex items-center space-x-2 mt-4 sm:mt-0"
        >
          <Plus className="h-4 w-4" />
          <span>Nuevo Evento</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="card">
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
              <input
                type="text"
                placeholder="Buscar eventos, clientes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input-field"
            >
              <option value="">Todas las categorías</option>
              <option value="general">General</option>
              <option value="reunión">Reunión</option>
              <option value="presentación">Presentación</option>
              <option value="entrevista">Entrevista</option>
              <option value="capacitación">Capacitación</option>
              <option value="consulta">Consulta</option>
            </select>
          </div>
          <button type="submit" className="btn-secondary">
            Buscar
          </button>
        </form>
      </div>

      {/* Events List */}
      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">
              No se encontraron eventos
            </h3>
            <p className="text-secondary-600 mb-6">
              {search || categoryFilter
                ? "Intenta ajustar los filtros de búsqueda"
                : "Comienza creando tu primer evento"}
            </p>
            {!search && !categoryFilter && (
              <Link to="/events/new" className="btn-primary">
                Crear Primer Evento
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="border border-secondary-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-secondary-900 mb-1">
                          {event.title}
                        </h3>
                        <p className="text-secondary-600 text-sm mb-2">
                          {event.description}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(
                          event.category
                        )}`}
                      >
                        {getCategoryText(event.category)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-secondary-400" />
                        <span className="text-secondary-600">
                          {event.is_all_day
                            ? format(
                                new Date(event.start_datetime),
                                "dd/MM/yyyy",
                                { locale: es }
                              )
                            : format(
                                new Date(event.start_datetime),
                                "dd/MM/yyyy 'a las' HH:mm",
                                { locale: es }
                              )}
                        </span>
                      </div>
                      {event.location && (
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-secondary-400" />
                          <span className="text-secondary-600">
                            {event.location}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <Tag className="h-4 w-4 text-secondary-400" />
                        <span className="text-secondary-600">
                          {getCategoryText(event.category)}
                        </span>
                      </div>
                      {event.is_all_day && (
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-secondary-400" />
                          <span className="text-secondary-600">
                            Día completo
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mt-4 lg:mt-0 lg:ml-4">
                    <Link
                      to={`/events/edit/${event.id}`}
                      className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                      title="Editar evento"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      title="Eliminar evento"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-secondary-200">
            <div className="text-sm text-secondary-600">
              Mostrando {(pagination.currentPage - 1) * 10 + 1} a{" "}
              {Math.min(pagination.currentPage * 10, pagination.totalEvents)} de{" "}
              {pagination.totalEvents} eventos
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="px-3 py-2 text-sm font-medium text-secondary-600 bg-white border border-secondary-300 rounded-md hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <span className="px-3 py-2 text-sm font-medium text-secondary-900">
                {pagination.currentPage} de {pagination.totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="px-3 py-2 text-sm font-medium text-secondary-600 bg-white border border-secondary-300 rounded-md hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventList;
