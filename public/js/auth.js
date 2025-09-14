const allowedUsers = [
  'rerhardt@ailpdx.com',
  'tmdermid@ailpdx.com'
];
window.allowedUsers = allowedUsers;

// Client ID is provided via public/js/config.js which sets window.GOOGLE_CLIENT_ID
const CLIENT_ID = window.GOOGLE_CLIENT_ID || '';

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

function showDashboard(email) {
  window.loggedInUser = email;
  const loginSection = document.getElementById('login-section');
  if (loginSection) {
    loginSection.style.display = 'none';
  }
  const dash = document.getElementById('dashboard');
  if (dash) {
    dash.style.display = 'block';
    const emailEl = document.getElementById('userEmail');
    if (emailEl) {
      emailEl.textContent = `Logged in as ${email}`;
    }
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('rememberedUser');
        google.accounts.id.disableAutoSelect();
        dash.style.display = 'none';
        if (loginSection) loginSection.style.display = 'block';
        initGoogle();
      });
    }
  }
}

function handleCredentialResponse(response) {
  const data = parseJwt(response.credential);
  const email = data.email;
  if (allowedUsers.includes(email)) {
    if (document.getElementById('rememberMe').checked) {
      localStorage.setItem('rememberedUser', email);
    }
    showDashboard(email);
  } else {
    alert('Unauthorized user');
    google.accounts.id.disableAutoSelect();
  }
}

function initGoogle() {
  if (!CLIENT_ID) {
    console.warn('Google OAuth Client ID not set. See config.js.');
    const buttonEl = document.getElementById('g_id_button');
    if (buttonEl) {
      buttonEl.innerHTML = '<p>Google Sign-In unavailable</p>';
    }
    return;
  }
  if (localStorage.getItem('rememberedUser')) {
    showDashboard(localStorage.getItem('rememberedUser'));
    return;
  }
  google.accounts.id.initialize({
    client_id: CLIENT_ID,
    callback: handleCredentialResponse
  });
  const buttonEl = document.getElementById('g_id_button');
  if (buttonEl) {
    google.accounts.id.renderButton(
      buttonEl,
      { theme: 'outline', size: 'large' }
    );
  }
}

window.addEventListener('load', () => {
  initGoogle();
  const twoFa = document.getElementById('2faBtn');
  if (twoFa) {
    twoFa.addEventListener('click', () => {
      alert('2FA is required through your Google account.');
    });
  }
  const passkey = document.getElementById('passkeyBtn');
  if (passkey) {
    passkey.addEventListener('click', () => {
      alert('Passkey login will use your device credentials.');
    });
  }
});
