import { apiFetch } from './apiClient.js';

export const userService = {
  /**
   * Inicio de sesión
   * POST /auth/login
   * @param {string} correo
   * @param {string} password
   * @returns {Promise<{ token, run, nombre, apellidos, correo, rol }>}
   */
  login: async (correo, password) => {
    return await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ correo, password })
    });
  },

  /**
   * Registro de clientes
   * POST /auth/registro
   * @param {{ run, nombre, apellidos, correo, password, idComuna, direccion, fechaNacimiento }} userData
   * @returns {Promise<{ token, rol: "CLIENTE", ... }>}
   */
  register: async (userData) => {
    return await apiFetch('/auth/registro', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  /**
   * Obtener todas las regiones para selects dinámicos
   * GET /ubicaciones/regiones
   * @returns {Promise<Array<{ idRegion, nombreRegion }>>}
   */
  getRegiones: async () => {
    return await apiFetch('/ubicaciones/regiones');
  },

  /**
   * Obtener comunas pertenecientes a una región
   * GET /ubicaciones/regiones/{id}/comunas
   * @param {number|string} idRegion
   * @returns {Promise<Array<{ idComuna, nombreComuna, idRegion }>>}
   */
  getComunasByRegion: async (idRegion) => {
    return await apiFetch(`/ubicaciones/regiones/${idRegion}/comunas`);
  },

  /**
   * Listar todos los usuarios (Admin)
   * GET /usuarios (Bearer ADMIN)
   * @returns {Promise<Array<{ run, nombre, apellidos, correo, nombreRol, idComuna, direccion }>>}
   */
  getAll: async () => {
    return await apiFetch('/usuarios');
  },

  /**
   * Crear nuevo usuario desde el panel de administración
   * POST /usuarios (Bearer ADMIN)
   * @param {{ run, nombre, apellidos, correo, password, nombreRol, idComuna, direccion }} userData
   */
  create: async (userData) => {
    return await apiFetch('/usuarios', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  /**
   * Eliminar usuario por RUN (Admin)
   * DELETE /usuarios/{run} (Bearer ADMIN)
   * @param {string} run
   */
  delete: async (run) => {
    return await apiFetch(`/usuarios/${run}`, {
      method: 'DELETE'
    });
  },

  /**
   * Cerrar sesión y limpiar almacenamiento
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedUser');
  },

  /**
   * Obtener usuario almacenado en sesión local
   */
  getLoggedUser: () => {
    try {
      const token = localStorage.getItem('token');
      const stored = localStorage.getItem('loggedUser');
      if (token && stored) {
        return JSON.parse(stored);
      }
      return null;
    } catch {
      return null;
    }
  },

  /**
   * Obtener JWT actual
   */
  getToken: () => {
    return localStorage.getItem('token');
  }
};

export default userService;
