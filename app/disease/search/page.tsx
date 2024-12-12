import SearchPage from '@/app/components/search/search-page'

export default function DiseaseSearch() {
  return <SearchPage entityName="Disease" searchEndpoint="/search/diseases"/>
}

