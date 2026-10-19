import { useState, useMemo } from 'react'
import { MetricCard } from '../../molecules/MetricCard/MetricCard.jsx'
import { Button } from '../../atoms/Button/Button.jsx'

export function ReportsPanel({ orders = [], products = [], users = [] }) {
  const [periodFilter, setPeriodFilter] = useState('ALL') // 'ALL', 'MARZO', 'RECENT'

  // Filtrado de Stock Crítico dinámico
  const criticalProducts = useMemo(() => {
    return products.filter(p => {
      const currentStock = Number(p.stock) || 0;
      // Usar p.stockCritico si existe, sino por defecto 5
      const criticalLimit = Number(p.stockCritico) || 5;
      return currentStock <= criticalLimit;
    });
  }, [products]);

  // Filtrado por periodo
  const filteredOrders = useMemo(() => {
    if (periodFilter === 'MARZO') {
      return orders.filter(o => o.fecha?.startsWith('2026-03'))
    }
    if (periodFilter === 'RECENT') {
      // Últimas 10 órdenes
      return [...orders].slice(0, 10)
    }
    return orders
  }, [orders, periodFilter])

  // 1. Cálculos de KPIs generales
  const totalRevenue = useMemo(() => {
    return filteredOrders.reduce((acc, o) => acc + (Number(o.total) || 0), 0)
  }, [filteredOrders])

  const totalOrdersCount = filteredOrders.length

  const averageTicket = useMemo(() => {
    return totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0
  }, [totalRevenue, totalOrdersCount])

  const totalUnitsSold = useMemo(() => {
    return filteredOrders.reduce((acc, o) => {
      return acc + (o.items?.reduce((s, it) => s + (Number(it.cantidad) || 1), 0) || 0)
    }, 0)
  }, [filteredOrders])

  const uniqueCustomersCount = useMemo(() => {
    const runs = new Set(filteredOrders.map(o => String(o.userRun)))
    return runs.size
  }, [filteredOrders])

  // 2. Ranking de Productos Más Vendidos
  const topSellingProducts = useMemo(() => {
    const productMap = {}

    filteredOrders.forEach(ord => {
      (ord.items || []).forEach(item => {
        const key = item.titulo || `Producto #${item.id}`
        if (!productMap[key]) {
          const catalogProd = products.find(p => p.id === item.id || p.titulo === item.titulo)
          productMap[key] = {
            id: item.id,
            titulo: item.titulo,
            img: item.img || catalogProd?.img || '/assets/images/brasil/brasil1.jpeg',
            categoria: catalogProd?.categoria || 'Indumentaria Deportiva',
            unidades: 0,
            ingresos: 0,
            precioUnitario: Number(item.precio) || catalogProd?.precio || 0
          }
        }
        const qty = Number(item.cantidad) || 1
        productMap[key].unidades += qty
        productMap[key].ingresos += qty * (Number(item.precio) || productMap[key].precioUnitario)
      })
    })

    const list = Object.values(productMap).sort((a, b) => b.unidades - a.unidades)
    const maxUnits = list[0]?.unidades || 1

    return list.map(item => ({
      ...item,
      percentage: Math.round((item.unidades / maxUnits) * 100)
    }))
  }, [filteredOrders, products])

  // 3. Ventas por Categoría
  const salesByCategory = useMemo(() => {
    const catMap = {
      'Selecciones Nacionales': { count: 0, revenue: 0 },
      'Clubes Chilenos': { count: 0, revenue: 0 },
      'Otras Categorías': { count: 0, revenue: 0 }
    }

    filteredOrders.forEach(ord => {
      (ord.items || []).forEach(item => {
        const prod = products.find(p => p.id === item.id || p.titulo === item.titulo)
        const cat = prod?.categoria || 'Otras Categorías'
        const qty = Number(item.cantidad) || 1
        const lineTotal = qty * (Number(item.precio) || prod?.precio || 0)

        if (!catMap[cat]) {
          catMap[cat] = { count: 0, revenue: 0 }
        }
        catMap[cat].count += qty
        catMap[cat].revenue += lineTotal
      })
    })

    return Object.entries(catMap)
      .map(([name, data]) => ({
        categoria: name,
        unidades: data.count,
        ingresos: data.revenue,
        porcentaje: totalRevenue > 0 ? Math.round((data.revenue / totalRevenue) * 100) : 0
      }))
      .sort((a, b) => b.ingresos - a.ingresos)
  }, [filteredOrders, products, totalRevenue])

  // 4. Clientes más destacados
  const topCustomers = useMemo(() => {
    const customerMap = {}

    filteredOrders.forEach(ord => {
      const run = String(ord.userRun || 'anonimo')
      if (!customerMap[run]) {
        const user = users.find(u => String(u.run) === run)
        customerMap[run] = {
          run,
          nombre: ord.customerName || (user ? `${user.nombre} ${user.apellidos}` : 'Cliente Registrado'),
          ordenes: 0,
          totalGastado: 0,
          region: user?.region || 'Chile'
        }
      }
      customerMap[run].ordenes += 1
      customerMap[run].totalGastado += Number(ord.total) || 0
    })

    return Object.values(customerMap).sort((a, b) => b.totalGastado - a.totalGastado).slice(0, 5)
  }, [filteredOrders, users])

  return (
    <div>
      {/* Barra Superior con Selector de Período y Botón Imprimir (Visual) */}
      <div className="is-flex is-justify-content-space-between is-align-items-center mb-5 is-flex-wrap-wrap gap-2">
        <div>
          <h2 className="title is-3 mb-1 has-text-weight-bold">
            Panel de Reportes y Estadísticas
          </h2>
          <p className="subtitle is-6 has-text-grey mb-0">
            Métricas de rendimiento de ventas, facturación y productos más populares en tiempo real.
          </p>
        </div>

        <div className="buttons">
          <div className="select is-small mr-2">
            <select
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
              id="report-period-select"
            >
              <option value="ALL">Todo el Historial</option>
              <option value="MARZO">Marzo 2026</option>
              <option value="RECENT">Últimas 10 Transacciones</option>
            </select>
          </div>
          <Button
            variant="primary"
            size="small"
            id="btn-print-report"
          >
            Exportar / Imprimir Reporte
          </Button>
        </div>
      </div>

      {/* Alerta Visual de Stock Crítico */}
      {criticalProducts.length > 0 && (
        <div className="box mb-5 has-background-warning-light border-warning-light rounded-12">
          <p className="has-text-warning-dark mb-3">
            <strong>Alerta de Inventario:</strong> Existen <strong>{criticalProducts.length}</strong> modelos con stock crítico o bajo. Puedes gestionarlos en la sección de Productos.
          </p>
          <div className="table-container mb-0">
            <table className="table is-fullwidth is-narrow has-background-white is-bordered rounded-6">
              <thead>
                <tr>
                  <th>Producto (Stock Crítico)</th>
                  <th className="has-text-centered table-col-120">Stock Actual</th>
                  <th className="has-text-centered table-col-120">Límite Crítico</th>
                </tr>
              </thead>
              <tbody>
                {criticalProducts.map(p => (
                  <tr key={p.id}>
                    <td><strong>{p.titulo}</strong></td>
                    <td className="has-text-centered has-text-danger has-text-weight-bold">{p.stock}</td>
                    <td className="has-text-centered has-text-grey">{p.stockCritico || 5}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Grid de 4 KPIs Principales */}
      <div className="columns is-multiline mb-5" id="reports-kpi-grid">
        <div className="column is-3-desktop is-6-tablet">
          <MetricCard
            title="Ventas Totales"
            value={`$${totalRevenue.toLocaleString('es-CL')}`}
            subtitle="Ingresos brutos acumulados"
            variant="primary"
            trend="+18.4% vs mes ant."
          />
        </div>

        <div className="column is-3-desktop is-6-tablet">
          <MetricCard
            title="Órdenes Registradas"
            value={totalOrdersCount}
            subtitle="Compras procesadas con éxito"
            variant="info"
            trend="100% efectividad"
          />
        </div>

        <div className="column is-3-desktop is-6-tablet">
          <MetricCard
            title="Ticket Promedio"
            value={`$${averageTicket.toLocaleString('es-CL')}`}
            subtitle="Gasto medio por pedido"
            variant="warning"
            trend="CLP por orden"
          />
        </div>

        <div className="column is-3-desktop is-6-tablet">
          <MetricCard
            title="Prendas Vendidas"
            value={totalUnitsSold}
            subtitle={`${uniqueCustomersCount} clientes activos`}
            variant="danger"
            trend="Envíos a todo Chile"
          />
        </div>
      </div>

      {/* Sección 2: Ranking de Productos Más Vendidos */}
      <div className="columns mb-5">
        <div className="column is-8">
          <div className="box p-5 h-100 rounded-12">
            <div className="is-flex is-justify-content-space-between is-align-items-center mb-4">
              <div>
                <h3 className="title is-5 mb-1 has-text-weight-bold">
                  Productos Más Vendidos (Ranking Oficial)
                </h3>
                <p className="subtitle is-7 has-text-grey mb-0">
                  Modelos con mayor volumen de salida y recaudación generada
                </p>
              </div>
              <span className="tag is-primary is-light has-text-weight-semibold">
                {topSellingProducts.length} Modelos en Demanda
              </span>
            </div>

            <div className="table-container">
              <table className="table is-fullwidth is-striped is-hoverable is-vcentered table-reports-ranking">
                <thead>
                  <tr className="has-background-light">
                    <th className="table-col-40">Rank</th>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th className="has-text-centered">Unidades</th>
                    <th className="table-col-180">Volumen Relativo</th>
                    <th className="has-text-right">Recaudación</th>
                  </tr>
                </thead>
                <tbody>
                  {topSellingProducts.map((p, index) => {
                    const badgeMedal = index === 0 ? '#1' : index === 1 ? '#2' : index === 2 ? '#3' : `#${index + 1}`
                    return (
                      <tr key={p.id || index}>
                        <td className="has-text-weight-bold is-size-6">{badgeMedal}</td>
                        <td>
                          <div className="is-flex is-align-items-center">
                            <img
                              src={p.img}
                              alt={p.titulo}
                              className="thumb-38 mr-2"
                              onError={(e) => { e.target.src = '/assets/images/brasil/brasil1.jpeg' }}
                            />
                            <strong>{p.titulo}</strong>
                          </div>
                        </td>
                        <td>
                          <span className="tag is-light is-size-7">{p.categoria}</span>
                        </td>
                        <td className="has-text-centered">
                          <span className="tag is-info is-light has-text-weight-bold">
                            {p.unidades} unid.
                          </span>
                        </td>
                        <td>
                          <div className="is-flex is-align-items-center">
                            <progress
                              className="progress is-primary is-small mb-0 mr-2 progress-h-8"
                              value={p.percentage}
                              max="100"
                            ></progress>
                            <span className="is-size-7 has-text-grey">{p.percentage}%</span>
                          </div>
                        </td>
                        <td className="has-text-right has-text-weight-bold has-text-primary">
                          ${p.ingresos.toLocaleString('es-CL')}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sección 3: Ventas por Categoría */}
        <div className="column is-4">
          <div className="box p-5 h-100 rounded-12">
            <h3 className="title is-5 mb-1 has-text-weight-bold">
              Distribución por Categoría
            </h3>
            <p className="subtitle is-7 has-text-grey mb-4">
              Porcentaje de recaudación según el tipo de camiseta
            </p>

            <div className="mb-4">
              {salesByCategory.map((cat, idx) => {
                const colorClass = idx === 0 ? 'is-primary' : idx === 1 ? 'is-info' : 'is-warning'
                return (
                  <div key={cat.categoria} className="mb-4 p-3 has-background-white-bis rounded-8">
                    <div className="is-flex is-justify-content-space-between mb-1">
                      <span className="has-text-weight-semibold is-size-7">{cat.categoria}</span>
                      <span className="has-text-weight-bold is-size-7">{cat.porcentaje}%</span>
                    </div>
                    <progress
                      className={`progress ${colorClass} is-small mb-2 progress-h-7`}
                      value={cat.porcentaje}
                      max="100"
                    ></progress>
                    <div className="is-flex is-justify-content-space-between is-size-7 has-text-grey">
                      <span>{cat.unidades} prendas vendidas</span>
                      <span className="has-text-weight-bold has-text-dark">
                        ${cat.ingresos.toLocaleString('es-CL')}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="notification is-primary is-light p-3 is-size-7">
              <p className="has-text-weight-bold mb-1">Conclusión Comercial:</p>
              <p className="mb-0">
                Las camisetas de selecciones internacionales lideran la demanda gracias a los torneos de este año, seguidas por los clubes nacionales de primera división.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sección 4: Top Clientes de Mayor Facturación */}
      <div className="box p-5 rounded-12">
        <h3 className="title is-5 mb-1 has-text-weight-bold">
          Top Clientes con Mayor Fidelidad y Compra
        </h3>
        <p className="subtitle is-7 has-text-grey mb-4">
          Usuarios con mayor volumen acumulado de órdenes en la tienda online
        </p>

        <div className="columns is-multiline">
          {topCustomers.map((cust, idx) => (
            <div key={cust.run} className="column is-4-desktop is-6-tablet">
              <div className="box p-4 has-background-light mb-0 border-slate-light rounded-8">
                <div className="is-flex is-align-items-center mb-2">
                  <span className="tag is-rounded is-dark mr-2">#{idx + 1}</span>
                  <div>
                    <p className="has-text-weight-bold is-size-6 mb-0">{cust.nombre}</p>
                    <p className="is-size-7 has-text-grey mb-0">RUN: <code>{cust.run}</code></p>
                  </div>
                </div>
                <div className="is-flex is-justify-content-space-between is-size-7 pt-2 border-t-divider">
                  <span>{cust.ordenes} compras realizadas</span>
                  <strong className="has-text-primary is-size-6">
                    ${cust.totalGastado.toLocaleString('es-CL')}
                  </strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ReportsPanel