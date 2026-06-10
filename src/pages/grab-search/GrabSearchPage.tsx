import { useEffect, useRef, useState } from 'react'
import { GrabSearchForm } from './components/GrabSearchForm'
import { GrabSearchResult } from './components/GrabSearchResult'
import { grabRecords, type GrabRecord } from './mock-data'
import { applySearch, type GrabSearchCriteria } from './grab-search'

type SearchStatus = 'idle' | 'loading' | 'done'

// UI affordance only — there is no API call (spec §5).
const SEARCH_DELAY_MS = 400

export function GrabSearchPage() {
  const [status, setStatus] = useState<SearchStatus>('idle')
  const [results, setResults] = useState<GrabRecord[]>([])
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const handleSearch = (criteria: GrabSearchCriteria) => {
    setStatus('loading')
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setResults(applySearch(grabRecords, criteria))
      setStatus('done')
    }, SEARCH_DELAY_MS)
  }

  return (
    <div className="flex flex-col gap-4">
      <GrabSearchForm loading={status === 'loading'} onSearch={handleSearch} />
      {status === 'done' && <GrabSearchResult records={results} />}
    </div>
  )
}
