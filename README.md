# Moveo Backend

## Get Started

1. Clone the repository
2. Navigate to the repository directory
3. Add **.env** (optional) and **service-account.json** files to the root
4. Run `npm install` to install depedencies
5. Run `npm run dev` to start a development server

## Routes

### /api/calendars

#### GET /

Returns all calendar aliases.

Successful response:

```json
{
  "data": ["test1", "test2"]
}
```

#### POST /

Creates a new calendar.

Request body:

```json
{
  "alias": "test2"
}
```

Successful response:

```json
{
  "data": {
    "kind": "...",
    "etag": "...",
    "id": "...",
    "summary": "test2",
    "timeZone": "Europe/Helsinki"
  }
}
```

#### DELETE /:alias

Deletes a calendar by alias.

### /api/events

#### GET /:alias

Returns all events of a specific calendar.

Successful response:

```json
{
  "data": [
    {
      "id": "5idiqrluhkf4bg1fsgfbc609ho",
      "title": "test",
      "description": "No Description",
      "start": "2025-07-07T12:00:00+03:00",
      "end": "2025-07-07T13:00:00+03:00"
    },
    {
      "id": "ingh1o5cmgf0mhjccc7u653jak",
      "title": "test1",
      "description": "No Description",
      "start": "2025-07-07T12:00:00+03:00",
      "end": "2025-07-07T13:00:00+03:00"
    },
    {
      "id": "n7ng8ht7bbg6o3g5s00t46b62s",
      "title": "test2",
      "description": "test2",
      "start": "2025-07-07T12:00:00+03:00",
      "end": "2025-07-07T13:00:00+03:00"
    }
  ]
}
```

#### GET /:alias/:eventId

Returns a specific event from a specific calendar.

Successful response:

```json
{
  "data": {
    "id": "5idiqrluhkf4bg1fsgfbc609ho",
    "title": "test",
    "description": "No Description",
    "start": "2025-07-07T12:00:00+03:00",
    "end": "2025-07-07T13:00:00+03:00"
  }
}
```

#### POST /:alias/

Creates a new event to specific calendar.

Request body:

```json
{
  "start": "2025-07-07T09:00:00.000Z",
  "end": "2025-07-07T10:00:00.000Z",
  "description": "test2",
  "summary": "test2"
}
```

Successful response: **201**.
