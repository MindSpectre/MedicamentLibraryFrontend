import SearchPage from '@/app/components/search/search-page'

export default function OrganizationSearch() {
  return <SearchPage entityName="Organization" searchEndpoint="/search/organizations" />
}

