function showForm(form) {
  document.querySelectorAll('.form').forEach(f => f.classList.remove('active'));
  document.getElementById(form).classList.add('active');
}

function register(e) {
  e.preventDefault();
  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  localStorage.setItem('quickBiteUser', JSON.stringify({name, email}));
  document.getElementById('registerMsg').textContent = 'Registration successful! You can now login.';
  showForm('login');
}

function login(e) {
  e.preventDefault();
  const saved = JSON.parse(localStorage.getItem('quickBiteUser'));
  const email = document.getElementById('loginEmail').value;

  if (saved && saved.email === email) {
    document.getElementById('loginMsg').textContent = 'Login successful!';
  } else {
    document.getElementById('loginMsg').textContent = 'Please register first.';
  }
}