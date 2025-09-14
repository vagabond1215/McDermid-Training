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
2. Copy `public/js/config.example.js` to `public/js/config.js` and replace the placeholder with your Google OAuth Client ID.
3. (Optional) Update the `allowedUsers` array in `public/js/auth.js` to restrict access.
4. Deploy to GitHub Pages:
   ```sh
   npm run deploy
   ```

The site serves static content from `public/` and requires no server beyond GitHub Pages.

## Google Sign-In Troubleshooting

If you encounter a 400 error when attempting to sign in with Google, it usually means the OAuth client is misconfigured. Verify that:

- `public/js/config.js` contains your actual Google OAuth Client ID.
- The domain serving the site is listed under **Authorized JavaScript origins** in the Google Cloud Console.

Refer to Google's documentation for additional setup details:
https://developers.google.com/identity/sign-in/web/sign-in
