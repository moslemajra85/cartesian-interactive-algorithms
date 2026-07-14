export type LookupTradeoff = { queries: number; scanWork: number; indexWork: number; scanExtraSpace: number; indexExtraSpace: number; recommendation: 'scan' | 'index' }

export function compareLookupStrategies(queries: number, recordCount = 10): LookupTradeoff {
  if (!Number.isInteger(queries) || queries < 1 || !Number.isInteger(recordCount) || recordCount < 1) throw new RangeError('Queries and records must be positive whole numbers.')
  const scanWork = queries * recordCount
  const indexWork = recordCount + queries
  return { queries, scanWork, indexWork, scanExtraSpace: 1, indexExtraSpace: recordCount, recommendation: scanWork <= indexWork ? 'scan' : 'index' }
}

export function createLookupTradeoffSteps(maxQueries = 12, recordCount = 10) {
  if (!Number.isInteger(maxQueries) || maxQueries < 2 || maxQueries > 20) throw new RangeError('Maximum queries must be a whole number from 2 to 20.')
  return Array.from({ length: maxQueries }, (_, index) => {
    const comparison = compareLookupStrategies(index + 1, recordCount)
    return { ...comparison, title: `${comparison.queries} ${comparison.queries === 1 ? 'lookup' : 'lookups'} against ${recordCount} records`, explanation: comparison.recommendation === 'scan' ? `For one lookup, scanning costs ${comparison.scanWork} work units and avoids the index’s ${comparison.indexExtraSpace} cells.` : `Repeated scans now cost ${comparison.scanWork} units. Building once and querying the index costs ${comparison.indexWork}, trading ${comparison.indexExtraSpace} memory cells for less total work.` }
  })
}
