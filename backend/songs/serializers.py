from rest_framework import serializers
from .models import Album, Song , Artist

class ArtistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artist
        fields = '__all__'

class AlbumSerializer(serializers.ModelSerializer):
    cover_image = serializers.ImageField(required=False)

    class Meta:
        model = Album
        fields = '__all__'

class SongSerializer(serializers.ModelSerializer):
    audio_file = serializers.FileField(required=False)
    cover_image = serializers.ImageField(required=False)

    class Meta:
        model = Song
        fields = '__all__'