# ssdc-rm-response-operations

Social/Strategic Survey Data Collection Response Management Operations UI/API.

The user interface (backed by an API) which allows all operations required for response management
of surveys and collection exercises etc.

## Tech Stack
The API backend is built using Java and Spring Boot.

The UI frontend is built using ReactJS.

## How to Build and Run Locally

Build using `make build`

Run using ssdc-rm-docker-dev `make up`

Or, run in your IDEs: start the Java/Spring backend, then to start the NodeJS development UI,
run `make run-dev-ui`

## API Spec

### Surveys

The API endpoint `/api/surveys` offers some CRUD on surveys (currently no update).

You can POST a new survey with a body like this:

```json
{
  "surveyName": "Test survey"
}
```

You can GET all surveys from `/api/surveys` which will return a body like this:

```json
[
  {
    "id": "caa3856c-beae-4a66-bcc6-38afa656af4e",
    "surveyName": "Test survey one"
  },
  {
    "id": "4c6d537b-7245-42ac-9b15-806fa4c2cf36",
    "surveyName": "Test survey two"
  }
]
```


You can GET a specific survey from `/api/surveys/<id>` which will return a body like this:

```json
{
  "id": "1fd6e053-3e96-4590-bc08-bc6c399247db",
  "surveyName": "Test survey"
}
```
