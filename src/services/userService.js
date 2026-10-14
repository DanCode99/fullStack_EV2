export const initialUsers = [
  { run: "111111111", nombre: "Admin", apellidos: "Sistema", correo: "admin@duoc.cl", fechaNacimiento: "1980-01-01", tipoUsuario: "Administrador", region: "Región Metropolitana de Santiago", comuna: "Santiago", direccion: "Calle 1", password: "123456" },
  { run: "222222222", nombre: "Vendedor", apellidos: "Uno", correo: "vendedor1@duoc.cl", fechaNacimiento: "1990-05-15", tipoUsuario: "Vendedor", region: "Región de Valparaíso", comuna: "Viña del Mar", direccion: "Avenida 2", password: "123456" },
  { run: "333333333", nombre: "Vendedor", apellidos: "Dos", correo: "vendedor2@duoc.cl", fechaNacimiento: "1992-08-20", tipoUsuario: "Vendedor", region: "Región del Biobío", comuna: "Concepción", direccion: "Pasaje 3", password: "123456" },
  { run: "444444444", nombre: "Cliente", apellidos: "A", correo: "clienteA@gmail.com", fechaNacimiento: "1995-12-10", tipoUsuario: "Cliente", region: "Región Metropolitana de Santiago", comuna: "Maipú", direccion: "Calle 4", password: "123456" },
  { run: "555555555", nombre: "Cliente", apellidos: "B", correo: "clienteB@gmail.com", fechaNacimiento: "1996-11-11", tipoUsuario: "Cliente", region: "Región Metropolitana de Santiago", comuna: "Puente Alto", direccion: "Calle 5", password: "123456" },
  { run: "666666666", nombre: "Cliente", apellidos: "C", correo: "clienteC@gmail.com", fechaNacimiento: "1997-10-12", tipoUsuario: "Cliente", region: "Región de Valparaíso", comuna: "Valparaíso", direccion: "Calle 6", password: "123456" }
];

const USERS_STORAGE_KEY = 'tienda_usuarios';
const LOGGED_USER_KEY = 'loggedUser';

export const userService = {
  getAll: () => {
    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initialUsers));
        return initialUsers;
      }
      return JSON.parse(stored);
    } catch {
      return initialUsers;
    }
  },

  getByRun: (run) => {
    const users = userService.getAll();
    return users.find(u => String(u.run) === String(run));
  },

  create: (newUser) => {
    const users = userService.getAll();
    const updated = [newUser, ...users];
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updated));
    return newUser;
  },

  update: (run, updatedFields) => {
    const users = userService.getAll();
    const updated = users.map(u => String(u.run) === String(run) ? { ...u, ...updatedFields } : u);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updated));
    return updated.find(u => String(u.run) === String(run));
  },

  delete: (run) => {
    const users = userService.getAll();
    const filtered = users.filter(u => String(u.run) !== String(run));
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  login: (correo, password) => {
    const users = userService.getAll();
    const user = users.find(u => u.correo.toLowerCase() === correo.toLowerCase() && u.password === password);
    if (user) {
      localStorage.setItem(LOGGED_USER_KEY, JSON.stringify(user));
      return user;
    }
    return null;
  },

  logout: () => {
    localStorage.removeItem(LOGGED_USER_KEY);
  },

  getLoggedUser: () => {
    try {
      const stored = localStorage.getItem(LOGGED_USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }
};
