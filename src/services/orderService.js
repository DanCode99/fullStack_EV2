import { apiFetch } from './apiClient.js';

export const INITIAL_FALLBACK_ORDERS = [
  {
    id: 1001,
    idOrden: 1001,
    userRun: '184521234',
    customerName: 'Matías Silva',
    fecha: '2026-11-20',
    total: 49990,
    estado: 'ENTREGADO',
    items: [
      {
        id: 1,
        idProducto: 1,
        titulo: 'Camiseta Brasil Local 2026',
        cantidad: 1,
        precio: 49990,
        talla: 'M',
        img: '/assets/images/brasil/brasil1.jpeg'
      }
    ]
  },
  {
    id: 1002,
    idOrden: 1002,
    userRun: '192345678',
    customerName: 'Francisca Morales',
    fecha: '2026-11-23',
    total: 35992,
    estado: 'ENVIADO',
    items: [
      {
        id: 2,
        idProducto: 2,
        titulo: 'Camiseta Universidad de Chile Local',
        cantidad: 1,
        precio: 35992,
        talla: 'L',
        img: '/assets/images/u_de_chile/lau1.webp'
      }
    ]
  },
  {
    id: 1003,
    idOrden: 1003,
    userRun: '178901235',
    customerName: 'Cristóbal Soto',
    fecha: '2026-11-25',
    total: 102980,
    estado: 'ENTREGADO',
    items: [
      {
        id: 5,
        idProducto: 5,
        titulo: 'Camiseta Argentina Tres Estrellas',
        cantidad: 1,
        precio: 52990,
        talla: 'XL',
        img: '/assets/images/argentina/argentina1.jpg'
      },
      {
        id: 3,
        idProducto: 3,
        titulo: 'Camiseta Francia Local 2026',
        cantidad: 1,
        precio: 49990,
        talla: 'M',
        img: '/assets/images/francia/francia1.png'
      }
    ]
  },
  {
    id: 1004,
    idOrden: 1004,
    userRun: '201123349',
    customerName: 'Valentina Rojas',
    fecha: '2026-11-27',
    total: 37493,
    estado: 'PROCESANDO',
    items: [
      {
        id: 6,
        idProducto: 6,
        titulo: 'Camiseta Colo-Colo Local 2026',
        cantidad: 1,
        precio: 37493,
        talla: 'L',
        img: '/assets/images/zorras/zorra1.jpg'
      }
    ]
  }
];

const ORDERS_STORAGE_KEY = 'futbol_orders_backup';

function getLocalOrders() {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(INITIAL_FALLBACK_ORDERS));
      return INITIAL_FALLBACK_ORDERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_FALLBACK_ORDERS;
  } catch {
    return INITIAL_FALLBACK_ORDERS;
  }
}

function saveLocalOrder(newOrder) {
  try {
    const current = getLocalOrders();
    const updated = [newOrder, ...current.filter(o => o.id !== newOrder.id && o.idOrden !== newOrder.idOrden)];
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [newOrder];
  }
}

export const orderService = {
  /**
   * Crear nueva orden de compra en Checkout
   * POST /ordenes (Bearer CLIENTE/ADMIN)
   * @param {{ userRun, metodoPago, total, items: Array<{ idProducto, cantidad, precio, talla }> }} orderData
   */
  create: async (orderData) => {
    let apiResult = null;
    try {
      apiResult = await apiFetch('/ordenes', {
        method: 'POST',
        body: JSON.stringify(orderData)
      });
    } catch (err) {
      console.warn('Backend /ordenes no disponible o en modo local, guardando orden localmente:', err.message);
    }

    const orderId = apiResult?.idOrden || apiResult?.id || Date.now();
    const savedOrder = {
      id: orderId,
      idOrden: orderId,
      userRun: orderData.userRun,
      customerName: orderData.customerName || 'Cliente Web',
      fecha: new Date().toISOString().split('T')[0],
      total: orderData.total,
      estado: 'PAGADO',
      items: orderData.items || []
    };
    saveLocalOrder(savedOrder);
    return apiResult || savedOrder;
  },

  /**
   * Listar todas las órdenes (Bearer ADMIN/VENDEDOR)
   * GET /ordenes
   * Retorna órdenes del backend combinadas con las órdenes iniciales de respaldo y locales
   * @returns {Promise<Array<{ idOrden, customerName, total, estado, fecha, items }>>}
   */
  getAll: async () => {
    try {
      const data = await apiFetch('/ordenes');
      if (Array.isArray(data) && data.length > 0) {
        const local = getLocalOrders();
        const apiIds = new Set(data.map(o => o.idOrden || o.id));
        const extraLocal = local.filter(o => !apiIds.has(o.idOrden || o.id));
        return [...data, ...extraLocal];
      }
      return getLocalOrders();
    } catch {
      return getLocalOrders();
    }
  },

  /**
   * Listar órdenes exclusivas del cliente autenticado
   * GET /ordenes/mis-ordenes (Bearer CLIENTE)
   * @returns {Promise<Array<{ idOrden, customerName, total, estado, fecha, items }>>}
   */
  getMisOrdenes: async () => {
    try {
      return await apiFetch('/ordenes/mis-ordenes');
    } catch {
      return getLocalOrders();
    }
  },

  /**
   * Obtener órdenes por RUN del usuario
   * Si es cliente llama a sus órdenes; si es admin/vendedor filtra del listado general
   * @param {string} run
   */
  getByUserRun: async (run) => {
    try {
      const orders = await orderService.getAll();
      return Array.isArray(orders) ? orders.filter(o => String(o.userRun) === String(run)) : [];
    } catch {
      const fallback = getLocalOrders();
      return fallback.filter(o => String(o.userRun) === String(run));
    }
  }
};

export default orderService;
