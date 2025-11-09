# 🚀 Guía completa de implementación de la API Prisma Commerce en Frontend

## 📋 Información de la API

- **Base URL:** `https://https-github-com-alvaro-boot-tiendazo-api.onrender.com/api`
- **Documentación:** `https://https-github-com-alvaro-boot-tiendazo-api.onrender.com/api/docs`
- **Autenticación:** JWT Bearer Token
- **CORS:** Habilitado para todos los orígenes

## 🛠️ Configuración inicial

### 1. Variables de entorno

```javascript
// .env
REACT_APP_API_URL=https://https-github-com-alvaro-boot-tiendazo-api.onrender.com/api
REACT_APP_API_DOCS=https://https-github-com-alvaro-boot-tiendazo-api.onrender.com/api/docs
```

### 2. Configuración de Axios

```javascript
// services/api.js
import axios from "axios";

const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://https-github-com-alvaro-boot-tiendazo-api.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
```

## 🔐 Servicios de Autenticación

### AuthService

```javascript
// services/authService.js
import api from "./api";

class AuthService {
  // Login
  async login(credentials) {
    try {
      const response = await api.post("/auth/login", credentials);
      const { access_token, user } = response.data;

      // Guardar en localStorage
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("user", JSON.stringify(user));

      return { access_token, user };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Registro
  async register(userData) {
    try {
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Obtener perfil
  async getProfile() {
    try {
      const response = await api.get("/auth/profile");
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Logout
  logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
  }

  // Verificar si está autenticado
  isAuthenticated() {
    return !!localStorage.getItem("access_token");
  }

  // Obtener usuario actual
  getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  // Manejo de errores
  handleError(error) {
    if (error.response) {
      return new Error(error.response.data.message || "Error del servidor");
    }
    return new Error("Error de conexión");
  }
}

export default new AuthService();
```

## 🏪 Servicios de Tiendas

### StoreService

```javascript
// services/storeService.js
import api from "./api";

class StoreService {
  // Obtener todas las tiendas
  async getStores() {
    try {
      const response = await api.get("/stores");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Obtener tienda por ID
  async getStore(id) {
    try {
      const response = await api.get(`/stores/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Crear tienda (endpoint público)
  async createStore(storeData) {
    try {
      const response = await api.post("/stores", storeData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Actualizar tienda (solo ADMIN)
  async updateStore(id, storeData) {
    try {
      const response = await api.patch(`/stores/${id}`, storeData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Eliminar tienda (solo ADMIN)
  async deleteStore(id) {
    try {
      const response = await api.delete(`/stores/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new StoreService();
```

## 📦 Servicios de Productos

### ProductService

```javascript
// services/productService.js
import api from "./api";

class ProductService {
  // Obtener todos los productos
  async getProducts() {
    try {
      const response = await api.get("/products");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Obtener producto por ID
  async getProduct(id) {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Crear producto
  async createProduct(productData) {
    try {
      const response = await api.post("/products", productData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Actualizar producto
  async updateProduct(id, productData) {
    try {
      const response = await api.patch(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Eliminar producto
  async deleteProduct(id) {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Buscar productos
  async searchProducts(query) {
    try {
      const response = await api.get(`/products/search?q=${query}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new ProductService();
```

## 🛒 Servicios de Ventas

### SaleService

```javascript
// services/saleService.js
import api from "./api";

class SaleService {
  // Obtener todas las ventas
  async getSales() {
    try {
      const response = await api.get("/sales");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Obtener venta por ID
  async getSale(id) {
    try {
      const response = await api.get(`/sales/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Crear venta
  async createSale(saleData) {
    try {
      const response = await api.post("/sales", saleData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Cancelar venta
  async cancelSale(id) {
    try {
      const response = await api.patch(`/sales/${id}/cancel`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Obtener reportes de ventas
  async getSalesReport(startDate, endDate) {
    try {
      const response = await api.get(
        `/sales/report?start=${startDate}&end=${endDate}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new SaleService();
```

## 👥 Servicios de Clientes

### ClientService

```javascript
// services/clientService.js
import api from "./api";

class ClientService {
  // Obtener todos los clientes
  async getClients() {
    try {
      const response = await api.get("/clients");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Obtener cliente por ID
  async getClient(id) {
    try {
      const response = await api.get(`/clients/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Crear cliente
  async createClient(clientData) {
    try {
      const response = await api.post("/clients", clientData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Actualizar cliente
  async updateClient(id, clientData) {
    try {
      const response = await api.patch(`/clients/${id}`, clientData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Eliminar cliente
  async deleteClient(id) {
    try {
      const response = await api.delete(`/clients/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Buscar clientes
  async searchClients(query) {
    try {
      const response = await api.get(`/clients/search?q=${query}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new ClientService();
```

## 🎯 Hooks de React

### useAuth Hook

```javascript
// hooks/useAuth.js
import { useState, useEffect, useContext, createContext } from "react";
import AuthService from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (AuthService.isAuthenticated()) {
        try {
          const userData = await AuthService.getProfile();
          setUser(userData);
        } catch (error) {
          AuthService.logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const { user } = await AuthService.login(credentials);
      setUser(user);
      return user;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "ADMIN",
    isEmployee: user?.role === "EMPLOYEE",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de AuthProvider");
  }
  return context;
};
```

### useApi Hook

```javascript
// hooks/useApi.js
import { useState, useEffect } from "react";

export const useApi = (apiCall, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiCall();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: () => fetchData() };
};
```

## 🛡️ Componentes protegidos

### ProtectedRoute

```javascript
// components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
```

### RoleGuard

```javascript
// components/RoleGuard.jsx
import { useAuth } from "../hooks/useAuth";

const RoleGuard = ({ children, allowedRoles = [] }) => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <div>No tienes permisos para acceder a esta sección</div>;
  }

  return children;
};

export default RoleGuard;
```

## 📱 Componentes de ejemplo

### Login Component

```javascript
// components/Login.jsx
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(credentials);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>

        {error && <div className="error">{error}</div>}

        <div className="form-group">
          <label>Usuario:</label>
          <input
            type="text"
            value={credentials.username}
            onChange={(e) =>
              setCredentials({ ...credentials, username: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <label>Contraseña:</label>
          <input
            type="password"
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Iniciando..." : "Iniciar Sesión"}
        </button>
      </form>
    </div>
  );
};

export default Login;
```

### ProductList Component

```javascript
// components/ProductList.jsx
import { useState, useEffect } from "react";
import ProductService from "../services/productService";
import { useApi } from "../hooks/useApi";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await ProductService.getProducts();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Cargando productos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="product-list">
      <h2>Lista de Productos</h2>
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p>Precio: ${product.sellPrice}</p>
            <p>Stock: {product.stock}</p>
            <p>Categoría: {product.category?.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
```

## 🎨 Configuración de rutas

### App Router

```javascript
// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleGuard from "./components/RoleGuard";

// Components
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ProductList from "./components/ProductList";
import StoreManagement from "./components/StoreManagement";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <ProductList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/stores"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={["ADMIN"]}>
                  <StoreManagement />
                </RoleGuard>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
```

## 📊 Manejo de estados globales

### Context para la aplicación

```javascript
// context/AppContext.js
import { createContext, useContext, useReducer } from "react";

const AppContext = createContext();

const initialState = {
  stores: [],
  products: [],
  clients: [],
  sales: [],
  loading: false,
  error: null,
};

const appReducer = (state, action) => {
  switch (action.type) {
    case "SET_STORES":
      return { ...state, stores: action.payload };
    case "SET_PRODUCTS":
      return { ...state, products: action.payload };
    case "SET_CLIENTS":
      return { ...state, clients: action.payload };
    case "SET_SALES":
      return { ...state, sales: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "ADD_PRODUCT":
      return { ...state, products: [...state.products, action.payload] };
    case "UPDATE_PRODUCT":
      return {
        ...state,
        products: state.products.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
      };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
```

## 🚀 Instalación y configuración

### 1. Instalar dependencias

```bash
npm install axios react-router-dom
# o
yarn add axios react-router-dom
```

### 2. Estructura de carpetas

```
src/
├── components/
│   ├── Login.jsx
│   ├── ProductList.jsx
│   ├── ProtectedRoute.jsx
│   └── RoleGuard.jsx
├── hooks/
│   ├── useAuth.js
│   └── useApi.js
├── services/
│   ├── api.js
│   ├── authService.js
│   ├── storeService.js
│   ├── productService.js
│   ├── saleService.js
│   └── clientService.js
├── context/
│   └── AppContext.js
└── App.jsx
```

### 3. Variables de entorno

```env
# .env
REACT_APP_API_URL=https://https-github-com-alvaro-boot-tiendazo-api.onrender.com/api
REACT_APP_API_DOCS=https://https-github-com-alvaro-boot-tiendazo-api.onrender.com/api/docs
```

## 🔧 Comandos cURL para testing

### Autenticación

```bash
# Registrar usuario
curl -X POST https://https-github-com-alvaro-boot-tiendazo-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "fullName": "Admin User",
    "email": "admin@tiendazo.com",
    "password": "admin123",
    "role": "ADMIN"
  }'

# Login
curl -X POST https://https-github-com-alvaro-boot-tiendazo-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'

# Obtener perfil (reemplazar TOKEN)
curl -X GET https://https-github-com-alvaro-boot-tiendazo-api.onrender.com/api/auth/profile \
  -H "Authorization: Bearer TOKEN_AQUI"
```

### Tiendas

```bash
# Crear tienda (endpoint público - no requiere token)
curl -X POST https://https-github-com-alvaro-boot-tiendazo-api.onrender.com/api/stores \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mi Tienda",
    "address": "Calle 123",
    "phone": "+1234567890",
    "currency": "COP"
  }'

# Listar tiendas
curl -X GET https://https-github-com-alvaro-boot-tiendazo-api.onrender.com/api/stores \
  -H "Authorization: Bearer TOKEN_AQUI"
```

### Health Check

```bash
curl -X GET https://https-github-com-alvaro-boot-tiendazo-api.onrender.com/api/health
```

## ✅ Checklist de implementación

- [ ] Configurar servicios de API
- [ ] Implementar autenticación JWT
- [ ] Crear hooks personalizados
- [ ] Implementar rutas protegidas
- [ ] Configurar manejo de errores
- [ ] Crear componentes base
- [ ] Implementar roles y permisos
- [ ] Configurar CORS
- [ ] Probar endpoints principales
- [ ] Implementar manejo de estados

## 📚 Recursos adicionales

- **Documentación API:** https://https-github-com-alvaro-boot-tiendazo-api.onrender.com/api/docs
- **Swagger UI:** Interfaz interactiva para probar endpoints
- **CORS:** Habilitado para todos los orígenes en desarrollo
- **JWT:** Tokens con expiración de 24 horas por defecto

## 🎯 Próximos pasos

1. Implementar los servicios base
2. Crear componentes de autenticación
3. Configurar rutas protegidas
4. Implementar CRUD de productos
5. Agregar manejo de estados globales
6. Implementar reportes y dashboards

¡Listo para integrar con cualquier framework frontend!
