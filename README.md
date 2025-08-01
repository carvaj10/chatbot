# 📅 Sistema de Gestión de Eventos y Citas

Una aplicación web moderna para gestionar eventos, citas y calendarios de empresas. Desarrollada con **Node.js + Express** en el backend y **React + Vite** en el frontend.

## ✨ Características

- 🔐 **Autenticación segura** con JWT
- 📅 **Gestión completa de eventos** (crear, editar, eliminar)
- 👥 **Información de clientes** (nombre, email, teléfono)
- 📊 **Dashboard con estadísticas** en tiempo real
- 🔍 **Búsqueda y filtros** avanzados
- 📱 **Diseño responsive** y moderno
- 🎨 **UI/UX atractiva** con Tailwind CSS
- 📄 **Paginación** para grandes volúmenes de datos
- ⚡ **Rendimiento optimizado**

## 🛠️ Tecnologías Utilizadas

### Backend

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Base de datos
- **JWT** - Autenticación
- **bcryptjs** - Encriptación de contraseñas
- **express-validator** - Validación de datos
- **helmet** - Seguridad
- **cors** - Cross-origin resource sharing

### Frontend

- **React 18** - Biblioteca de UI
- **Vite** - Build tool
- **React Router** - Navegación
- **Tailwind CSS** - Framework de estilos
- **Axios** - Cliente HTTP
- **React Hook Form** - Manejo de formularios
- **Yup** - Validación de esquemas
- **Lucide React** - Iconos
- **date-fns** - Manipulación de fechas
- **React Hot Toast** - Notificaciones

## 🚀 Instalación

### Prerrequisitos

- Node.js (v16 o superior)
- PostgreSQL (v12 o superior)
- npm o yarn

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd calendar-events-app
```

### 2. Instalar dependencias

```bash
# Instalar todas las dependencias (backend y frontend)
npm run install-all

# O instalar por separado:
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 3. Configurar la base de datos

#### Crear base de datos PostgreSQL:

```sql
CREATE DATABASE calendar_events_db;
```

#### Configurar variables de entorno:

```bash
# Copiar el archivo de ejemplo
cp backend/env.example backend/.env

# Editar el archivo .env con tus credenciales
```

```env
# Configuración de la base de datos PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=calendar_events_db
DB_USER=tu_usuario
DB_PASSWORD=tu_password

# Configuración del servidor
PORT=5000
NODE_ENV=development

# JWT Secret (cambia por una clave segura)
JWT_SECRET=tu_jwt_secret_super_seguro

# Configuración de CORS
CORS_ORIGIN=http://localhost:5173
```

### 4. Ejecutar la aplicación

#### Opción 1: Ejecutar todo junto

```bash
npm run dev
```

#### Opción 2: Ejecutar por separado

**Backend:**

```bash
cd backend
npm run dev
```

**Frontend:**

```bash
cd frontend
npm run dev
```

### 5. Acceder a la aplicación

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

## 🔑 Credenciales por defecto

Al iniciar la aplicación por primera vez, se crea automáticamente un usuario administrador:

- **Usuario:** `admin`
- **Contraseña:** `admin123`

## 📋 Estructura del Proyecto

```
calendar-events-app/
├── backend/
│   ├── config/
│   │   └── database.js          # Configuración de PostgreSQL
│   ├── middleware/
│   │   └── auth.js              # Middleware de autenticación
│   ├── routes/
│   │   ├── auth.js              # Rutas de autenticación
│   │   └── events.js            # Rutas de eventos
│   ├── server.js                # Servidor principal
│   ├── package.json
│   └── env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx        # Componente de login
│   │   │   ├── Dashboard.jsx    # Dashboard principal
│   │   │   ├── EventList.jsx    # Lista de eventos
│   │   │   ├── EventForm.jsx    # Formulario de eventos
│   │   │   ├── Navbar.jsx       # Navegación
│   │   │   └── Stats.jsx        # Estadísticas
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx  # Contexto de autenticación
│   │   ├── App.jsx              # Componente principal
│   │   ├── main.jsx             # Punto de entrada
│   │   └── index.css            # Estilos globales
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── package.json
└── README.md
```

## 🗄️ Base de Datos

### Tabla `calendar_events`

```sql
CREATE TABLE calendar_events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_datetime TIMESTAMP NOT NULL,
  end_datetime TIMESTAMP NOT NULL,
  location VARCHAR(300),
  category VARCHAR(50) DEFAULT 'general',
  is_all_day BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabla `users`

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔌 API Endpoints

### Autenticación

- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/create-admin` - Crear usuario administrador

### Eventos

- `GET /api/events` - Obtener todos los eventos (con paginación y filtros)
- `GET /api/events/:id` - Obtener evento específico
- `POST /api/events` - Crear nuevo evento
- `PUT /api/events/:id` - Actualizar evento
- `DELETE /api/events/:id` - Eliminar evento
- `GET /api/events/stats/summary` - Obtener estadísticas

### Salud del sistema

- `GET /api/health` - Verificar estado del servidor

## 🎨 Características de la UI

- **Diseño moderno** con gradientes y sombras
- **Responsive** para móviles, tablets y desktop
- **Animaciones suaves** y transiciones
- **Iconos consistentes** con Lucide React
- **Paleta de colores** profesional
- **Tipografía** clara y legible
- **Componentes reutilizables**
- **Gestión de eventos** con ubicación, categoría y eventos de día completo
- **Filtros avanzados** por categoría y búsqueda
- **Estadísticas visuales** de eventos

## 🔧 Scripts Disponibles

```bash
# Instalar todas las dependencias
npm run install-all

# Ejecutar backend y frontend en desarrollo
npm run dev

# Solo backend
npm run server

# Solo frontend
npm run client

# Construir para producción
npm run build
```

## 🚀 Despliegue

### Backend (Heroku, Railway, etc.)

1. Configurar variables de entorno
2. Conectar base de datos PostgreSQL
3. Deploy con `npm start`

### Frontend (Vercel, Netlify, etc.)

1. Construir con `npm run build`
2. Deploy la carpeta `dist`

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la documentación
2. Verifica que PostgreSQL esté corriendo
3. Confirma que las variables de entorno estén configuradas
4. Revisa los logs del servidor

## 🎯 Próximas Características

- [ ] Notificaciones por email
- [ ] Calendario visual interactivo
- [ ] Exportar eventos a PDF
- [ ] Integración con Google Calendar
- [ ] Múltiples usuarios y roles
- [ ] Reportes avanzados
- [ ] API REST completa
- [ ] Tests automatizados

---

**Desarrollado con ❤️ por Jose**
