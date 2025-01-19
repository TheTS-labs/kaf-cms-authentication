# Kaf's CMS Authentication

Appwrite function to authenticate users via CMS, and create a session and an account if it doesn't exist

## 🧰 Usage

### POST /

Sends a request to the CMS (`/api/users/me`) with provided JWT token in the `Authorization` header (e.g. `Authorization: Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ7XCJh...`)

Sample `200` Response:

```json
{
    "code": "OK",
    "message": "Login successful",
    "full": {
        "secret": "49970e"
    }
}
```

## ⚙️ Configuration

| Setting           | Value                                         |
| ----------------- | --------------------------------------------- |
| Runtime           | Node (22.0)                                   |
| Entrypoint        | `dist/main.js`                                |
| Build Commands    | `npm install`, `npm run build`                |
| Permissions       | `sessions.write`, `users.read`, `users.write` |
| Timeout (Seconds) | 15                                            |

## 🔒 Environment Variables

| Variable          | Value             | Example                                   |
| ----------------- | ----------------- | ----------------------------------------- |
| CMS_BASE_URL      | Base URL for CMS  | <https://cms-mobile-api.fcs.kyivstar.ua>  |
