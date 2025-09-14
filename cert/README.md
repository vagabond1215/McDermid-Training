# SSL Certificate

Place `server.key` and `server.cert` in this directory for HTTPS support.
Generate a self-signed certificate for development:

```
openssl req -x509 -newkey rsa:4096 -nodes -out server.cert -keyout server.key -days 365
```

These files are excluded from version control.
