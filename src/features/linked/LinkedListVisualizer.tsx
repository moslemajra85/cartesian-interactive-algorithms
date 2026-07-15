import { AnimatePresence, LayoutGroup, LazyMotion, MotionConfig } from 'motion/react'
import * as m from 'motion/react-m'
import { traversalIds, type LinkedNode, type LinkedPointerEdge } from './linkedInsertion'

const loadMotionFeatures = () => import('./motionFeatures').then((module) => module.default)

export type LinkedVariablePointer = {
  id: string
  label: string
  nodeId: string | null
  tone?: 'current' | 'found' | 'reference' | 'new' | 'danger'
}

type LinkedListVisualizerProps = {
  nodes: LinkedNode[]
  headId: string | null
  activeIds: string[]
  headLabel?: string
  emphasizedIds?: string[]
  pointers?: LinkedVariablePointer[]
  visitedIds?: string[]
  followedEdge?: LinkedPointerEdge | null
  edgeAction?: 'follow' | 'write'
  foundId?: string | null
}

export function LinkedListVisualizer({
  nodes,
  headId,
  activeIds,
  headLabel = 'HEAD',
  emphasizedIds = [],
  pointers = [],
  visitedIds = [],
  followedEdge,
  edgeAction = 'follow',
  foundId = null,
}: LinkedListVisualizerProps) {
  const chainIds = traversalIds({ nodes, headId })
  const nodesById = new Map(nodes.map((node) => [node.id, node]))
  const detachedNodes = nodes.filter((node) => !chainIds.includes(node.id))
  const nodeClass = (id: string) => [
    activeIds.includes(id) && 'is-active',
    emphasizedIds.includes(id) && 'is-new',
    followedEdge?.fromId === id && 'is-edge-source',
    visitedIds.includes(id) && 'is-visited',
    foundId === id && 'is-found',
  ].filter(Boolean).join(' ')
  const pointerDescription = pointers.map((pointer) => {
    const node = pointer.nodeId ? nodesById.get(pointer.nodeId) : null
    return `${pointer.label} ${node ? `points to ${node.value}` : 'is null'}`
  }).join('. ')
  const visitedValues = visitedIds.map((id) => nodesById.get(id)?.value).filter((value) => value !== undefined)
  const hasTraversalState = visitedIds.length > 0 || pointers.some((pointer) => pointer.id === 'current')
  const visitedDescription = hasTraversalState
    ? visitedValues.length ? `Visited values: ${visitedValues.join(', ')}. ` : 'No visited values. '
    : ''

  const renderVariablePointers = (nodeId: string | null) => {
    const assignedPointers = pointers.filter((pointer) => pointer.nodeId === nodeId)
    return assignedPointers.map((pointer, index) => (
    <m.span
      className={`linked-variable-pointer is-${pointer.tone ?? 'current'}`}
      data-pointer-node={pointer.nodeId ?? 'null'}
      data-variable-pointer={pointer.id}
      key={pointer.id}
      layoutId={`linked-variable-${pointer.id}`}
      style={{ x: `calc(-50% + ${(index - (assignedPointers.length - 1) / 2) * 64}px)` }}
      transition={{ type: 'spring', stiffness: 420, damping: 31 }}
    >
      <b>{pointer.label}</b><i aria-hidden="true">↓</i>
    </m.span>
    ))
  }

  const renderNode = (node: LinkedNode, reachability: 'reachable' | 'detached') => (
    <m.article
      className={nodeClass(node.id)}
      data-node-id={node.id}
      data-reachability={reachability}
      layout
      layoutId={`linked-node-${node.id}`}
      initial={{ opacity: 0, scale: 0.82, y: -12 }}
      animate={{ opacity: 1, scale: 1, y: activeIds.includes(node.id) ? -7 : 0 }}
      exit={{ opacity: 0, scale: 0.72, y: 18 }}
      transition={{ type: 'spring', stiffness: 360, damping: 30 }}
    >
      {renderVariablePointers(node.id)}
      {visitedIds.includes(node.id) && foundId !== node.id && <i className="linked-node-state is-visited" aria-hidden="true">✓ VISITED</i>}
      {foundId === node.id && <i className="linked-node-state is-found" aria-hidden="true">FOUND</i>}
      <span>{node.value}</span><small>NEXT</small><code>{node.nextId ?? 'null'}</code>
    </m.article>
  )

  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <MotionConfig reducedMotion="user">
        <LayoutGroup id="linked-list-layout">
        <div
          className="linked-stage"
          role="img"
          aria-label={`Reachable list: ${chainIds.map((id) => nodesById.get(id)?.value).join(', ')}. ${pointerDescription ? `${pointerDescription}. ` : ''}${visitedDescription}${followedEdge ? `${edgeAction === 'write' ? 'Writing' : 'Following'} next from ${nodesById.get(followedEdge.fromId)?.value} to ${followedEdge.toId ? nodesById.get(followedEdge.toId)?.value : 'null'}. ` : ''}${detachedNodes.length} detached nodes.`}
        >
          <m.span className="linked-head" layout>{headLabel}</m.span>
          {pointers.length > 0 && (
            <div className="linked-state-legend" aria-hidden="true">
              <span><i className="legend-current" /> named pointer</span>
              {hasTraversalState && <span><i className="legend-visited" /> checked</span>}
              {hasTraversalState && <span><i className="legend-unseen" /> not checked</span>}
            </div>
          )}
          <m.div className="linked-chain" layout>
            <AnimatePresence initial={false} mode="popLayout">
              {chainIds.map((id, index) => {
                const node = nodesById.get(id)!
                const nextId = chainIds[index + 1]
                const pointerActive = followedEdge === undefined
                  ? activeIds.includes(id) && Boolean(nextId && activeIds.includes(nextId))
                  : followedEdge?.fromId === id && followedEdge.toId === nextId
                return (
                  <m.div className="linked-node-group" layout key={id}>
                    {renderNode(node, 'reachable')}
                    {nextId && (
                      <m.b
                        className={`linked-pointer ${pointerActive ? 'is-active' : ''}`}
                        data-pointer={`${id}->${nextId}`}
                        aria-hidden="true"
                        key={`${id}->${nextId}`}
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        exit={{ opacity: 0, scaleX: 0 }}
                      >→</m.b>
                    )}
                  </m.div>
                )
              })}
            </AnimatePresence>
            <m.span className="linked-null-target" layout>
              {renderVariablePointers(null)}
              <m.b
                className={`linked-pointer is-null ${followedEdge?.fromId === chainIds.at(-1) && followedEdge?.toId === null ? 'is-active' : ''}`}
                data-pointer={`${chainIds.at(-1)}->null`}
                aria-hidden="true"
              >→ null</m.b>
            </m.span>
          </m.div>
          <AnimatePresence initial={false}>
            {followedEdge && (
              <m.div
                className="linked-edge-operation"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
              >
                <small>{edgeAction === 'write' ? 'REFERENCE WRITE' : 'FOLLOW REFERENCE'}</small>
                <code>{nodesById.get(followedEdge.fromId)?.value}.next</code>
                <b>{edgeAction === 'write' ? '=' : '→'}</b>
                <strong>{followedEdge.toId ? nodesById.get(followedEdge.toId)?.value : 'null'}</strong>
              </m.div>
            )}
          </AnimatePresence>
          <AnimatePresence initial={false}>
            {detachedNodes.length > 0 && (
              <m.div className="detached-nodes" layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <span>NOT REACHABLE FROM HEAD</span>
                <AnimatePresence initial={false}>{detachedNodes.map((node) => <div key={node.id}>{renderNode(node, 'detached')}</div>)}</AnimatePresence>
              </m.div>
            )}
          </AnimatePresence>
        </div>
        </LayoutGroup>
      </MotionConfig>
    </LazyMotion>
  )
}
