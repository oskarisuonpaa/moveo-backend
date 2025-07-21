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

Successful response: **204**.

### /api/events

#### GET /:alias

Returns all events of a specific calendar.

Successful response:

```json
{
  "data": [
    {
      "id": "0h1qu23jor0ubl49pndtiuv2t4",
      "title": "Otsikko1",
      "description": "Kuvaus",
      "start": "2025-07-17T17:00:00+03:00",
      "end": "2025-07-17T18:00:00+03:00",
      "location": "Niemenkatu 73, 15140 Lahti",
      "maxAttendees": "10",
      "attendees": [...]
    },
    ...
  ]
}
```

#### GET /:alias/:eventId

Returns a specific event from a specific calendar.

Successful response:

```json
{
  "data": {
    "id": "0h1qu23jor0ubl49pndtiuv2t4",
    "title": "Otsikko1",
    "description": "Kuvaus",
    "start": "2025-07-17T17:00:00+03:00",
    "end": "2025-07-17T18:00:00+03:00",
    "location": "Niemenkatu 73, 15140 Lahti",
    "maxAttendees": "10",
    "attendees": [...]
  }
}
```

#### POST /:alias/

Creates a new event to specific calendar.

Request body:

```json
{
  "start": "2025-07-17T14:00:00.000Z",
  "end": "2025-07-17T15:00:00.000Z",
  "description": "Kuvaus",
  "summary": "Otsikko1",
  "location": "Niemenkatu 73, 15140 Lahti",
  "maxAttendees": 10
}
```

Successful response: **201**.

#### POST /:alias/:eventId/attend

Adds the authorized user as a attendee to the event if there is room.

#### DELETE /:alias/:eventId/unattend

Removes the authorized user from event attendees.
