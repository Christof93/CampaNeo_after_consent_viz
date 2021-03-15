
const DB_URL = 'https://smashhitactool.sti2.at/repositories/CampaNeoKG'
const dataQuery = `
  PREFIX : <http://www.semanticweb.org/ontologies/CampaNeo#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  select ?campaign_name ?datatype ?retrievaltime ?institution_name where {
    ?campaignnode a :Campaign .
      ?campaignnode :hasConsentBy :user1 .
      ?campaignnode rdfs:label ?campaign_name .
      ?data :wasRetrievedByCampaign ?campaignnode .
      ?data :hasDataType ?datatype .
      ?data :wasRetrievedAtTime ?retrievaltime .
      ?data :isRequestedBy ?institution .
      ?institution rdfs:label ?institution_name .
  }
`

export async function getData() {
  return fetch(`${DB_URL}?query=${encodeURIComponent(dataQuery)}`)
}

