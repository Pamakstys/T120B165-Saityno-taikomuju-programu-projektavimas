import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSong, editSong } from './services/SongsService';
import type { Song, Genre } from '../../models/music';

const GENRES: Genre[] = [
  'POP', 'ROCK', 'JAZZ', 'CLASSICAL', 'HIPHOP', 'COUNTRY', 'ELECTRONIC', 'OTHER'
];

const SongEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [song, setSong] = useState<Song | null>(null);
  const [form, setForm] = useState<{
    title: string;
    release_date?: string;
    genre?: Genre;
    duration?: string;
    cover_image?: File | null;
    audio_file?: File | null;
  }>({
    title: '',
    release_date: '',
    genre: 'OTHER',
    duration: '',
    cover_image: null,
    audio_file: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setLoading(true);
      getSong(Number(id))
        .then(data => {
          setSong(data);
          setForm({
            title: data.title || '',
            release_date: data.release_date || '',
            genre: data.genre || 'OTHER',
            duration: data.duration || '',
            cover_image: null,
            audio_file: null,
          });
        })
        .catch(() => setError('Failed to load song'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === 'cover_image' && files) {
      setForm({ ...form, cover_image: files[0] });
    } else if (name === 'audio_file' && files) {
      setForm({ ...form, audio_file: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    setError(null);
    try {
      await editSong(Number(id), {
        ...form,
        audio_file: form.audio_file ?? undefined,
        cover_image: form.cover_image ?? undefined,
      });
      navigate(`/songs`);
    } catch {
      setError('Failed to save song');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <span className="text-white">Loading song...</span>
      </div>
    );
  }

  if (error || !song) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <span className="text-red-500">{error || 'Song not found.'}</span>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition mb-4"
      >
        Go Back
      </button>
      <h1 className="text-3xl font-bold text-white mb-6">Edit Song</h1>
      <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg shadow p-6 flex flex-col gap-4">
        <label className="text-white font-semibold">
          Title
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="mt-1 p-2 rounded w-full bg-gray-700 text-white"
            required
          />
        </label>
        <label className="text-white font-semibold">
          Release Date
          <input
            type="date"
            name="release_date"
            value={form.release_date || ''}
            onChange={handleChange}
            className="mt-1 p-2 rounded w-full bg-gray-700 text-white"
          />
        </label>
        <label className="text-white font-semibold">
          Genre
          <select
            name="genre"
            value={form.genre}
            onChange={handleChange}
            className="mt-1 p-2 rounded w-full bg-gray-700 text-white"
          >
            {GENRES.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </label>
        <label className="text-white font-semibold">
          Duration
          <input
            type="text"
            name="duration"
            value={form.duration || ''}
            onChange={handleChange}
            className="mt-1 p-2 rounded w-full bg-gray-700 text-white"
            placeholder="e.g. 03:45"
          />
        </label>
        <label className="text-white font-semibold">
          Cover Image
          <input
            type="file"
            name="cover_image"
            accept="image/*"
            onChange={handleChange}
            className="mt-1 p-2 rounded w-full bg-gray-700 text-white"
          />
        </label>
        <label className="text-white font-semibold">
          Audio File
          <input
            type="file"
            name="audio_file"
            accept="audio/*"
            onChange={handleChange}
            className="mt-1 p-2 rounded w-full bg-gray-700 text-white"
          />
        </label>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
};

export default SongEditPage;