from django.urls import path

from . import views
from .views import UserRegisterView, UserLoginView, GetUserInfor, DeleteUser

urlpatterns = [
    path('register', UserRegisterView.as_view(), name='register'),
    path('login', UserLoginView.as_view(), name='login'),
    path('get-user-infor', GetUserInfor.as_view()),
    path('delete-user', DeleteUser.as_view()),
]
