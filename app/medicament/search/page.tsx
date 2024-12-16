'use client'
export const dynamic = 'force-dynamic';

import SearchPage from '@/app/components/search/search-page'

export default function MedicamentSearch() {
  return <SearchPage entityName="Medicament" searchEndpoint="/search/medicament" />
}

