const allowedUsers = [
  'rerhardt@ailpdx.com',
  'tmdermid@ailpdx.com'
];

const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID'; // Replace with your Google OAuth Client ID

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(jsonPayload);
}

function handleCredentialResponse(response) {
  const data = parseJwt(response.credential);
  const email = data.email;
  const authEl = document.getElementById('auth');

  if (allowedUsers.includes(email)) {
    authEl.innerHTML = `Logged in as ${email} <button id="logoutBtn">Logout</button>`;
    document.getElementById('logoutBtn').addEventListener('click', () => {
      google.accounts.id.disableAutoSelect();
      authEl.innerHTML = '';
      google.accounts.id.renderButton(authEl, { theme: 'outline', size: 'large' });
    });
  } else {
    authEl.innerHTML = 'Unauthorized user';
    google.accounts.id.disableAutoSelect();
  }
}

window.addEventListener('load', () => {
  google.accounts.id.initialize({
    client_id: CLIENT_ID,
    callback: handleCredentialResponse
  });
  const authEl = document.getElementById('auth');
  google.accounts.id.renderButton(authEl, { theme: 'outline', size: 'large' });
});
