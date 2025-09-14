const users = window.users || [];
const allowedUsers = users.map(user => user.email);
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

function handleEmailLogin(event) {
  event.preventDefault();
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  if (!emailInput || !passwordInput) return;
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const errorEl = document.getElementById('loginError');
  const user = users.find(u => u.email === email);
  if (!user) {
    if (errorEl) errorEl.textContent = 'Unknown user';
    return;
  }
  if (user.password !== password) {
    if (errorEl) errorEl.textContent = 'Invalid email or password';
    return;
  }
  if (errorEl) errorEl.textContent = '';
  if (document.getElementById('rememberMe').checked) {
    localStorage.setItem('rememberedUser', email);
  }
  showDashboard(email);
  window.location.href = 'module1.html';
}

function handleCredentialResponse(response) {
  const data = parseJwt(response.credential);
  const email = data.email;
  const errorEl = document.getElementById('loginError');
  if (allowedUsers.includes(email)) {
    if (document.getElementById('rememberMe').checked) {
      localStorage.setItem('rememberedUser', email);
    }
    if (errorEl) errorEl.textContent = '';
    showDashboard(email);
    window.location.href = 'module1.html';
  } else {
    if (errorEl) errorEl.textContent = 'Unknown user';
    google.accounts.id.disableAutoSelect();
  }
}

function initGoogle() {
  if (!CLIENT_ID) {
    console.warn('Google OAuth Client ID not set. See config.js.');
    const buttonEl = document.getElementById('g_id_button');
    if (buttonEl) {
      buttonEl.innerHTML = '<p>Google Sign-In unavailable. See <a href="https://developers.google.com/identity/sign-in/web/sign-in">setup instructions</a>.</p>';
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
  const form = document.getElementById('emailLoginForm');
  if (form) {
    form.addEventListener('submit', handleEmailLogin);
  }
  initGoogle();
});
