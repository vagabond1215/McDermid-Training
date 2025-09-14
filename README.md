# AO Globe Life Training Portal

This repository contains an initial training and resource hub for AO Globe Life agents and managers.

## Features
- Node.js/Express server with optional HTTPS
- Google OAuth login restricted by `config/allowedUsers.json`
- Static pages for Module 1 training and a hiring process checklist
- Placeholder AO Globe Life branding and colors

## Setup
1. Install dependencies:
   ```sh
   npm install
   ```
2. Add authorized user emails to `config/allowedUsers.json`.
3. Provide Google OAuth credentials via environment variables:
   ```sh
   export GOOGLE_CLIENT_ID="your-client-id"
   export GOOGLE_CLIENT_SECRET="your-client-secret"
   ```
4. (Optional) Generate SSL certificates in `cert/`:
   ```sh
   openssl req -x509 -newkey rsa:4096 -nodes -out cert/server.cert -keyout cert/server.key -days 365
   ```
5. Start the server:
   ```sh
   node server.js
   ```

The site serves static content from `public/` and supports Google login at `/auth/google`.
