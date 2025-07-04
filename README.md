# Moveo Backend

## Routes

### /api/calendars

#### GET /

Returns all calendar aliases.

Successful response:

```
{
    "data": [
        "test1",
        "test2"
    ]
}
```

#### POST /

Creates a new calendar.

Request body:

```
{
    "alias": "test2"
}

```

Successful response:

```
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
