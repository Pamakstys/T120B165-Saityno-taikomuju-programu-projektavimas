import type { Song } from "../../../models/music";
import { apiClient } from '../../../context/apiClient'

const API_URL = `${import.meta.env.VITE_API_URL}/songs`;

export async function getSong(id: number): Promise<Song> {
  const response = await fetch(`${API_URL}/get/?id=${id}`, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch song');
  return response.json();
}

export async function listSongs(): Promise<Song[]> {
  const response = await apiClient(`/songs/list/`, {
    method: 'GET',
  });
  if (!response.ok) throw new Error('Failed to fetch songs');
  return response.json();
}

export async function listSongsByAlbum(album_id: number): Promise<Song[]> {
  const response = await fetch(`${API_URL}/list_by_album/?album_id=${album_id}`, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch songs by album');
  return response.json();
}

export async function createSong(data: { title: string; album_id: number; release_date?: string; genre?: string; audio_file?: File; cover_image?: File }): Promise<Song> {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('album_id', String(data.album_id));
  if (data.release_date) formData.append('release_date', data.release_date);
  if (data.genre) formData.append('genre', data.genre);
  if (data.audio_file) formData.append('audio_file', data.audio_file);
  if (data.cover_image) formData.append('cover_image', data.cover_image);

  const response = await fetch(`${API_URL}/create/`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to create song');
  return response.json();
}

export async function editSong(
  id: number,
  data: Partial<{ title: string; album_id: number; release_date: string; genre: string; audio_file: File; cover_image: File }>
): Promise<Song> {
  const formData = new FormData();
  if (data.title) formData.append('title', data.title);
  if (data.album_id) formData.append('album_id', String(data.album_id));
  if (data.release_date) formData.append('release_date', data.release_date);
  if (data.genre) formData.append('genre', data.genre);
  if (data.audio_file) formData.append('audio_file', data.audio_file);
  if (data.cover_image) formData.append('cover_image', data.cover_image);

  const response = await fetch(`${API_URL}/edit/?id=${id}`, {
    method: 'POST', // Use POST if your backend expects POST for edit
    body: formData,
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to edit song');
  return response.json();
}

export async function deleteSong(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/delete/?id=${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to delete song');
}

export async function isSongOwner(id: number): Promise<{ is_owner: boolean }> {
  const response = await fetch(`${API_URL}/is_owner/?id=${id}`, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to check song ownership');
  return response.json();
}