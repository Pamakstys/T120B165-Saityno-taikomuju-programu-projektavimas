import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAlbum, editAlbum } from './services/AlbumsService';
import type { Album } from '../../models/music';

const AlbumEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [album, setAlbum] = useState<Album | null>(null);
  const [form, setForm] = useState<{ title: string; release_date?: string; cover_image?: File | null }>({
    title: '',
    release_date: '',
    cover_image: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setLoading(true);
      getAlbum(Number(id))
        .then(data => {
          setAlbum(data);
          setForm({
            title: data.title || '',
            release_date: data.release_date || '',
            cover_image: null,
          });
        })
        .catch(() => setError('Failed to load album'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'cover_image' && files) {
      setForm({ ...form, cover_image: files[0] });
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
      await editAlbum(Number(id), {
        ...form,
        cover_image: form.cover_image ?? undefined,
      });
      navigate(`/albums/${id}`);
    } catch {
      setError('Failed to save album');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <span className="text-white">Loading album...</span>
      </div>
    );
  }

  if (error || !album) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <span className="text-red-500">{error || 'Album not found.'}</span>
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
      <h1 className="text-3xl font-bold text-white mb-6">Edit Album</h1>
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
          Cover Image
          <input
            type="file"
            name="cover_image"
            accept="image/*"
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

export default AlbumEditPage;