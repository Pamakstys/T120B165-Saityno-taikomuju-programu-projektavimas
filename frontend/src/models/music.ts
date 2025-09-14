export interface Artist {
  id: number;
  name: string;
  bio?: string | null;
  birth_date?: string | null;
  country?: string | null;
}

export interface Album {
  id: number;
  title: string;
  artist: Artist | number;
  release_date?: string | null;
  cover_image?: string | null; 
  songs?: Song[];
}

export type Genre =
  | 'POP'
  | 'ROCK'
  | 'JAZZ'
  | 'CLASSICAL'
  | 'HIPHOP'
  | 'COUNTRY'
  | 'ELECTRONIC'
  | 'OTHER';

export interface Song {
  id: number;
  title: string;
  album: Album | number; 
  release_date?: string | null; 
  likes: number;
  duration?: string | null; 
  genre: Genre;
  audio_file: string; 
  cover_image?: string | null;
}