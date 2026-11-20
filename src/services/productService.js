import { apiFetch } from './apiClient.js';

export const productService = {
  /**
   * Obtener catálogo completo de productos
   * GET /productos
   * @returns {Promise<Array<{ id, titulo, precio, stock, img, img2, categoria, nombreMarca }>>}
   */
  getAll: async () => {
    return await apiFetch('/productos');
  },

  /**
   * Obtener producto por ID
   * GET /productos/{id}
   * @param {number|string} id
   */
  getById: async (id) => {
    try {
      return await apiFetch(`/productos/${id}`);
    } catch {
      // Fallback a buscar en la lista completa
      const all = await apiFetch('/productos');
      return Array.isArray(all) ? all.find(p => String(p.id) === String(id)) : null;
    }
  },

  /**
   * Crear producto (Bearer ADMIN)
   * POST /productos
   * @param {{ titulo, precio, stock, stockCritico, talla, idMarca, img, img2, categoriasIds }} productData
   */
  create: async (productData) => {
    return await apiFetch('/productos', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  },

  /**
   * Actualizar producto existente (Bearer ADMIN)
   * PUT /productos/{id}
   * @param {number|string} id
   * @param {{ titulo, precio, stock, stockCritico, talla, idMarca, img, img2, categoriasIds }} productData
   */
  update: async (id, productData) => {
    return await apiFetch(`/productos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    });
  },

  /**
   * Eliminar producto (Bearer ADMIN)
   * DELETE /productos/{id}
   * @param {number|string} id
   */
  delete: async (id) => {
    return await apiFetch(`/productos/${id}`, {
      method: 'DELETE'
    });
  }
};

// Alias para compatibilidad con código existente
export const productStorage = productService;

export default productService;
