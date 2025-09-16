from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import viewsets, permissions, status
from .models import Album, Artist, Song
from .serializers import AlbumSerializer, ArtistSerializer, SongSerializer
from django.shortcuts import get_object_or_404
from .permissions import CustomRoleBasedPermission


class ArtistViewSet(viewsets.ModelViewSet):
    queryset = Artist.objects.all()
    serializer_class = ArtistSerializer
    permission_classes = [CustomRoleBasedPermission]

    @action(detail=False, methods=['get'], url_path='get')
    def get_artist(self, request):
        artist_id = request.query_params.get('id')
        if not artist_id:
            return Response({"error": "Artist ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        artist = get_object_or_404(Artist, id=artist_id)
        serializer = self.get_serializer(artist)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='list')
    def list_artists(self, request):
        artists = Artist.objects.all()
        serializer = self.get_serializer(artists, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], url_path='create')
    def create_artist(self, request):
        user = request.user

        if user.role not in ['publisher']:
            return Response({"error": "Only publishers can create artists"}, status=status.HTTP_403_FORBIDDEN)

        data = request.data.copy()
        data['publisher'] = user.id
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='edit')
    def edit_artist(self, request):
        artist_id = request.query_params.get('id')
        if not artist_id:
            return Response({"error": "Artist ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        artist = get_object_or_404(Artist, id=artist_id)
        serializer = self.get_serializer(artist, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['delete'], url_path='delete')
    def delete_artist(self, request):
        artist_id = request.query_params.get('id')
        if not artist_id:
            return Response({"error": "Artist ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        artist = get_object_or_404(Artist, id=artist_id)
        artist.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=False, methods=['get'], url_path='my_artists')
    def my_artists(self, request):
        user = request.user
        if user.role not in ['publisher']:
            return Response({"error": "Only publishers can access their artists"}, status=status.HTTP_403_FORBIDDEN)

        artists = Artist.objects.filter(publisher=request.user)
        serializer = self.get_serializer(artists, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='is_owner')
    def is_owner(self, request):
        artist_id = request.query_params.get('id')
        if not artist_id:
            return Response({"error": "Artist ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        if user.role != 'publisher':
            return Response({"is_owner": False})

        artist = get_object_or_404(Artist, id=artist_id)
        is_owner = artist.publisher == request.user
        return Response({"is_owner": is_owner})

class SongViewSet(viewsets.ModelViewSet):
    queryset = Song.objects.all()
    serializer_class = SongSerializer
    permission_classes = [CustomRoleBasedPermission]

    @action(detail=False, methods=['get'], url_path='get')
    def get_song(self, request):
        song_id = request.query_params.get('id')
        if not song_id:
            return Response({"error": "Song ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        song = get_object_or_404(Song, id=song_id)
        serializer = self.get_serializer(song)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='list')
    def list_songs(self, request):
        songs = Song.objects.all()
        serializer = self.get_serializer(songs, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='list_by_album')
    def list_songs_by_album(self, request):
        album_id = request.query_params.get('album_id')
        if not album_id:
            return Response({"error": "Album ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        songs = Song.objects.filter(album_id=album_id)
        serializer = self.get_serializer(songs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], url_path='create')
    def create_song(self, request):
        album_id = request.data.get('album_id')
        if not album_id:
            return Response({"error": "Album ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        data = request.data.copy()
        data['album'] = album_id

        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'], url_path='edit')
    def edit_song(self, request):
        song_id = request.query_params.get('id')
        if not song_id:
            return Response({"error": "Song ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        song = get_object_or_404(Song, id=song_id)
        serializer = self.get_serializer(song, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['delete'], url_path='delete')
    def delete_song(self, request):
        song_id = request.query_params.get('id')
        if not song_id:
            return Response({"error": "Song ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        song = get_object_or_404(Song, id=song_id)
        song.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=False, methods=['get'], url_path='is_owner')
    def is_owner(self, request):
        song_id = request.query_params.get('id')
        if not song_id:
            return Response({"error": "Song ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        if user.role != 'publisher':
            return Response({"is_owner": False})

        song = get_object_or_404(Song, id=song_id)
        is_owner = song.album.artist.publisher == request.user
        return Response({"is_owner": is_owner})

class AlbumViewSet(viewsets.ModelViewSet):
    queryset = Album.objects.all()
    serializer_class = AlbumSerializer
    permission_classes = [CustomRoleBasedPermission]

    @action(detail=False, methods=['get'], url_path='is_owner')
    def is_owner(self, request):
        album_id = request.query_params.get('id')
        if not album_id:
            return Response({"error": "Album ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        if user.role != 'publisher':
            return Response({"is_owner": False})

        album = get_object_or_404(Album, id=album_id)
        is_owner = album.artist.publisher == request.user
        return Response({"is_owner": is_owner})

    @action(detail=False, methods=['get'], url_path='get')
    def get_album(self, request):
        album_id = request.query_params.get('id')
        if not album_id:
            return Response({"error": "Album ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        album = get_object_or_404(Album, id=album_id)
        serializer = self.get_serializer(album)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='list')
    def list_albums(self, request):
        albums = Album.objects.all()
        serializer = self.get_serializer(albums, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='list_by_artist')
    def list_albums_by_artist(self, request):
        artist_id = request.query_params.get('artist_id')
        if not artist_id:
            return Response({"error": "Artist ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        albums = Album.objects.filter(artist_id=artist_id)
        serializer = self.get_serializer(albums, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], url_path='create')
    def create_album(self, request):
        artist_id = request.data.get('artist_id')
        if not artist_id:
            return Response({"error": "Artist ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        data = request.data.copy()
        data['artist'] = artist_id
    
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'], url_path='edit')
    def edit_album(self, request):
        album_id = request.query_params.get('id')
        if not album_id:
            return Response({"error": "Album ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        album = get_object_or_404(Album, id=album_id)
        serializer = self.get_serializer(album, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['delete'], url_path='delete')
    def delete_album(self, request):
        album_id = request.query_params.get('id')
        if not album_id:
            return Response({"error": "Album ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        album = get_object_or_404(Album, id=album_id)
        album.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)