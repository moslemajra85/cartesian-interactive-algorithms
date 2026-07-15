import type { LinkedNode, LinkedPointerMovement } from '../model/linkedList'

export function PointerMovementStrip({ movements, nodes }: { movements: LinkedPointerMovement[]; nodes: LinkedNode[] }) {
  if (movements.length === 0) return null
  const valueFor = (id: string | null) => id ? nodes.find((node) => node.id === id)?.value ?? '—' : 'null'

  return <div className="cycle-movements" aria-label={movements.map((movement) => `${movement.pointerId} moved ${movement.hops} hops`).join('. ')}>{movements.map((movement) => <span key={movement.pointerId}><b>{movement.pointerId}</b><i>{movement.hops} {movement.hops === 1 ? 'hop' : 'hops'}</i><strong>{valueFor(movement.toId)}</strong></span>)}</div>
}
