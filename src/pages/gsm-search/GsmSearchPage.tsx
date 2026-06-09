import { useState } from 'react'
import { GsmSearchForm } from './components/GsmSearchForm'
import { GsmSearchResult } from './components/GsmSearchResult'
import { gsmRecords, type GsmRecord } from './mock-data'
import { applySearch, type GsmSearchCriteria } from './gsm-search'

type SearchStatus = 'idle' | 'loading' | 'done'

// UI affordance only — there is no API call (spec §5).
const SEARCH_DELAY_MS = 400

export function GsmSearchPage() {
  const [status, setStatus] = useState<SearchStatus>('idle')
  const [results, setResults] = useState<GsmRecord[]>([])

  const handleSearch = (criteria: GsmSearchCriteria) => {
    setStatus('loading')
    setTimeout(() => {
      setResults(applySearch(gsmRecords, criteria))
      setStatus('done')
    }, SEARCH_DELAY_MS)
  }

  return (
    <div className="flex flex-col gap-4">
      <GsmSearchForm loading={status === 'loading'} onSearch={handleSearch} />
      {status === 'done' && <GsmSearchResult records={results} />}
    </div>
  )
}
