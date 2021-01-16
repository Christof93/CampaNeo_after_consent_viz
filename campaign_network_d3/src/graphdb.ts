import { newEngine, IQueryResultBindings } from '@comunica/actor-init-sparql'

import { DB_URL, DB_AUTH } from './credentials'

const sparql = newEngine()

const userQuery: string = `
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX consent: <http://www.semanticweb.org/aneliakurteva/ontologies/2020/4/untitled-ontology-21#>
  PREFIX consent_sensor: <http://www.semanticweb.org/aneliakurteva/ontologies/2020/4/Consent_Sensor#>

  select ?u ?c where {
      ?u rdf:type consent:User ;
        consent_sensor:ParticipatesIn ?c .
  } limit 100
`

const campaignQuery: string = `
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX consent: <http://www.semanticweb.org/aneliakurteva/ontologies/2020/4/untitled-ontology-21#>
  PREFIX consent_sensor: <http://www.semanticweb.org/aneliakurteva/ontologies/2020/4/Consent_Sensor#>

  select ?c ?d ?cons ?u where {
      ?c rdf:type consent_sensor:Name .
      OPTIONAL {
        ?c consent:RequiresData ?d .
          ?c consent:hasConsent ?cons .
          ?c consent:isProvidedBy ?u .
      }
  } limit 100
`

async function sendQuery(query: string) {
  // npx comunica-sparql https://username:password@graphdb.sti2.at/repositories/ConsentKG/statements 'CONSTRUCT WHERE { ?s ?p ?o }'

  return await sparql.query(userQuery, {
    sources: [DB_URL],
    httpAuth: DB_AUTH,
  }) as IQueryResultBindings
}

export async function getUsers() {
  const result = await sendQuery(userQuery)
  const bindings = await result.bindings()
  const users = bindings.map(data => data.get('?u').value)

  console.log(JSON.stringify(users, null, 2))
}

export async function getCampaigns() {
  const result = await sendQuery(campaignQuery)
  const bindings = await result.bindings()
  const campaigns = bindings.map(data => data.get('?c').value)

  console.log(JSON.stringify(campaigns, null, 2))
}
