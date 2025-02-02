# Kaf's CMS Authentication

Appwrite function to authenticate users via CMS

## 🧰 Usage

### POST /challenge

- Sends a request to the CMS to pre authenticate (send an SMS code) the user

**Request**

Sample `POST` Request:

```json
{
  "username": "username",
  "password": "password"
}
```

**Response**

Sample `200` Response:

```json
{
  "code": "OK",
  "message": "SMS sent successfully.",
  "full": null
}
```

### POST /login

- Logins in CMS using the provided username and code and creates a session

**Request**

Sample `POST` Request:

```json
{
  "username": "username",
  "code": "12345"
}
```

**Response**

Sample `200` Response:

```json
{
    "code": "OK",
    "message": "Login was successful",
    "full": {
        "cms_id": 6877,
        "secret": "237cda",
        "cms_token": "eyJhbGciOiJIUzUxMiJ9..."
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

| Variable          | Value                               |
| ----------------- | ----------------------------------- |
| PROXY_USER        | Username for proxy server           |
| PROXY_PASS        | Password for proxy server           |
| PROXY_URL         | URL for **UKRAINIAN** proxy server  |
| PROXY_PORT        | Port for proxy server               |
| CMS_BASE_URL      | Base URL for CMS                    |
