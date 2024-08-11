# integration-techassignment

Added PATCH method requsted to the simple API project.
GET and POST methods are altered for scalability.
"response-schema.json" was altered because it wasn't matching with the actual response and it had duplicate fields.

## Initiate

```sh
npm start
```

## Test

```sh
npm test
```

## Usage

- GET request can be sent with or without ID.
- POST request sends everything in the payload.
- PATCH can be done with or without specifying ID. If not specified, then it will read the ID in the payload. If another ID is entered, it will throw an error.
- Considering there is no other ID in the payload, above method closes the gaps.

### GET

```sh
Invoke-RestMethod -Uri "http://localhost:5000/ServiceNow" -Method GET -Headers @{ "Content-Type" = "application/json" } -ContentType "application/json"
```

```sh
Invoke-RestMethod -Uri "http://localhost:5000/ServiceNow/b4fd7c8437201000deeabfc8bcbe5dc1" -Method GET -Headers @{ "Content-Type" = "application/json" } -ContentType "application/json"
```

### POST

```sh
Invoke-RestMethod -Uri "http://localhost:5000/ServiceNow" -Method POST -Headers @{ "Content-Type" = "application/json" } -ContentType "application/json"
```

### PATCH

```sh
Invoke-RestMethod -Uri "http://localhost:5000/ServiceNow/" -Method PATCH -Headers @{ "Content-Type" = "application/json" } -ContentType "application/json"
```

```sh
Invoke-RestMethod -Uri "http://localhost:5000/ServiceNow/b4fd7c8437201000deeabfc8bcbe5dc1" -Method PATCH -Headers @{ "Content-Type" = "application/json" } -ContentType "application/json"
```
