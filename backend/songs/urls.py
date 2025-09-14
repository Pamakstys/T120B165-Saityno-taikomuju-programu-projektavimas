from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ArtistViewSet, SongViewSet, AlbumViewSet

router = DefaultRouter()
router.register(r'artists', ArtistViewSet)
router.register(r'songs', SongViewSet)
router.register(r'albums', AlbumViewSet)

urlpatterns = [
    path('', include(router.urls)),
]