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

```text
SMS sent
```

### POST /login

- Logins in CMS using the provided username and code and creates a session

**Request**

Sample `POST` Request:

```json
{
  "username": "username",
  "code": "123456"
}
```

**Response**

Sample `200` Response:

```text
{
    "secret": "eyJpZCI6IlRPVlRSIiwic2VjcmV0IjoiNjcyZDFmMDlkN2JlOWU0YTdiZWQ5N2NhMzY2MTM3YmFkYTRlYzRlZjk2YzM0ZGYxMmQ2YTY4N2MyOWIzNjRkODNjOTcxOTQwYTA1YjhhNTI4MzhiYmVhMzg0ZDkxODU1Mjk4YmUzZjgxZDEwZTYxOTk4MDcyMTE5MjE1ODE4MDkzMDc2MDBmMTFhMmVkNjIyODJhODMzODViM2IzZTJiNDc1NTFhNDMyOTg1YzQ3ZDc1ZGViY2EwZmQ3NTYyZTAwZjZkNGYxMjJjYjcyNTg1NjM1ODhiYWQ2YTc2ZGQ3MzMxMGZmMjZjODFhZjcwMDY5MTMzNDViYmM0MDU1MTE2MCJ9",
    "cms_token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ7XCJhdXRoLXVzZXJcIjpcIlRPVlRSXCIsXCJtb3VudGVyLWlkXCI6Njg3N30iLCJhdXRoIjoiUk9MRV9BRE1JTixST0xFX1VTRVIiLCJleHAiOjE3MzYyNjIzNjJ9.GnhYOfqjonaOXyqA3m5d_VyEn3jO_XBP4tsXQULZehE4sAplHTIhNB4Q3AhnGmfobLWQdxPR4sU-RuMYuB_Z3w"
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
