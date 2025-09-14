import React, { useState } from 'react';
import { createArtist } from './services/ArtistsService';
import { useNavigate } from 'react-router-dom';

const ArtistCreatePage: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    bio: '',
    birth_date: '',
    country: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const artist = await createArtist(form);
      setSuccess(true);
      setTimeout(() => navigate(`/artists/${artist.id}`), 1000);
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
        <h1 className="text-3xl font-bold text-white mb-4">Create Artist</h1>
        <div>
          <label htmlFor="name" className="block text-gray-300 mb-1">Name</label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="p-2 rounded bg-gray-700 text-white w-full"
            required
          />
        </div>
        <div>
          <label htmlFor="country" className="block text-gray-300 mb-1">Country</label>
          <input
            id="country"
            type="text"
            name="country"
            placeholder="Country"
            value={form.country}
            onChange={handleChange}
            className="p-2 rounded bg-gray-700 text-white w-full"
          />
        </div>
        <div>
          <label htmlFor="birth_date" className="block text-gray-300 mb-1">Birth Date</label>
          <input
            id="birth_date"
            type="date"
            name="birth_date"
            placeholder="Birth Date"
            value={form.birth_date}
            onChange={handleChange}
            className="p-2 rounded bg-gray-700 text-white w-full"
          />
        </div>
        <div>
          <label htmlFor="bio" className="block text-gray-300 mb-1">Bio</label>
          <textarea
            id="bio"
            name="bio"
            placeholder="Bio"
            value={form.bio}
            onChange={handleChange}
            className="p-2 rounded bg-gray-700 text-white w-full"
            rows={4}
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
        {success && <div className="text-green-500">Artist created!</div>}
      </form>
    </div>
  );
};

export default ArtistCreatePage;