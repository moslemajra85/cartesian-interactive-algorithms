export type LinkedNode = { id: string; value: number; nextId: string | null }
export type LinkedPointerEdge = { fromId: string; toId: string | null }

export function createLinkedNodes(values: number[]): LinkedNode[] {
  return values.map((value, index) => ({
    id: `node-${index}`,
    value,
    nextId: index === values.length - 1 ? null : `node-${index + 1}`,
  }))
}

export function snapshotLinkedNodes(nodes: LinkedNode[]): LinkedNode[] {
  return nodes.map((node) => ({ ...node }))
}

export function traversalIds(structure: { nodes: LinkedNode[]; headId: string | null }): string[] {
  const byId = new Map(structure.nodes.map((node) => [node.id, node]))
  const visited = new Set<string>()
  const ids: string[] = []
  let currentId = structure.headId

  while (currentId && !visited.has(currentId)) {
    const node = byId.get(currentId)
    if (!node) break
    visited.add(currentId)
    ids.push(currentId)
    currentId = node.nextId
  }

  return ids
}
