import { type Album } from './../../../models/music'

const API_URL = `${import.meta.env.VITE_API_URL}/albums`;

export async function getAlbum(id: number): Promise<Album> {
  const response = await fetch(`${API_URL}/get/?id=${id}`, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch album');
  return response.json();
}

export async function listAlbums(): Promise<Album[]> {
  const response = await fetch(`${API_URL}/list/`, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch albums');
  return response.json();
}

export async function createAlbum(data: { title: string; artist_id: number; release_date?: string; cover_image?: File }): Promise<Album> {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('artist_id', String(data.artist_id));
  if (data.release_date) formData.append('release_date', data.release_date);
  if (data.cover_image) formData.append('cover_image', data.cover_image);

  const response = await fetch(`${API_URL}/create/`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to create album');
  return response.json();
}

export async function editAlbum(
  id: number,
  data: Partial<{ title: string; artist_id: number; release_date: string; cover_image: File }>
): Promise<Album> {
  const formData = new FormData();
  if (data.title) formData.append('title', data.title);
  if (data.artist_id) formData.append('artist_id', String(data.artist_id));
  if (data.release_date) formData.append('release_date', data.release_date);
  if (data.cover_image) formData.append('cover_image', data.cover_image);

  const response = await fetch(`${API_URL}/edit/?id=${id}`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to edit album');
  return response.json();
}

export async function listAlbumsByArtist(artist_id: number): Promise<Album[]> {
  const response = await fetch(`${API_URL}/list_by_artist/?artist_id=${artist_id}`, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch albums by artist');
  return response.json();
}

export async function deleteAlbum(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/delete/?id=${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to delete album');
}

export async function isAlbumOwner(id: number): Promise<{ is_owner: boolean }> {
  const response = await fetch(`${API_URL}/is_owner/?id=${id}`, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to check album ownership');
  return response.json();
}