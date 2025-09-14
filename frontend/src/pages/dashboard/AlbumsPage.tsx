import React, { useEffect, useState } from 'react';
import { listAlbums } from './services/AlbumsService';
import { type Album } from '../../models/music';
import { useNavigate } from 'react-router-dom';

const AlbumsPage: React.FC = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    listAlbums()
      .then(setAlbums)
      .catch(() => setError('Failed to load albums'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <span className="text-white">Loading albums...</span>
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
      <h1 className="text-4xl font-bold text-white mb-8">Albums</h1>
      {albums.length === 0 ? (
        <div className="text-gray-400">No albums found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {albums.map(album => (
            <div
              key={album.id}
              className="bg-gray-800 rounded-lg shadow p-4 flex flex-col items-center cursor-pointer hover:bg-gray-700 transition"
              onClick={() => navigate(`/albums/${album.id}`)}
            >
              {album.cover_image && (
                <img
                  src={album.cover_image}
                  alt={album.title}
                  className="w-32 h-32 object-cover rounded mb-4"
                />
              )}
              <div className="text-xl font-semibold text-white">{album.title}</div>
              <div className="text-gray-400">{typeof album.artist === 'object' ? album.artist.name : ''}</div>
              {album.release_date && (
                <div className="text-gray-500 text-sm mt-2">
                  Released: {album.release_date}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlbumsPage;