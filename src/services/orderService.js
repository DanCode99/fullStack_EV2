// Generación de 30 compras históricas repartidas entre clientes
export const initialOrders = [
  {
    id: "ORD-202401",
    userRun: "444444444",
    customerName: "Cliente A",
    fecha: "2026-03-01",
    total: 99980,
    items: [
      { id: 1, titulo: "Camiseta Brasil Local 2026", precio: 49990, cantidad: 1, talla: "M" },
      { id: 4, titulo: "Camiseta España Local 2026", precio: 49990, cantidad: 1, talla: "L" }
    ],
    estado: "Entregado"
  },
  {
    id: "ORD-202402",
    userRun: "444444444",
    customerName: "Cliente A",
    fecha: "2026-03-05",
    total: 44990,
    items: [
      { id: 2, titulo: "Camiseta Universidad de Chile Local", precio: 44990, cantidad: 1, talla: "S" }
    ],
    estado: "Entregado"
  },
  {
    id: "ORD-202403",
    userRun: "444444444",
    customerName: "Cliente A",
    fecha: "2026-03-12",
    total: 52990,
    items: [
      { id: 5, titulo: "Camiseta Argentina Tres Estrellas", precio: 52990, cantidad: 1, talla: "XL" }
    ],
    estado: "Entregado"
  },
  {
    id: "ORD-202404",
    userRun: "555555555",
    customerName: "Cliente B",
    fecha: "2026-03-02",
    total: 49990,
    items: [
      { id: 3, titulo: "Camiseta Francia Local 2026", precio: 49990, cantidad: 1, talla: "M" }
    ],
    estado: "Entregado"
  },
  {
    id: "ORD-202405",
    userRun: "555555555",
    customerName: "Cliente B",
    fecha: "2026-03-10",
    total: 89980,
    items: [
      { id: 9, titulo: "Camiseta Universidad Católica", precio: 44990, cantidad: 2, talla: "L" }
    ],
    estado: "Entregado"
  },
  {
    id: "ORD-202406",
    userRun: "555555555",
    customerName: "Cliente B",
    fecha: "2026-03-18",
    total: 42990,
    items: [
      { id: 7, titulo: "Camiseta Palestino Tradicional", precio: 42990, cantidad: 1, talla: "M" }
    ],
    estado: "Entregado"
  },
  {
    id: "ORD-202407",
    userRun: "666666666",
    customerName: "Cliente C",
    fecha: "2026-03-03",
    total: 47990,
    items: [
      { id: 6, titulo: "Camiseta Estados Unidos 2026", precio: 47990, cantidad: 1, talla: "M" }
    ],
    estado: "Entregado"
  },
  {
    id: "ORD-202408",
    userRun: "666666666",
    customerName: "Cliente C",
    fecha: "2026-03-08",
    total: 41990,
    items: [
      { id: 8, titulo: "Camiseta Audax Italiano Local", precio: 41990, cantidad: 1, talla: "L" }
    ],
    estado: "Entregado"
  },
  {
    id: "ORD-202409",
    userRun: "666666666",
    customerName: "Cliente C",
    fecha: "2026-03-15",
    total: 49990,
    items: [
      { id: 10, titulo: "Camiseta Colo-Colo Local 2026", precio: 49990, cantidad: 1, talla: "XL" }
    ],
    estado: "Entregado"
  },
  {
    id: "ORD-202410",
    userRun: "777777777",
    customerName: "Cliente D",
    fecha: "2026-03-04",
    total: 48990,
    items: [
      { id: 11, titulo: "Camiseta Colombia Local 2026", precio: 48990, cantidad: 1, talla: "M" }
    ],
    estado: "Entregado"
  },
  {
    id: "ORD-202411",
    userRun: "777777777",
    customerName: "Cliente D",
    fecha: "2026-03-11",
    total: 46990,
    items: [
      { id: 12, titulo: "Camiseta Venezuela Vinotinto", precio: 46990, cantidad: 1, talla: "S" }
    ],
    estado: "Entregado"
  },
  {
    id: "ORD-202412",
    userRun: "777777777",
    customerName: "Cliente D",
    fecha: "2026-03-22",
    total: 52990,
    items: [
      { id: 5, titulo: "Camiseta Argentina Tres Estrellas", precio: 52990, cantidad: 1, talla: "M" }
    ],
    estado: "Entregado"
  },
  {
    id: "ORD-202413",
    userRun: "888888888",
    customerName: "Cliente E",
    fecha: "2026-03-06",
    total: 49990,
    items: [
      { id: 1, titulo: "Camiseta Brasil Local 2026", precio: 49990, cantidad: 1, talla: "L" }
    ],
    estado: "Entregado"
  },
  {
    id: "ORD-202414",
    userRun: "888888888",
    customerName: "Cliente E",
    fecha: "2026-03-13",
    total: 44990,
    items: [
      { id: 2, titulo: "Camiseta Universidad de Chile Local", precio: 44990, cantidad: 1, talla: "M" }
    ],
    estado: "Entregado"
  },
  {
    id: "ORD-202415",
    userRun: "888888888",
    customerName: "Cliente E",
    fecha: "2026-03-20",
    total: 49990,
    items: [
      { id: 4, titulo: "Camiseta España Local 2026", precio: 49990, cantidad: 1, talla: "S" }
    ],
    estado: "Entregado"
  },
  {
    id: "ORD-202416",
    userRun: "999999999",
    customerName: "Cliente F",
    fecha: "2026-03-07",
    total: 44990,
    items: [
      { id: 9, titulo: "Camiseta Universidad Católica", precio: 44990, cantidad: 1, talla: "M" }
    ],
    estado: "Entregado"
  },
  {
    id: "ORD-202417",
    userRun: "999999999",
    customerName: "Cliente F",
    fecha: "2026-03-14",
    total: 42990,
    items: [
      { id: 7, titulo: "Camiseta Palestino Tradicional", precio: 42990, cantidad: 1, talla: "L" }
    ],
    estado: "Entregado"
  },
  {
    id: "ORD-202418",
    userRun: "999999999",
    customerName: "Cliente F",
    fecha: "2026-03-24",
    total: 49990,
    items: [
      { id: 10, titulo: "Camiseta Colo-Colo Local 2026", precio: 49990, cantidad: 1, talla: "XL" }
    ],
    estado: "Entregado"
  },
  {
    id: "ORD-202419",
    userRun: "101010101",
    customerName: "Cliente G",
    fecha: "2026-03-09",
    total: 48990,
    items: [
      { id: 11, titulo: "Camiseta Colombia Local 2026", precio: 48990, cantidad: 1, talla: "M" }
    ],
    estado: "Entregado"
  },
  {
    id: "ORD-202420",
    userRun: "101010101",
    customerName: "Cliente G",
    fecha: "2026-03-16",
    total: 47990,
    items: [
      { id: 6, titulo: "Camiseta Estados Unidos 2026", precio: 47990, cantidad: 1, talla: "L" }
    ],
    estado: "Entregado"
  },
  {
    id: "ORD-202421",
    userRun: "101010101",
    customerName: "Cliente G",
    fecha: "2026-03-25",
    total: 46990,
    items: [
      { id: 12, titulo: "Camiseta Venezuela Vinotinto", precio: 46990, cantidad: 1, talla: "M" }
    ],
    estado: "Entregado"
  },
  {
    id: "ORD-202422",
    userRun: "121212121",
    customerName: "Cliente H",
    fecha: "2026-03-17",
    total: 49990,
    items: [
      { id: 1, titulo: "Camiseta Brasil Local 2026", precio: 49990, cantidad: 1, talla: "XL" }
    ],
    estado: "Entregado"
  },
  {
    id: "ORD-202423",
    userRun: "121212121",
    customerName: "Cliente H",
    fecha: "2026-03-21",
    total: 52990,
    items: [
      { id: 5, titulo: "Camiseta Argentina Tres Estrellas", precio: 52990, cantidad: 1, talla: "M" }
    ],
    estado: "Entregado"
  },
  {
    id: "ORD-202424",
    userRun: "121212121",
    customerName: "Cliente H",
    fecha: "2026-03-28",
    total: 44990,
    items: [
      { id: 2, titulo: "Camiseta Universidad de Chile Local", precio: 44990, cantidad: 1, talla: "L" }
    ],
    estado: "Entregado"
  },
  {
    id: "ORD-202425",
    userRun: "131313131",
    customerName: "Cliente I",
    fecha: "2026-03-19",
    total: 41990,
    items: [
      { id: 8, titulo: "Camiseta Audax Italiano Local", precio: 41990, cantidad: 1, talla: "M" }
    ],
    estado: "Entregado"
  },
  {
    id: "ORD-202426",
    userRun: "131313131",
    customerName: "Cliente I",
    fecha: "2026-03-26",
    total: 49990,
    items: [
      { id: 4, titulo: "Camiseta España Local 2026", precio: 49990, cantidad: 1, talla: "L" }
    ],
    estado: "Entregado"
  },
  {
    id: "ORD-202427",
    userRun: "141414141",
    customerName: "Cliente J",
    fecha: "2026-03-23",
    total: 44990,
    items: [
      { id: 9, titulo: "Camiseta Universidad Católica", precio: 44990, cantidad: 1, talla: "S" }
    ],
    estado: "Entregado"
  },
  {
    id: "ORD-202428",
    userRun: "141414141",
    customerName: "Cliente J",
    fecha: "2026-03-27",
    total: 49990,
    items: [
      { id: 3, titulo: "Camiseta Francia Local 2026", precio: 49990, cantidad: 1, talla: "M" }
    ],
    estado: "Entregado"
  },
  {
    id: "ORD-202429",
    userRun: "141414141",
    customerName: "Cliente J",
    fecha: "2026-03-29",
    total: 42990,
    items: [
      { id: 7, titulo: "Camiseta Palestino Tradicional", precio: 42990, cantidad: 1, talla: "XL" }
    ],
    estado: "Entregado"
  },
  {
    id: "ORD-202430",
    userRun: "141414141",
    customerName: "Cliente J",
    fecha: "2026-03-30",
    total: 49990,
    items: [
      { id: 10, titulo: "Camiseta Colo-Colo Local 2026", precio: 49990, cantidad: 1, talla: "M" }
    ],
    estado: "Entregado"
  }
];

const ORDERS_STORAGE_KEY = 'tienda_ordenes_historial';

export const orderService = {
  getAll: () => {
    try {
      const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(initialOrders));
        return initialOrders;
      }
      return JSON.parse(stored);
    } catch {
      return initialOrders;
    }
  },

  getByUserRun: (run) => {
    const orders = orderService.getAll();
    return orders.filter(o => String(o.userRun) === String(run));
  },

  create: (newOrder) => {
    const orders = orderService.getAll();
    const updated = [newOrder, ...orders];
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    return newOrder;
  }
};
