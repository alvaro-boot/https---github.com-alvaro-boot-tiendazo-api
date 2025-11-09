# Prisma Commerce API - Endpoints Completos

## 🔐 Autenticación

### POST /api/auth/login

**Descripción:** Iniciar sesión
**Body:**

```json
{
  "username": "admin",
  "password": "password123"
}
```

### POST /api/auth/register

**Descripción:** Registrar nuevo usuario
**Body:**

```json
{
  "username": "admin",
  "fullName": "Administrador",
  "email": "admin@tiendazo.com",
  "password": "password123",
  "phone": "+1234567890",
  "role": "ADMIN"
}
```

### GET /api/auth/profile

**Descripción:** Obtener perfil del usuario autenticado
**Headers:** `Authorization: Bearer <token>`

---

## 🏪 Tiendas

### POST /api/stores

**Descripción:** Crear nueva tienda (PÚBLICO - No requiere token)
**Body:**

```json
{
  "name": "Mi Tienda",
  "description": "Descripción de la tienda",
  "address": "Calle 123, Ciudad",
  "phone": "+1234567890",
  "email": "tienda@example.com",
  "logo": "logo.png",
  "currency": "COP"
}
```

### GET /api/stores

**Descripción:** Obtener todas las tiendas
**Headers:** `Authorization: Bearer <token>`

### GET /api/stores/:id

**Descripción:** Obtener tienda por ID
**Headers:** `Authorization: Bearer <token>`

### PATCH /api/stores/:id

**Descripción:** Actualizar tienda
**Headers:** `Authorization: Bearer <token>`

### DELETE /api/stores/:id

**Descripción:** Eliminar tienda (soft delete)
**Headers:** `Authorization: Bearer <token>`

---

## 📦 Categorías

### POST /api/categories

**Descripción:** Crear nueva categoría
**Headers:** `Authorization: Bearer <token>`
**Body:**

```json
{
  "name": "Electrónicos",
  "description": "Productos electrónicos",
  "image": "categoria.png"
}
```

### GET /api/categories

**Descripción:** Obtener todas las categorías
**Headers:** `Authorization: Bearer <token>`

### GET /api/categories/:id

**Descripción:** Obtener categoría por ID
**Headers:** `Authorization: Bearer <token>`

### PATCH /api/categories/:id

**Descripción:** Actualizar categoría
**Headers:** `Authorization: Bearer <token>`

### DELETE /api/categories/:id

**Descripción:** Eliminar categoría
**Headers:** `Authorization: Bearer <token>`

---

## 🛍️ Productos

### POST /api/products

**Descripción:** Crear nuevo producto
**Headers:** `Authorization: Bearer <token>`
**Body:**

```json
{
  "name": "iPhone 15",
  "description": "Smartphone de última generación",
  "purchasePrice": 800000,
  "sellPrice": 1000000,
  "stock": 50,
  "minStock": 5,
  "barcode": "1234567890123",
  "image": "iphone15.jpg",
  "categoryId": 1,
  "storeId": 1
}
```

### GET /api/products

**Descripción:** Obtener productos con filtros opcionales
**Headers:** `Authorization: Bearer <token>`
**Query Parameters:**

- `q`: Búsqueda por nombre/descripción
- `categoryId`: Filtrar por categoría
- `storeId`: Filtrar por tienda

### GET /api/products/low-stock

**Descripción:** Obtener productos con stock bajo
**Headers:** `Authorization: Bearer <token>`
**Query Parameters:**

- `storeId`: Filtrar por tienda

### GET /api/products/:id

**Descripción:** Obtener producto por ID
**Headers:** `Authorization: Bearer <token>`

### PATCH /api/products/:id

**Descripción:** Actualizar producto
**Headers:** `Authorization: Bearer <token>`

### PATCH /api/products/:id/stock

**Descripción:** Actualizar stock del producto
**Headers:** `Authorization: Bearer <token>`
**Body:**

```json
{
  "quantity": 10,
  "operation": "add"
}
```

### DELETE /api/products/:id

**Descripción:** Eliminar producto (soft delete)
**Headers:** `Authorization: Bearer <token>`

---

## 👥 Clientes

### POST /api/clients

**Descripción:** Crear nuevo cliente
**Headers:** `Authorization: Bearer <token>`
**Body:**

```json
{
  "fullName": "Juan Pérez",
  "email": "juan@example.com",
  "phone": "+1234567890",
  "address": "Calle 456, Ciudad",
  "debt": 0
}
```

### GET /api/clients

**Descripción:** Obtener clientes con búsqueda opcional
**Headers:** `Authorization: Bearer <token>`
**Query Parameters:**

- `q`: Búsqueda por nombre/email/teléfono

### GET /api/clients/with-debt

**Descripción:** Obtener clientes con deuda pendiente
**Headers:** `Authorization: Bearer <token>`

### GET /api/clients/:id

**Descripción:** Obtener cliente por ID
**Headers:** `Authorization: Bearer <token>`

### PATCH /api/clients/:id

**Descripción:** Actualizar cliente
**Headers:** `Authorization: Bearer <token>`

### PATCH /api/clients/:id/debt

**Descripción:** Actualizar deuda del cliente
**Headers:** `Authorization: Bearer <token>`
**Body:**

```json
{
  "amount": 50000,
  "operation": "add"
}
```

### DELETE /api/clients/:id

**Descripción:** Eliminar cliente
**Headers:** `Authorization: Bearer <token>`

---

## 💰 Ventas

### POST /api/sales

**Descripción:** Crear nueva venta
**Headers:** `Authorization: Bearer <token>`
**Body:**

```json
{
  "invoiceNumber": "FAC-001",
  "total": 200000,
  "isCredit": false,
  "notes": "Venta al contado",
  "storeId": 1,
  "clientId": 1,
  "details": [
    {
      "productId": 1,
      "quantity": 2,
      "unitPrice": 100000
    }
  ]
}
```

### GET /api/sales

**Descripción:** Obtener ventas con filtros opcionales
**Headers:** `Authorization: Bearer <token>`
**Query Parameters:**

- `startDate`: Fecha inicio (YYYY-MM-DD)
- `endDate`: Fecha fin (YYYY-MM-DD)
- `storeId`: Filtrar por tienda

### GET /api/sales/report

**Descripción:** Obtener reporte de ventas
**Headers:** `Authorization: Bearer <token>`
**Query Parameters:**

- `startDate`: Fecha inicio (YYYY-MM-DD)
- `endDate`: Fecha fin (YYYY-MM-DD)
- `storeId`: Filtrar por tienda

### GET /api/sales/:id

**Descripción:** Obtener venta por ID
**Headers:** `Authorization: Bearer <token>`

### PATCH /api/sales/:id

**Descripción:** Actualizar venta
**Headers:** `Authorization: Bearer <token>`

### PATCH /api/sales/:id/cancel

**Descripción:** Cancelar venta
**Headers:** `Authorization: Bearer <token>`

### DELETE /api/sales/:id

**Descripción:** Eliminar venta
**Headers:** `Authorization: Bearer <token>`

---

## 📊 Inventario

### POST /api/inventory/movement

**Descripción:** Crear movimiento de inventario
**Headers:** `Authorization: Bearer <token>`
**Body:**

```json
{
  "productId": 1,
  "type": "IN",
  "quantity": 10,
  "unitPrice": 50000,
  "reason": "Compra de mercancía",
  "reference": "FAC-001"
}
```

### POST /api/inventory/adjust-stock

**Descripción:** Ajustar stock de producto
**Headers:** `Authorization: Bearer <token>`
**Body:**

```json
{
  "productId": 1,
  "newStock": 100,
  "reason": "Ajuste por conteo físico"
}
```

### GET /api/inventory/movements

**Descripción:** Obtener movimientos de inventario
**Headers:** `Authorization: Bearer <token>`
**Query Parameters:**

- `productId`: Filtrar por producto

### GET /api/inventory/low-stock

**Descripción:** Obtener productos con stock bajo
**Headers:** `Authorization: Bearer <token>`
**Query Parameters:**

- `storeId`: Filtrar por tienda

### GET /api/inventory/report

**Descripción:** Obtener reporte de inventario
**Headers:** `Authorization: Bearer <token>`
**Query Parameters:**

- `storeId`: Filtrar por tienda

### GET /api/inventory/movements/:id

**Descripción:** Obtener movimiento por ID
**Headers:** `Authorization: Bearer <token>`

### GET /api/inventory/stock-history/:productId

**Descripción:** Obtener historial de stock de un producto
**Headers:** `Authorization: Bearer <token>`

---

## 💳 Fiados

### POST /api/debts/payment

**Descripción:** Registrar pago de deuda
**Headers:** `Authorization: Bearer <token>`
**Body:**

```json
{
  "clientId": 1,
  "amount": 50000,
  "paymentType": "CASH",
  "reference": "TRF-001",
  "notes": "Pago parcial de deuda"
}
```

### GET /api/debts/payments

**Descripción:** Obtener pagos de deudas
**Headers:** `Authorization: Bearer <token>`
**Query Parameters:**

- `startDate`: Fecha inicio (YYYY-MM-DD)
- `endDate`: Fecha fin (YYYY-MM-DD)
- `clientId`: Filtrar por cliente

### GET /api/debts/report

**Descripción:** Obtener reporte de deudas
**Headers:** `Authorization: Bearer <token>`
**Query Parameters:**

- `startDate`: Fecha inicio (YYYY-MM-DD)
- `endDate`: Fecha fin (YYYY-MM-DD)
- `clientId`: Filtrar por cliente

### GET /api/debts/clients-with-debt

**Descripción:** Obtener clientes con deuda pendiente
**Headers:** `Authorization: Bearer <token>`

### GET /api/debts/total-debt

**Descripción:** Obtener deuda total
**Headers:** `Authorization: Bearer <token>`

### GET /api/debts/payments/:id

**Descripción:** Obtener pago por ID
**Headers:** `Authorization: Bearer <token>`

### GET /api/debts/client-history/:clientId

**Descripción:** Obtener historial de pagos de un cliente
**Headers:** `Authorization: Bearer <token>`

---

## 📈 Reportes

### POST /api/reports/generate

**Descripción:** Generar reporte personalizado
**Headers:** `Authorization: Bearer <token>`
**Body:**

```json
{
  "type": "SALES",
  "startDate": "2025-01-01",
  "endDate": "2025-01-31",
  "storeId": 1,
  "format": "json"
}
```

### GET /api/reports/sales

**Descripción:** Generar reporte de ventas
**Headers:** `Authorization: Bearer <token>`
**Query Parameters:**

- `startDate`: Fecha inicio (YYYY-MM-DD)
- `endDate`: Fecha fin (YYYY-MM-DD)
- `storeId`: Filtrar por tienda
- `clientId`: Filtrar por cliente
- `format`: Formato (json/excel)

### GET /api/reports/inventory

**Descripción:** Generar reporte de inventario
**Headers:** `Authorization: Bearer <token>`
**Query Parameters:**

- `storeId`: Filtrar por tienda
- `productId`: Filtrar por producto
- `format`: Formato (json/excel)

### GET /api/reports/debts

**Descripción:** Generar reporte de deudas
**Headers:** `Authorization: Bearer <token>`
**Query Parameters:**

- `startDate`: Fecha inicio (YYYY-MM-DD)
- `endDate`: Fecha fin (YYYY-MM-DD)
- `clientId`: Filtrar por cliente
- `format`: Formato (json/excel)

### GET /api/reports/profits

**Descripción:** Generar reporte de ganancias
**Headers:** `Authorization: Bearer <token>`
**Query Parameters:**

- `startDate`: Fecha inicio (YYYY-MM-DD)
- `endDate`: Fecha fin (YYYY-MM-DD)
- `storeId`: Filtrar por tienda
- `format`: Formato (json/excel)

---

## 📁 Subida de Archivos

### POST /api/uploads/image

**Descripción:** Subir imagen
**Headers:** `Authorization: Bearer <token>`
**Content-Type:** `multipart/form-data`
**Body:** `file` (archivo de imagen)

### POST /api/uploads/document

**Descripción:** Subir documento
**Headers:** `Authorization: Bearer <token>`
**Content-Type:** `multipart/form-data`
**Body:** `file` (archivo de documento)

---

## 🔧 Utilidades

### GET /api/health

**Descripción:** Verificar estado de la aplicación
**Público:** Sí

---

## 📚 Documentación Swagger

- **URL:** `http://localhost:3000/api/docs`
- **Descripción:** Documentación interactiva de la API

---

## 🔑 Tipos de Datos

### Tipos de Movimiento de Inventario

- `IN`: Entrada
- `OUT`: Salida
- `ADJUSTMENT`: Ajuste
- `SALE`: Venta
- `RETURN`: Devolución

### Tipos de Pago

- `CASH`: Efectivo
- `TRANSFER`: Transferencia
- `CARD`: Tarjeta
- `OTHER`: Otro

### Roles de Usuario

- `ADMIN`: Administrador
- `EMPLOYEE`: Empleado

### Tipos de Reporte

- `SALES`: Ventas
- `INVENTORY`: Inventario
- `DEBTS`: Deudas
- `PROFITS`: Ganancias
- `CLIENTS`: Clientes
- `PRODUCTS`: Productos
