import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  ArrowLeft,
  Save,
  Calendar,
  User,
  Mail,
  Phone,
  FileText,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const schema = yup
  .object({
    title: yup.string().required("El título es requerido"),
    description: yup.string(),
    start_datetime: yup.string().required("La fecha de inicio es requerida"),
    end_datetime: yup.string().required("La fecha de fin es requerida"),
    location: yup.string(),
    category: yup.string(),
    is_all_day: yup.boolean(),
  })
  .required();

const EventForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!id);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      category: "general",
      is_all_day: false,
    },
  });

  const startDateTime = watch("start_datetime");
  const endDateTime = watch("end_datetime");

  useEffect(() => {
    if (id) {
      fetchEvent();
    }
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await axios.get(`/api/events/${id}`);
      const event = response.data;

      // Formatear fechas para los inputs datetime-local
      const formatDateForInput = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
      };

      reset({
        title: event.title,
        description: event.description || "",
        start_datetime: formatDateForInput(event.start_datetime),
        end_datetime: formatDateForInput(event.end_datetime),
        location: event.location || "",
        category: event.category || "general",
        is_all_day: event.is_all_day || false,
      });
    } catch (error) {
      toast.error("Error al cargar el evento");
      navigate("/events");
    } finally {
      setInitialLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      // Validar que la fecha de fin sea posterior a la de inicio
      if (new Date(data.end_datetime) <= new Date(data.start_datetime)) {
        toast.error("La fecha de fin debe ser posterior a la fecha de inicio");
        return;
      }

      if (id) {
        await axios.put(`/api/events/${id}`, data);
        toast.success("Evento actualizado exitosamente");
      } else {
        await axios.post("/api/events", data);
        toast.success("Evento creado exitosamente");
      }

      navigate("/events");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al guardar el evento";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/events")}
            className="p-2 text-secondary-600 hover:bg-secondary-100 rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">
              {id ? "Editar Evento" : "Nuevo Evento"}
            </h1>
            <p className="text-secondary-600 mt-1">
              {id
                ? "Modifica los datos del evento"
                : "Crea un nuevo evento o cita"}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="card max-w-6xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Event Details */}
          <div>
            <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Detalles del Evento
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Título del Evento *
                </label>
                <input
                  {...register("title")}
                  type="text"
                  className="input-field"
                  placeholder="Ej: Consulta Médica - Dr. García"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Descripción
                </label>
                <textarea
                  {...register("description")}
                  rows={3}
                  className="input-field"
                  placeholder="Descripción detallada del evento..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Fecha y Hora de Inicio *
                </label>
                <input
                  {...register("start_datetime")}
                  type="datetime-local"
                  className="input-field"
                />
                {errors.start_datetime && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.start_datetime.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Fecha y Hora de Fin *
                </label>
                <input
                  {...register("end_datetime")}
                  type="datetime-local"
                  className="input-field"
                  min={startDateTime}
                />
                {errors.end_datetime && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.end_datetime.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Ubicación
                </label>
                <input
                  {...register("location")}
                  type="text"
                  className="input-field"
                  placeholder="Ej: Oficina Principal, Sala de Conferencias"
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.location.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Categoría
                </label>
                <select {...register("category")} className="input-field">
                  <option value="general">General</option>
                  <option value="reunión">Reunión</option>
                  <option value="presentación">Presentación</option>
                  <option value="entrevista">Entrevista</option>
                  <option value="capacitación">Capacitación</option>
                  <option value="consulta">Consulta</option>
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.category.message}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  {...register("is_all_day")}
                  type="checkbox"
                  id="is_all_day"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                />
                <label
                  htmlFor="is_all_day"
                  className="text-sm font-medium text-secondary-700"
                >
                  Evento de día completo
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-secondary-200">
            <button
              type="button"
              onClick={() => navigate("/events")}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{id ? "Actualizar" : "Crear"} Evento</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
