import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listAlbums } from './services/AlbumsService';
import type { Album } from '../../models/music';

const HomePage: React.FC = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    listAlbums()
      .then(setAlbums)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 rounded-lg shadow-lg p-8 mb-8 w-full max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold text-white mb-4">Welcome to Music App!</h1>
        <p className="text-lg text-blue-100 mb-2">
          Discover, manage, and share your favorite artists, albums, and songs.
        </p>
        <p className="text-blue-200">
          Create your own music library, explore new releases, and enjoy a modern, responsive experience.
        </p>
      </div>
      <div className="w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-white mb-4">Featured Albums</h2>
        {loading ? (
          <div className="text-gray-300">Loading albums...</div>
        ) : albums.length === 0 ? (
          <div className="text-gray-400">No albums found.</div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {albums.slice(0, 6).map(album => (
              <li
                key={album.id}
                className="bg-gray-800 rounded-lg p-4 flex flex-col items-center shadow cursor-pointer hover:bg-gray-700 transition"
                onClick={() => navigate(`/albums/${album.id}`)}
              >
                {album.cover_image && (
                  <img
                    src={album.cover_image}
                    alt={album.title}
                    className="w-20 h-20 object-cover rounded mb-2 max-w-[96px]"
                  />
                )}
                <div className="text-lg font-semibold text-white">{album.title}</div>
                <div className="text-gray-400 text-sm mb-1">
                  {typeof album.artist === 'object' ? album.artist.name : ''}
                </div>
                {album.release_date && (
                  <div className="text-gray-500 text-xs">
                    Released: {album.release_date}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HomePage;