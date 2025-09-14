import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getArtist, deleteArtist, isArtistOwner } from './services/ArtistsService';
import { listAlbumsByArtist } from './services/AlbumsService';
import type { Artist, Album } from '../../models/music';
import { getCurrentUser } from '../authentication/services';

const ArtistPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>('user');
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    getCurrentUser()
      .then(user => setUserRole(user.role || 'user'))
      .catch(() => setUserRole('user'));
  }, []);

  useEffect(() => {
    if (id) {
      setLoading(true);
      Promise.all([
        getArtist(Number(id)),
        listAlbumsByArtist(Number(id)),
        isArtistOwner(Number(id))
      ])
        .then(([artistData, albumsData, ownerData]) => {
          setArtist(artistData);
          setAlbums(albumsData);
          setIsOwner(ownerData.is_owner);
        })
        .catch(() => setError('Failed to load artist'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const canEditOrDelete = userRole === 'admin' || isOwner;

  const handleEdit = () => {
    if (id) navigate(`/artists/${id}/edit`);
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm('Are you sure you want to delete this artist?')) return;
    try {
      await deleteArtist(Number(id));
      navigate('/artists');
    } catch {
      alert('Failed to delete artist.');
    }
  };

  const handleCreateAlbum = () => {
    if (id) navigate(`/artists/${id}/create`);
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
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
        >
          Go Back
        </button>
        {canEditOrDelete && (
          <>
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 transition"
            >
              Delete
            </button>
          </>
        )}
      </div>
      <div className="bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">{artist.name}</h2>
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
      </div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl text-white">Albums</h3>
        {canEditOrDelete && (
          <button
            onClick={handleCreateAlbum}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 transition"
          >
            + Create Album
          </button>
        )}
      </div>
      {albums.length === 0 ? (
        <div className="text-gray-400">No albums found for this artist.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {albums.map(album => (
            <div
              key={album.id}
              className="bg-gray-700 rounded-lg shadow p-4 flex flex-col items-center cursor-pointer hover:bg-gray-600 transition"
              onClick={() => navigate(`/albums/${album.id}`)}
            >
              <div className="text-lg font-semibold text-white mb-2">{album.title}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArtistPage;