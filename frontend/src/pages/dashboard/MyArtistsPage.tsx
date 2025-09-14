import React, { useEffect, useState } from 'react';
import { myArtists, deleteArtist } from './services/ArtistsService';
import type { Artist } from '../../models/music';
import { useNavigate } from 'react-router-dom';

const MyArtistsPage: React.FC = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    myArtists()
      .then(setArtists)
      .catch(() => setError('Failed to load your artists'))
      .finally(() => setLoading(false));
  }, []);

  const handleEdit = (id: number) => {
    navigate(`/artists/${id}/edit`);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this artist?')) return;
    try {
      await deleteArtist(id);
      setArtists((artists) => artists.filter((artist) => artist.id !== id));
    } catch {
      alert('Failed to delete artist.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <span className="text-white">Loading your artists...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <span className="text-red-500">{error}</span>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-white">My Artists</h1>
        <button
          onClick={() => navigate('/artists/create')}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 transition"
        >
          + Create Artist
        </button>
      </div>
      {artists.length === 0 ? (
        <div className="text-gray-400">You have no artists.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {artists.map(artist => (
            <div
              key={artist.id}
              className="bg-gray-800 rounded-lg shadow p-4 flex flex-col items-center cursor-pointer hover:bg-gray-700 transition"
              onClick={() => navigate(`/artists/${artist.id}`)}
            >
              <div className="text-xl font-semibold text-white mb-2">{artist.name}</div>
              {artist.country && (
                <div className="text-gray-400 mb-1">{artist.country}</div>
              )}
              {artist.birth_date && (
                <div className="text-gray-500 text-sm mb-1">
                  Born: {artist.birth_date}
                </div>
              )}
              {artist.bio && (
                <div className="text-gray-300 text-sm mt-2">{artist.bio}</div>
              )}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={e => {
                    e.stopPropagation();
                    handleEdit(artist.id);
                  }}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
                >
                  Edit
                </button>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    handleDelete(artist.id);
                  }}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-500 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyArtistsPage;