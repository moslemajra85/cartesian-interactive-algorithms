import { traversalIds, type LinkedNode } from './linkedInsertion'

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

  return (
    <div className="linked-stage" role="img" aria-label={`Reachable list: ${chainIds.map((id) => nodesById.get(id)?.value).join(', ')}. ${detachedNodes.length} detached nodes.`}>
      <span className="linked-head">HEAD</span>
      <div className="linked-chain">
        {chainIds.map((id, index) => {
          const node = nodesById.get(id)!
          return (
            <div className="linked-node-group" key={id}>
              <article className={nodeClass(id)}><span>{node.value}</span><small>NEXT</small><code>{node.nextId ?? 'null'}</code></article>
              {index < chainIds.length - 1 && <b aria-hidden="true">→</b>}
            </div>
          )
        })}
        <b aria-hidden="true">→ null</b>
      </div>
      {detachedNodes.length > 0 && (
        <div className="detached-nodes">
          <span>NOT REACHABLE FROM HEAD</span>
          {detachedNodes.map((node) => <article className={nodeClass(node.id)} key={node.id}><span>{node.value}</span><small>NEXT</small><code>{node.nextId ?? 'null'}</code></article>)}
        </div>
      )}
    </div>
  )
}
