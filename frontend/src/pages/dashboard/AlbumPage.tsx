import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAlbum, deleteAlbum, isAlbumOwner } from './services/AlbumsService';
import { listSongsByAlbum } from './services/SongsService';
import type { Album, Song } from '../../models/music';
import { getCurrentUser } from '../authentication/services';

const AlbumPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [album, setAlbum] = useState<Album | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
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
        getAlbum(Number(id)),
        listSongsByAlbum(Number(id)),
        isAlbumOwner(Number(id))
      ])
        .then(([albumData, songsData, ownerData]) => {
          setAlbum(albumData);
          setSongs(songsData);
          setIsOwner(ownerData.is_owner);
        })
        .catch(() => setError('Failed to load album'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const canEditOrDelete = userRole === 'admin' || isOwner;

  const handleEdit = () => {
    if (id) navigate(`/albums/${id}/edit`);
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm('Are you sure you want to delete this album?')) return;
    try {
      await deleteAlbum(Number(id));
      navigate('/albums');
    } catch {
      alert('Failed to delete album.');
    }
  };

  const handleAddSong = () => {
    if (id) navigate(`/albums/${id}/add`);
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
      <div className="bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center">
        {album.cover_image && (
          <img
            src={album.cover_image}
            alt={album.title}
            className="w-48 h-48 object-cover rounded mb-4 max-w-[96px]"
          />
        )}
        <h2 className="text-3xl font-bold text-white mb-2">{album.title}</h2>
        <div className="text-gray-400 mb-2">
          {typeof album.artist === 'object' ? album.artist.name : ''}
        </div>
        {album.release_date && (
          <div className="text-gray-500 text-sm mb-4">
            Released: {album.release_date}
          </div>
        )}
        <div className="flex items-center justify-between w-full mb-2">
          <h3 className="text-xl text-white mt-6 mb-2">Songs</h3>
          {canEditOrDelete && (
            <button
              onClick={handleAddSong}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 transition"
            >
              + Add Song
            </button>
          )}
        </div>
        {songs.length > 0 ? (
          <ul className="w-full">
            {songs.map((song: Song) => (
              <li
                key={song.id}
                className="flex flex-col md:flex-row justify-between items-center py-2 border-b border-gray-700 gap-2"
              >
                <div className="flex items-center gap-3">
                  {song.cover_image && (
                    <img
                      src={song.cover_image}
                      alt={song.title}
                      className="w-12 h-12 object-cover rounded max-w-[96px]"
                    />
                  )}
                  <span className="text-white">{song.title}</span>
                </div>
                <span className="text-gray-400 text-sm">{song.duration || ''}</span>
                {song.audio_file && (
                  <audio controls src={song.audio_file} className="mt-2 md:mt-0">
                    Your browser does not support the audio element.
                  </audio>
                )}
                {canEditOrDelete && (
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => navigate(`/songs/${song.id}/edit`)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={async () => {
                        if (!window.confirm('Are you sure you want to delete this song?')) return;
                        try {
                          await import('./services/SongsService').then(({ deleteSong }) =>
                            deleteSong(song.id)
                          );
                          setSongs(songs => songs.filter(s => s.id !== song.id));
                        } catch {
                          alert('Failed to delete song.');
                        }
                      }}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-500 transition"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-400">No songs in this album.</div>
        )}
      </div>
    </div>
  );
};

export default AlbumPage;