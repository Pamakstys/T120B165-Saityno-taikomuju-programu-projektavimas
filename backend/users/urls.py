from django.urls import path, include
from .views import ChangePasswordView, RegisterView, LoginView, UserView, LogoutView

urlpatterns = [
    path('register', RegisterView.as_view()),
    path('login', LoginView.as_view()),
    path('user', UserView.as_view()),
    path('change-password', ChangePasswordView.as_view()),
    path('logout', LogoutView.as_view()),
]