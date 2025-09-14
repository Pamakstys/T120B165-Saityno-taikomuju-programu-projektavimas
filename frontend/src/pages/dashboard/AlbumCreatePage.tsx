import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createAlbum } from './services/AlbumsService';

const AlbumCreatePage: React.FC = () => {
  const { id: artistId } = useParams<{ id: string }>();
  const [form, setForm] = useState({
    title: '',
    release_date: '',
    cover_image: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, files } = e.target;
    if (name === 'cover_image' && files) {
      setForm({ ...form, cover_image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artistId) {
      setError('Artist ID is missing');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const album = await createAlbum({
        title: form.title,
        artist_id: Number(artistId),
        release_date: form.release_date,
        cover_image: form.cover_image || undefined,
      });
      setSuccess(true);
      setTimeout(() => navigate(`/albums/${album.id}`), 1000);
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
        <h1 className="text-3xl font-bold text-white mb-4">Create Album</h1>
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
          {loading ? 'Creating...' : 'Create'}
        </button>
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-500">Album created!</div>}
      </form>
    </div>
  );
};

export default AlbumCreatePage;