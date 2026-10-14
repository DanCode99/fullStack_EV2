# Tienda de Camisetas de Fútbol - Evaluación 2

Proyecto desarrollado en React con Vite para la Evaluación 2 de Desarrollo FullStack II (Duoc UC).
Esta versión corresponde a la migración desde HTML/JS vanilla hacia una arquitectura basada en componentes reutilizables utilizando **Atomic Design**, estilos con **Bulma CSS** y persistencia de datos en `localStorage`.

---

## Cómo levantar el proyecto localmente

1. Clonar el repositorio y entrar a la carpeta:

```bash
git clone https://github.com/DanCode99/fullStack_EV2.git
cd fullStack_EV2
```

2. Instalar las dependencias:

```bash
npm install
```

3. Iniciar el servidor de desarrollo:

```bash
npm run dev
```

4. Para validar que no haya errores de linting:

```bash
npm run lint
```

5. Para compilar la versión de producción:

```bash
npm run build
```

---

## Cuentas de prueba para iniciar sesión

Para probar las distintas vistas, permisos y roles del sistema (Cliente, Vendedor y Administrador), puedes usar las siguientes credenciales registradas:

| Rol                     | Correo                                            | Contraseña | ¿A qué tiene acceso?                                                                                                            |
| :---------------------- | :------------------------------------------------ | :---------- | :-------------------------------------------------------------------------------------------------------------------------------- |
| **Administrador** | `admin@duoc.cl`                                 | `123456`  | Acceso total al Panel Admin (Dashboard con alertas de stock, CRUD de Productos, CRUD de Usuarios e Historial general de compras). |
| **Vendedor**      | `vendedor1@duoc.cl`                             | `123456`  | Acceso a Dashboard y catálogo del Panel Admin. No puede gestionar usuarios ni crear nuevos productos.                            |
| **Cliente A**     | `clienteA@gmail.com`                            | `123456`  | Navegación de tienda, catálogo, carrito, checkout y compras registradas con RUN 444444444.                                      |
| **Cliente B**     | `clienteB@gmail.com`                            | `123456`  | Cliente frecuente con compras registradas (RUN 555555555).                                                                        |
| **Cliente C**     | `clienteC@gmail.com`                            | `123456`  | Cliente de Valparaíso con historial de compras (RUN 666666666).                                                                  |
| **Cliente D - J** | `clienteD@gmail.com` ... `clienteJ@gmail.com` | `123456`  | Cuentas cliente adicionales con historial y compras asignadas.                                                                    |

> También puedes usar la opción **"Registro"** en la barra superior para crear una cuenta nueva de cliente con tus propios datos.

---

## Estructura del proyecto (Atomic Design)

El código fuente en `src/` está organizado bajo la metodología Atomic Design para mantener todo ordenado y desacoplado:

- **`components/atoms/`**: Elementos base (botones, inputs, badges de stock y títulos).
- **`components/molecules/`**: Combinaciones funcionales (campos de formulario con labels/errores, tarjetas de producto y filas del carrito).
- **`components/organisms/`**: Bloques completos (Navbar responsive con menú burger, Footer institucional y carrusel de inicio).
- **`components/templates/`**: Estructuras de página (MainLayout para la tienda pública y AdminLayout para el panel administrativo).
- **`views/`**: Vistas completas de la aplicación (Home, Catálogo con filtros y ordenamiento, Categorías, Ofertas, Detalle de producto, Carrito, Checkout, Compra exitosa, Compra con error, Nosotros, Blog, Contacto, Login, Registro y Panel Admin).
- **`services/`**: Módulos de persistencia simulada con operaciones CRUD en `localStorage` (`productService.js` y `userService.js`).
- **`data/`**: Listado inicial de datos semilla (regiones y comunas de Chile, historias del blog).
- **`styles/`**: Estilos globales y personalizados adaptados con Bulma.

---

## Flujos principales agregados en esta entrega

- **Filtros y Búsqueda**: El catálogo permite filtrar por categoría, buscar por nombre o país en tiempo real y ordenar por precio ascendente o descendente.
- **Detalle de Producto**: Selector interactivo de tallas, control de unidades según stock disponible y cambio de vista en miniatura de fotos.
- **Carrito de Compras**: Suma y resta de cantidades, eliminación de ítems, cálculo automático de subtotales y total acumulado.
- **Checkout y Despacho**: Si inicias sesión, el formulario de entrega precarga tus datos automáticamente. Incluye selección dinámica de comunas según la región elegida en Chile.
- **Simulación de Pago**: En el checkout se incluye una casilla de prueba para simular tanto el flujo de **Compra Exitosa** (con generación de boleta y código de orden) como el de **Fallo de Pago** para evaluar ambos requerimientos de la pauta.
