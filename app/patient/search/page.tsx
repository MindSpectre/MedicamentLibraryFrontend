'use client'
export const dynamic = 'force-dynamic';

import SearchPage from '@/app/components/search/search-page'

export default function PatientSearch() {
  return <SearchPage entityName="Patient" searchEndpoint="/search/patient" />
}

