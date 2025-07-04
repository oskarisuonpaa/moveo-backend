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
