from django.conf.urls import include
from django.urls import re_path, path
from rest_framework import routers
from .viewsets import FolderViewSet
from . import views

router = routers.DefaultRouter()
router.register(r'ff_item', FolderViewSet, basename='FolderViewSet')


urlpatterns = [
    re_path(r'^', include(router.urls)),
    path('send/', views.send, name='send'),
]