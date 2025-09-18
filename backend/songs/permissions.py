from rest_framework import permissions

class CustomRoleBasedPermission(permissions.BasePermission):
    """
    Allow or deny based on user role and HTTP method for APIView.
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        action = view.action

        if action in ['get_artist', 'list_artists', 'get_song', 'list_songs','list_songs_by_album', 'get_album', 'list_albums', 'list_albums_by_artist']:
            return request.user.is_authenticated

        if action in ['create_artist', 'edit_artist', 'delete_artist', 'my_artists', 'is_owner', 'create_song', 'edit_song','delete_song', 'create_album', 'edit_album', 'delete_album']:
            return request.user.role in ['admin', 'publisher']

        #Retrict default DRF's
        if action == 'list':
            return request.user.role in ['admin']

        if action == 'retrieve':
            return request.user.role in ['admin', 'user']

        if action == 'create':
            return request.user.role == 'admin'

        if action == 'update' or action == 'partial_update':
            return request.user.role == 'admin'

        if action == 'destroy':
            return request.user.role == 'admin'

        # Block unknown methods
        return False