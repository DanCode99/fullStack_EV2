const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

/**
 * Cliente HTTP base para la API REST de Spring Boot.
 * - Inyecta automáticamente Authorization: Bearer <token> si existe en localStorage.
 * - Gestiona expiración o accesos no autorizados (401 / 403) limpiando la sesión y redirigiendo a /login.
 * - Maneja respuestas 204 No Content y propaga errores del backend.
 */
export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const cleanBase = BASE_URL.replace(/\/+$/, '');
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${cleanBase}${cleanEndpoint}`;

  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers
    });
  } catch (networkError) {
    throw new Error(`Error de conexión con el servidor: ${networkError.message}`, { cause: networkError });
  }

  // Si responde 401 o 403, evaluar si es una acción de escritura/admin para no expulsar al usuario
  if (response.status === 401 || response.status === 403) {
    const isWriteOrAdminAction =
      (options.method && options.method !== 'GET') ||
      cleanEndpoint.includes('/productos') ||
      cleanEndpoint.includes('/usuarios') ||
      cleanEndpoint.includes('/ordenes') ||
      (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin'));

    let authErrorMessage = 'Acceso no autorizado o permisos insuficientes (401/403).';
    try {
      const errJson = await response.json();
      authErrorMessage =
        errJson.message ||
        errJson.mensaje ||
        errJson.error ||
        authErrorMessage;
    } catch {
      // Ignorar fallo de parseo JSON
    }

    if (!isWriteOrAdminAction) {
      localStorage.removeItem('token');
      localStorage.removeItem('loggedUser');
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    throw new Error(authErrorMessage);
  }

  // Si responde 204 No Content, retorna true
  if (response.status === 204) {
    return true;
  }

  // Si !response.ok lanza Error con el mensaje del backend
  if (!response.ok) {
    let errorMessage = `Error ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      errorMessage =
        errorData.message ||
        errorData.mensaje ||
        errorData.error ||
        (typeof errorData === 'string' ? errorData : JSON.stringify(errorData));
    } catch {
      try {
        const errorText = await response.text();
        if (errorText) errorMessage = errorText;
      } catch {
        // mantener mensaje por defecto
      }
    }
    throw new Error(errorMessage);
  }

  // Respuesta exitosa
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }

  const text = await response.text();
  return text ? text : true;
}

export default apiFetch;
