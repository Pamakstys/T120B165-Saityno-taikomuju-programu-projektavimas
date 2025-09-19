const API_URL = import.meta.env.VITE_API_URL;

export async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include'
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

export async function register(name: string, email: string, password: string) {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Registration failed');
  }
  return response.json();
}

export async function getCurrentUser() {
  const response = await fetch(`${API_URL}/user`, {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch current user');
  }
  return response.json();
}

export async function changePassword(current_password: string, new_password: string): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/change-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ current_password, new_password }),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to change password');
  }
  return response.json();
}