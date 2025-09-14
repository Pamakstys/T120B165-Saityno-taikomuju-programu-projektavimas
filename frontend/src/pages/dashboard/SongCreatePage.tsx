import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createSong } from './services/SongsService';
import type { Genre } from '../../models/music';

const GENRES: Genre[] = [
  'POP', 'ROCK', 'JAZZ', 'CLASSICAL', 'HIPHOP', 'COUNTRY', 'ELECTRONIC', 'OTHER'
];

const SongCreatePage: React.FC = () => {
  const { id: albumId } = useParams<{ id: string }>();
  const [form, setForm] = useState<{
    title: string;
    release_date: string;
    genre: Genre;
    audio_file: File | null;
    cover_image: File | null;
  }>({
    title: '',
    release_date: '',
    genre: 'OTHER',
    audio_file: null,
    cover_image: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === 'audio_file' && files) {
      setForm({ ...form, audio_file: files[0] });
    } else if (name === 'cover_image' && files) {
      setForm({ ...form, cover_image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!albumId) {
      setError('Album ID is missing');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await createSong({
        title: form.title,
        album_id: Number(albumId),
        release_date: form.release_date,
        genre: form.genre,
        audio_file: form.audio_file || undefined,
        cover_image: form.cover_image || undefined,
      });
      setSuccess(true);
      setTimeout(() => navigate(`/albums/${albumId}`), 1000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-full w-full">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded shadow flex flex-col gap-4 w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-white mb-4">Add Song</h1>
        <div>
          <label htmlFor="title" className="block text-gray-300 mb-1">Title</label>
          <input
            id="title"
            type="text"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            className="p-2 rounded bg-gray-700 text-white w-full"
            required
          />
        </div>
        <div>
          <label htmlFor="release_date" className="block text-gray-300 mb-1">Release Date</label>
          <input
            id="release_date"
            type="date"
            name="release_date"
            placeholder="Release Date"
            value={form.release_date}
            onChange={handleChange}
            className="p-2 rounded bg-gray-700 text-white w-full"
          />
        </div>
        <div>
          <label htmlFor="genre" className="block text-gray-300 mb-1">Genre</label>
          <select
            id="genre"
            name="genre"
            value={form.genre}
            onChange={handleChange}
            className="p-2 rounded bg-gray-700 text-white w-full"
          >
            {GENRES.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="audio_file" className="block text-gray-300 mb-1">Audio File</label>
          <input
            id="audio_file"
            type="file"
            name="audio_file"
            accept="audio/*"
            onChange={handleChange}
            className="p-2 rounded bg-gray-700 text-white w-full"
            required
          />
        </div>
        <div>
          <label htmlFor="cover_image" className="block text-gray-300 mb-1">Cover Image</label>
          <input
            id="cover_image"
            type="file"
            name="cover_image"
            accept="image/*"
            onChange={handleChange}
            className="p-2 rounded bg-gray-700 text-white w-full"
          />
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 transition"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Song'}
        </button>
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-500">Song added!</div>}
      </form>
    </div>
  );
};

export default SongCreatePage;