import { AnimatePresence, LayoutGroup, LazyMotion, MotionConfig } from 'motion/react'
import * as m from 'motion/react-m'
import { traversalIds, type LinkedNode } from './linkedInsertion'

const loadMotionFeatures = () => import('./motionFeatures').then((module) => module.default)

type LinkedListVisualizerProps = {
  nodes: LinkedNode[]
  headId: string
  activeIds: string[]
  emphasizedIds?: string[]
}

export function LinkedListVisualizer({ nodes, headId, activeIds, emphasizedIds = [] }: LinkedListVisualizerProps) {
  const chainIds = traversalIds({ nodes, headId })
  const nodesById = new Map(nodes.map((node) => [node.id, node]))
  const detachedNodes = nodes.filter((node) => !chainIds.includes(node.id))
  const nodeClass = (id: string) => [activeIds.includes(id) && 'is-active', emphasizedIds.includes(id) && 'is-new'].filter(Boolean).join(' ')

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
      <span>{node.value}</span><small>NEXT</small><code>{node.nextId ?? 'null'}</code>
    </m.article>
  )

  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <MotionConfig reducedMotion="user">
        <LayoutGroup id="linked-list-layout">
        <div className="linked-stage" role="img" aria-label={`Reachable list: ${chainIds.map((id) => nodesById.get(id)?.value).join(', ')}. ${detachedNodes.length} detached nodes.`}>
          <m.span className="linked-head" layout>HEAD</m.span>
          <m.div className="linked-chain" layout>
            <AnimatePresence initial={false} mode="popLayout">
              {chainIds.map((id, index) => {
                const node = nodesById.get(id)!
                const nextId = chainIds[index + 1]
                const pointerActive = activeIds.includes(id) && Boolean(nextId && activeIds.includes(nextId))
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
            <m.b className="linked-pointer is-null" layout aria-hidden="true">→ null</m.b>
          </m.div>
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
