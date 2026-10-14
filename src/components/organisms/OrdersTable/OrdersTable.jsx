import { useState, useMemo } from 'react'
import { Button } from '../../atoms/Button/Button.jsx'
import { Input } from '../../atoms/Input/Input.jsx'

export function OrdersTable({
  orders = [],
  onViewReceipt,
  selectedUserFilter = null,
  onClearUserFilter
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [sortOrder, setSortOrder] = useState('desc') // 'desc' (más reciente) o 'asc'

  // Filtrado y ordenamiento de órdenes
  const filteredOrders = useMemo(() => {
    return orders
      .filter(ord => {
        // Filtro por usuario específico (si viene desde la vista de Usuarios)
        if (selectedUserFilter && String(ord.userRun) !== String(selectedUserFilter.run)) {
          return false
        }

        // Filtro por estado
        if (statusFilter !== 'ALL' && (ord.estado || 'Completado') !== statusFilter) {
          return false
        }

        // Búsqueda por término libre (id, customerName, userRun)
        if (!searchTerm.trim()) return true
        const term = searchTerm.toLowerCase()
        const idMatch = ord.id?.toLowerCase().includes(term)
        const nameMatch = ord.customerName?.toLowerCase().includes(term)
        const runMatch = String(ord.userRun || '').toLowerCase().includes(term)
        const itemMatch = ord.items?.some(it => it.titulo?.toLowerCase().includes(term))

        return idMatch || nameMatch || runMatch || itemMatch
      })
      .sort((a, b) => {
        const dateA = new Date(a.fecha || 0).getTime()
        const dateB = new Date(b.fecha || 0).getTime()
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB
      })
  }, [orders, selectedUserFilter, statusFilter, searchTerm, sortOrder])

  // Métricas rápidas de la selección
  const totalAmountFiltered = filteredOrders.reduce((acc, o) => acc + (Number(o.total) || 0), 0)
  const totalItemsSold = filteredOrders.reduce(
    (acc, o) => acc + (o.items?.reduce((s, it) => s + (Number(it.cantidad) || 1), 0) || 0),
    0
  )

  const getStatusBadge = (estado = 'Completado') => {
    switch (estado) {
      case 'Entregado':
      case 'Completado':
        return <span className="tag is-success is-light has-text-weight-semibold">✓ {estado}</span>
      case 'En Despacho':
      case 'Enviado':
        return <span className="tag is-info is-light has-text-weight-semibold">🚚 {estado}</span>
      case 'Pendiente':
      case 'En Preparación':
        return <span className="tag is-warning is-light has-text-weight-semibold">⏳ {estado}</span>
      default:
        return <span className="tag is-light">{estado}</span>
    }
  }

  return (
    <div className="box p-5" style={{ borderRadius: '12px' }}>
      {/* Encabezado y Filtro por Usuario Activo */}
      <div className="is-flex is-justify-content-space-between is-align-items-center mb-4 is-flex-wrap-wrap gap-2">
        <div>
          <h2 className="title is-4 mb-1 has-text-weight-bold">
            {selectedUserFilter
              ? `Historial de Compras: ${selectedUserFilter.nombre} ${selectedUserFilter.apellidos}`
              : 'Historial General de Órdenes y Compras'}
          </h2>
          <p className="subtitle is-6 has-text-grey mb-0">
            {selectedUserFilter
              ? `Filtrando compras exclusivas del RUN: ${selectedUserFilter.run}`
              : 'Listado completo de ventas registradas en la tienda.'}
          </p>
        </div>

        {selectedUserFilter && (
          <Button
            variant="warning"
            size="small"
            onClick={onClearUserFilter}
            id="btn-clear-user-filter"
          >
            ← Mostrar Todas las Órdenes
          </Button>
        )}
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="columns is-multiline mb-4">
        <div className="column is-5">
          <div className="field">
            <label className="label is-size-7 mb-1">Buscar por N° Orden, Cliente o RUN</label>
            <div className="control has-icons-left">
              <Input
                placeholder="Ej: ORD-202401, Cliente A, 444444444..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                id="search-orders-input"
              />
              <span className="icon is-small is-left">🔍</span>
            </div>
          </div>
        </div>

        <div className="column is-3">
          <div className="field">
            <label className="label is-size-7 mb-1">Filtrar por Estado</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  id="filter-status-select"
                >
                  <option value="ALL">Todos los Estados</option>
                  <option value="Entregado">Entregado</option>
                  <option value="Completado">Completado</option>
                  <option value="Enviado">Enviado</option>
                  <option value="Pendiente">Pendiente</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="column is-4">
          <div className="field">
            <label className="label is-size-7 mb-1">Ordenar Cronológicamente</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  id="sort-orders-select"
                >
                  <option value="desc">Más Recientes Primero</option>
                  <option value="asc">Más Antiguas Primero</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resumen de Resultados */}
      <div className="tags are-medium mb-4">
        <span className="tag is-info is-light">
          <strong>{filteredOrders.length}</strong> &nbsp;órdenes encontradas
        </span>
        <span className="tag is-success is-light">
          Monto total:&nbsp;<strong>${totalAmountFiltered.toLocaleString('es-CL')}</strong>
        </span>
        <span className="tag is-primary is-light">
          Prendas vendidas:&nbsp;<strong>{totalItemsSold}</strong>
        </span>
      </div>

      {/* Tabla de Órdenes */}
      {filteredOrders.length === 0 ? (
        <div className="notification is-light has-text-centered py-6">
          <p className="is-size-3 mb-2">📦</p>
          <p className="is-size-5 has-text-weight-bold mb-1">No se encontraron órdenes</p>
          <p className="is-size-6 has-text-grey mb-4">
            No hay registros que coincidan con los criterios de búsqueda aplicados.
          </p>
          {(searchTerm || statusFilter !== 'ALL' || selectedUserFilter) && (
            <Button
              variant="primary"
              size="small"
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('ALL')
                if (onClearUserFilter) onClearUserFilter()
              }}
            >
              Restablecer Filtros
            </Button>
          )}
        </div>
      ) : (
        <div className="table-container">
          <table className="table is-fullwidth is-striped is-hoverable is-vcentered" id="admin-orders-table">
            <thead>
              <tr className="has-background-light">
                <th>N° Orden</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>RUN</th>
                <th>Prendas</th>
                <th className="has-text-right">Total</th>
                <th className="has-text-centered">Estado</th>
                <th className="has-text-centered">Boleta</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(ord => {
                const itemsCount = ord.items?.reduce((s, it) => s + (Number(it.cantidad) || 1), 0) || 0
                return (
                  <tr key={ord.id}>
                    <td>
                      <span className="tag is-dark has-text-weight-bold" style={{ letterSpacing: '0.5px' }}>
                        {ord.id}
                      </span>
                    </td>
                    <td className="is-size-7">{ord.fecha}</td>
                    <td>
                      <span className="has-text-weight-semibold">{ord.customerName}</span>
                    </td>
                    <td>
                      <code>{ord.userRun || 'N/A'}</code>
                    </td>
                    <td>
                      <span className="tag is-rounded is-light">
                        {itemsCount} {itemsCount === 1 ? 'prenda' : 'prendas'}
                      </span>
                    </td>
                    <td className="has-text-right has-text-weight-bold has-text-primary">
                      ${Number(ord.total).toLocaleString('es-CL')}
                    </td>
                    <td className="has-text-centered">
                      {getStatusBadge(ord.estado)}
                    </td>
                    <td className="has-text-centered">
                      <Button
                        variant="primary"
                        size="small"
                        onClick={() => onViewReceipt(ord)}
                        className="is-outlined"
                        id={`btn-view-receipt-${ord.id}`}
                      >
                        <span className="mr-1">🧾</span> Ver Boleta
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
