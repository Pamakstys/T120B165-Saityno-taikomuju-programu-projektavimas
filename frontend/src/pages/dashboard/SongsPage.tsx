import React, { useEffect, useState } from 'react';
import { listSongs, deleteSong, isSongOwner } from './services/SongsService';
import type { Song } from '../../models/music';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../authentication/services';

const SongsPage: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>('user');
  const [songOwners, setSongOwners] = useState<Record<number, boolean>>({});
  const navigate = useNavigate();

  useEffect(() => {
    getCurrentUser()
      .then(user => setUserRole(user.role || 'user'))
      .catch(() => setUserRole('user'));
  }, []);

  useEffect(() => {
    listSongs()
      .then(async songsList => {
        setSongs(songsList);
        // Check ownership for each song if not admin
        if (userRole !== 'admin') {
          const ownerships: Record<number, boolean> = {};
          await Promise.all(
            songsList.map(async song => {
              try {
                const res = await isSongOwner(song.id);
                ownerships[song.id] = res.is_owner;
              } catch {
                ownerships[song.id] = false;
              }
            })
          );
          setSongOwners(ownerships);
        }
      })
      .catch(() => setError('Failed to load songs'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line
  }, [userRole]);

  const handleEdit = (id: number) => {
    navigate(`/songs/${id}/edit`);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this song?')) return;
    try {
      await deleteSong(id);
      setSongs(songs => songs.filter(song => song.id !== id));
    } catch {
      alert('Failed to delete song.');
    }
  };

  const canEditOrDelete = (songId: number) =>
    userRole === 'admin' || songOwners[songId];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <span className="text-white">Loading songs...</span>
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
      <h1 className="text-4xl font-bold text-white mb-8">Songs</h1>
      {songs.length === 0 ? (
        <div className="text-gray-400">No songs found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {songs.map(song => (
            <div
              key={song.id}
              className="bg-gray-800 rounded-lg shadow p-4 flex flex-col gap-2"
            >
              {song.cover_image && (
                <img
                  src={song.cover_image}
                  alt={song.title}
                  className="w-24 h-24 object-cover rounded mb-2 self-center max-w-[96px]"
                />
              )}
              <div className="text-xl font-semibold text-white">{song.title}</div>
              <div className="text-gray-400">{typeof song.album === 'object' ? song.album.title : ''}</div>
              <div className="text-gray-500 text-sm">
                Genre: {song.genre}
              </div>
              {song.duration && (
                <div className="text-gray-500 text-sm">
                  Duration: {song.duration}
                </div>
              )}
              {song.audio_file && (
                <div className="mt-2 flex flex-col items-center">
                  <audio
                    controls
                    src={song.audio_file}
                    className="w-full max-w-xs rounded bg-gray-700"
                    style={{
                      background: "#374151",
                      borderRadius: "0.5rem",
                      padding: "0.25rem 0.5rem",
                      outline: "none",
                    }}
                  >
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
              {canEditOrDelete(song.id) && (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleEdit(song.id)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(song.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-500 transition"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SongsPage;