import SearchPage from '@/app/components/search/search-page'

export default function PatientSearch() {
  return <SearchPage entityName="Patient" searchEndpoint="/search/patients" />
}

