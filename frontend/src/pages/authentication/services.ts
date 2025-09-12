const API_URL = import.meta.env.VITE_API_URL;

export async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include', // Important: include cookies in the request
  });
  if (!response.ok) {
    throw new Error('Login failed');
  }
  return response.json();
}

export async function logout() {
  const response = await fetch(`${API_URL}/logout`, {
    method: 'POST',
    credentials: 'include',
    });
    if (!response.ok) {
        throw new Error('Logout failed');
    }
    window.location.href = '/';
    return response.json();
}

export async function register(username: string, email: string, password: string) {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Registration failed');
  }
  return response.json();
}
