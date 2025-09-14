from django.db import models

class Artist(models.Model):
    publisher = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='artists')
    name = models.CharField(max_length=100)
    bio = models.TextField(blank=True, null=True)
    birth_date = models.DateField(blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.name
    
class Album(models.Model):
    title = models.CharField(max_length=100)
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE, related_name='albums')
    release_date = models.DateField(blank=True, null=True)
    cover_image = models.ImageField(upload_to='albums/album_covers/', blank=True, null=True)

    def __str__(self):
        return f"{self.title} by {self.artist.name}"

class Song(models.Model):
    GENRES = [
        ('POP', 'Pop'),
        ('ROCK', 'Rock'),
        ('JAZZ', 'Jazz'),
        ('CLASSICAL', 'Classical'),
        ('HIPHOP', 'Hip-Hop'),
        ('COUNTRY', 'Country'),
        ('ELECTRONIC', 'Electronic'),
        ('OTHER', 'Other'),
    ]

    title = models.CharField(max_length=100)
    album = models.ForeignKey(Album, on_delete=models.CASCADE, related_name='songs', blank=True, null=True)
    release_date = models.DateField(blank=True, null=True)
    likes = models.IntegerField(default=0)
    duration = models.DurationField(blank=True, null=True)
    genre = models.CharField(max_length=100, choices=GENRES, default='OTHER')
    audio_file = models.FileField(upload_to='songs/audio/')
    cover_image = models.ImageField(upload_to='songs/covers/', blank=True, null=True)

    def __str__(self):
        return f"{self.title} by {self.album.artist.name}"