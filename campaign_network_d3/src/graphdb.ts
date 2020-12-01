import { newEngine, IQueryResultBindings } from '@comunica/actor-init-sparql'

import { DB_URL, DB_AUTH } from './credentials'

const sparql = newEngine()

export async function getCampaigns() {
  // npx comunica-sparql https://username:password@graphdb.sti2.at/repositories/ConsentKG/statements 'CONSTRUCT WHERE { ?s ?p ?o }'

  const result = await sparql.query(`
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX consent: <http://www.semanticweb.org/aneliakurteva/ontologies/2020/4/untitled-ontology-21#>

    select * where {
      ?s rdf:type consent:Campaign .
    } limit 100
    `, {
    sources: [DB_URL],
    httpAuth: DB_AUTH,
  }) as IQueryResultBindings

  const bindings = await result.bindings()

  const campaigns = bindings.map(data => data.get('?s').value)

  console.log(JSON.stringify(campaigns, null, 2))
}
