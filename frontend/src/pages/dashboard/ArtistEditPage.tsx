import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getArtist, editArtist } from './services/ArtistsService';
import type { Artist } from '../../models/music';

const ArtistEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [form, setForm] = useState<{ name: string; bio?: string; birth_date?: string; country?: string }>({
    name: '',
    bio: '',
    birth_date: '',
    country: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setLoading(true);
      getArtist(Number(id))
        .then(data => {
          setArtist(data);
          setForm({
            name: data.name || '',
            bio: data.bio || '',
            birth_date: data.birth_date || '',
            country: data.country || '',
          });
        })
        .catch(() => setError('Failed to load artist'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    setError(null);
    try {
      await editArtist(Number(id), form);
      navigate(`/artists/${id}`);
    } catch {
      setError('Failed to save artist');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <span className="text-white">Loading artist...</span>
      </div>
    );
  }

  if (error || !artist) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <span className="text-red-500">{error || 'Artist not found.'}</span>
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
      <h1 className="text-3xl font-bold text-white mb-6">Edit Artist</h1>
      <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg shadow p-6 flex flex-col gap-4">
        <label className="text-white font-semibold">
          Name
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-1 p-2 rounded w-full bg-gray-700 text-white"
            required
          />
        </label>
        <label className="text-white font-semibold">
          Country
          <input
            type="text"
            name="country"
            value={form.country}
            onChange={handleChange}
            className="mt-1 p-2 rounded w-full bg-gray-700 text-white"
          />
        </label>
        <label className="text-white font-semibold">
          Birth Date
          <input
            type="date"
            name="birth_date"
            value={form.birth_date || ''}
            onChange={handleChange}
            className="mt-1 p-2 rounded w-full bg-gray-700 text-white"
          />
        </label>
        <label className="text-white font-semibold">
          Bio
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            className="mt-1 p-2 rounded w-full bg-gray-700 text-white"
            rows={4}
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

export default ArtistEditPage;