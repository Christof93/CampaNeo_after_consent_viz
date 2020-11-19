```
Consent_Sensor:hasPurpose
  rdfs:range untitled-ontology-21:Campaign
```

unneeded?

---

```
untitled-ontology-21:isRequestedBy
  rdfs:range untitled-ontology-21:Data
```

instead of

```
untitled-ontology-21:isRequestedBy
  rdfs:domain untitled-ontology-21:Data
```

---

```
untitled-ontology-21:hasStartDate
  rdfs:domain untitled-ontology-21:Start
  rdfs:range untitled-ontology-21:Campaign
```

instead of

```
untitled-ontology-21:hasStartDate
  rdfs:domain untitled-ontology-21:Campaign
  rdfs:range untitled-ontology-21:Start
```

---

```
untitled-ontology-21:hasEndDate
  rdfs:domain untitled-ontology-21:End
  rdfs:range untitled-ontology-21:Campaign
```

instead of

```
untitled-ontology-21:hasEndDate
  rdfs:domain untitled-ontology-21:Campaign
  rdfs:range untitled-ontology-21:End
```

---

```
untitled-ontology-21:hasDuration
  rdfs:domain untitled-ontology-21:Duration
  rdfs:range untitled-ontology-21:Campaign
```

instead of

```
untitled-ontology-21:hasDuration
  rdfs:domain untitled-ontology-21:Campaign
  rdfs:range untitled-ontology-21:Duration
```

---

```
untitled-ontology-21:belongsToArea
 rdfs:domain untitled-ontology-21:Area
 rdfs:range untitled-ontology-21:Organization
```

instead of

```
untitled-ontology-21:belongsToArea
 rdfs:range untitled-ontology-21:Area
 rdfs:domain untitled-ontology-21:Organization
```

---

```
untitled-ontology-21:hasConsent
 rdfs:range untitled-ontology-21:Campaign
 rdfs:range untitled-ontology-21:Consent
```

instead of

```
untitled-ontology-21:hasConsent
 rdfs:domain untitled-ontology-21:Campaign
 rdfs:range untitled-ontology-21:Consent
```

---

```
Consent_Sensor:hasEmail>
  rdfs:range untitled-ontology-21:User
```

instead of

```
Consent_Sensor:hasEmail>
  rdfs:domain untitled-ontology-21:User
```

---

```
untitled-ontology-21:hasCapacity>
  rdfs:domain untitled-ontology-21:Capacity
```

instead of

```
untitled-ontology-21:hasCapacity>
  rdfs:range untitled-ontology-21:Capacity
```
