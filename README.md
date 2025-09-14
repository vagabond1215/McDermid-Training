# AO Globe Life Training Portal

This repository contains a training and resource hub for AO Globe Life agents and managers.

## Features
- Static site that can be hosted on GitHub Pages
- Google sign-in for credential verification
- Static pages for Module 1 training and a hiring process checklist
- Placeholder AO Globe Life branding and colors

## Setup
1. Install dependencies:
   ```sh
   npm install
   ```
2. Replace the `CLIENT_ID` constant in `public/js/auth.js` with your Google OAuth Client ID.
3. (Optional) Update the `allowedUsers` array in `public/js/auth.js` to restrict access.
4. Deploy to GitHub Pages:
   ```sh
   npm run deploy
   ```

The site serves static content from `public/` and requires no server beyond GitHub Pages.
