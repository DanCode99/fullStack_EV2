import { apiFetch } from './apiClient.js';

export const orderService = {
  /**
   * Crear nueva orden de compra en Checkout
   * POST /ordenes (Bearer CLIENTE/ADMIN)
   * @param {{ userRun, metodoPago, total, items: Array<{ idProducto, cantidad, precio, talla }> }} orderData
   */
  create: async (orderData) => {
    return await apiFetch('/ordenes', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  },

  /**
   * Listar todas las órdenes (Bearer ADMIN/VENDEDOR)
   * GET /ordenes
   * @returns {Promise<Array<{ idOrden, customerName, total, estado, fecha, items }>>}
   */
  getAll: async () => {
    return await apiFetch('/ordenes');
  },

  /**
   * Listar órdenes exclusivas del cliente autenticado
   * GET /ordenes/mis-ordenes (Bearer CLIENTE)
   * @returns {Promise<Array<{ idOrden, customerName, total, estado, fecha, items }>>}
   */
  getMisOrdenes: async () => {
    return await apiFetch('/ordenes/mis-ordenes');
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
      try {
        return await orderService.getMisOrdenes();
      } catch {
        return [];
      }
    }
  }
};

export default orderService;
