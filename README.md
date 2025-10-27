# 🛒 Tiendazo - Backend API

Backend completo para gestión de tiendas desarrollado con NestJS, TypeORM y MySQL.

## 🚀 Características

- ✅ Autenticación JWT con roles (ADMIN, EMPLOYEE)
- ✅ Gestión de tiendas y usuarios
- ✅ CRUD de productos con categorías
- ✅ Control de inventario y stock
- ✅ Sistema de ventas con cálculo de ganancias
- ✅ Gestión de clientes y fiados
- ✅ Reportes de rendimiento
- ✅ Subida de imágenes
- ✅ API REST documentada con Swagger
- ✅ Validación de datos con class-validator
- ✅ Arquitectura modular y hexagonal

## 📋 Prerequisitos

- Node.js (v18 o superior)
- MySQL (v8 o superior)
- npm o yarn

## 🔧 Instalación

1. Clona el repositorio
```bash
git clone <repository-url>
cd tiendazo-backend
```

2. Instala las dependencias
```bash
npm install
```

3. Configura las variables de entorno
```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales de base de datos:

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=tu_password
DB_NAME=tiendazo_db

# JWT
JWT_SECRET=tu-secret-jwt-super-seguro
JWT_EXPIRES_IN=24h

# App
PORT=3000
NODE_ENV=development
```

4. Crea la base de datos
```sql
CREATE DATABASE tiendazo_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

5. Ejecuta la aplicación
```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

La aplicación estará disponible en `http://localhost:3000/api`

## 📚 Documentación API

La documentación interactiva está disponible en:
- Swagger UI: `http://localhost:3000/api/docs`

## 🏗️ Estructura del Proyecto

```
src/
├── config/              # Configuraciones (DB, Multer, etc)
├── core/                # Código compartido
│   ├── decorators/      # Decoradores personalizados
│   ├── guards/          # Guards de autenticación
│   ├── exceptions/      # Filtros de excepción
│   └── utils/           # Utilidades
├── modules/             # Módulos de la aplicación
│   ├── auth/           # Autenticación
│   ├── stores/         # Tiendas
│   ├── products/       # Productos y categorías
│   ├── inventory/      # Inventario
│   ├── sales/          # Ventas
│   ├── clients/        # Clientes
│   ├── debts/          # Fiados
│   ├── reports/        # Reportes
│   └── uploads/        # Subida de archivos
└── shared/             # Entidades compartidas
```

## 🔐 Autenticación

Las rutas protegidas requieren un JWT en el header:

```
Authorization: Bearer <token>
```

### Roles Disponibles
- `ADMIN`: Acceso completo
- `EMPLOYEE`: Acceso limitado

## 📝 Endpoints Principales

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile` - Perfil del usuario autenticado

### Tiendas
- `GET /api/stores` - Listar todas las tiendas
- `POST /api/stores` - Crear tienda (ADMIN)
- `GET /api/stores/:id` - Obtener tienda
- `PATCH /api/stores/:id` - Actualizar tienda (ADMIN)

### Productos
- `GET /api/products` - Listar productos
- `POST /api/products` - Crear producto
- `GET /api/products/:id` - Obtener producto
- `PATCH /api/products/:id` - Actualizar producto

## 🧪 Testing

```bash
# Unit tests
npm run test

# Test coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

## 📦 Scripts Disponibles

- `npm run build` - Compilar proyecto
- `npm run start:dev` - Iniciar en desarrollo
- `npm run start:prod` - Iniciar en producción
- `npm run lint` - Linter
- `npm run format` - Formatear código

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👨‍💻 Autor

Desarrollado con ❤️ usando NestJS
