import React, { useEffect, useState } from 'react';
import { listArtists } from './services/ArtistsService';
import type { Artist } from '../../models/music';
import { useNavigate } from 'react-router-dom';

const ArtistsPage: React.FC = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    listArtists()
      .then(setArtists)
      .catch(() => setError('Failed to load artists'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <span className="text-white">Loading artists...</span>
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
      <h1 className="text-4xl font-bold text-white mb-8">Artists</h1>
      {artists.length === 0 ? (
        <div className="text-gray-400">No artists found.</div>
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArtistsPage;