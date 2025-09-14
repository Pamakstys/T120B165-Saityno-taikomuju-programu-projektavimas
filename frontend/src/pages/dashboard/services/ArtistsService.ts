import type { Artist } from "../../../models/music";

const API_URL = `${import.meta.env.VITE_API_URL}/artists`;

export async function getArtist(id: number): Promise<Artist> {
  const response = await fetch(`${API_URL}/get/?id=${id}`, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch artist');
  return response.json();
}

export async function listArtists(): Promise<Artist[]> {
  const response = await fetch(`${API_URL}/list/`, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch artists');
  return response.json();
}

export async function createArtist(data: { name: string; bio?: string; birth_date?: string; country?: string }): Promise<Artist> {
  const response = await fetch(`${API_URL}/create/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create artist');
  return response.json();
}

export async function editArtist(id: number, data: Partial<{ name: string; bio?: string; birth_date?: string; country?: string }>): Promise<Artist> {
  const response = await fetch(`${API_URL}/edit/?id=${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to edit artist');
  return response.json();
}

export async function deleteArtist(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/delete/?id=${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to delete artist');
}

export async function myArtists(): Promise<Artist[]> {
  const response = await fetch(`${API_URL}/my_artists/`, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch your artists');
  return response.json();
}

export async function isArtistOwner(id: number): Promise<{ is_owner: boolean }> {
  const response = await fetch(`${API_URL}/is_owner/?id=${id}`, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to check artist ownership');
  return response.json();
}