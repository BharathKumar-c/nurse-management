## Nurse Management API Documentation

Base URL: `http://localhost:5000/api`

### Authentication
No authentication is required for the assessment. All endpoints are public.

---

### GET `/nurses`
Fetch all nurses.

**Query Parameters**
| Param | Type | Description |
| --- | --- | --- |
| `search` | string | Filter by name or license number (optional) |
| `sortField` | string | One of `id`, `name`, `license_number`, `date_of_birth`, `age`, `created_at` |
| `sortOrder` | string | `asc` or `desc` |

**Response**
```json
[
  {
    "id": 1,
    "name": "Daniel",
    "license_number": "2147483647",
    "date_of_birth": "2000-10-16T00:00:00.000Z",
    "age": 24,
    "created_at": "2025-01-19T12:45:00.000Z",
    "updated_at": "2025-01-19T12:45:00.000Z"
  }
]
```

---

### GET `/nurses/:id`
Fetch a nurse by ID.

**Path Parameters**
| Param | Type | Description |
| --- | --- | --- |
| `id` | number | Nurse ID |

**Responses**
- `200` OK with nurse object
- `404` if nurse not found

---

### POST `/nurses`
Create a new nurse.

**Body**
```json
{
  "name": "Daniel",
  "license_number": "2147483647",
  "date_of_birth": "2000-10-16"
}
```

Age is computed automatically from `date_of_birth`.

**Validation**
- `name`: required, max 255 chars
- `license_number`: required, unique, max 50 chars
- `date_of_birth`: required ISO date string

**Responses**
- `201` with created nurse payload
- `409` if license number exists
- `400` validation errors

---

### PUT `/nurses/:id`
Update an existing nurse.

**Body**
Same as POST body. Age is recalculated from DOB.

**Responses**
- `200` with updated nurse payload
- `404` if nurse not found
- `409` duplicate license number

---

### DELETE `/nurses/:id`
Remove a nurse.

**Responses**
- `200` success message
- `404` if nurse not found

---

### GET `/nurses/export/csv`
Download all nurses as CSV. Returns a binary CSV file.

### GET `/nurses/export/xlsx`
Download all nurses as XLSX.

---

## Error Format
```json
{
  "error": "License number already exists"
}
```

Validation errors:
```json
{
  "errors": [
    {
      "type": "field",
      "msg": "Name is required",
      "path": "name",
      "location": "body"
    }
  ]
}
```

---

## Postman Collection
Use `postman/NurseManagement.postman_collection.json` and set the `base_url` variable to your API origin (default `http://localhost:5000`).

