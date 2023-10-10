import json

from rest_framework.viewsets import ModelViewSet
from base.models import FileItem, MountInstance
from rest_framework import serializers
from django_filters.rest_framework import FilterSet, NumberFilter
from rest_framework.decorators import action
from rest_framework.response import Response
from urllib import parse

from .utils import get_telegram_user



class FolderSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileItem
        fields = [
            'id', 'user', 'parent', 'name',
            'datetime_change', 'type', 'message_format', 'text',
        ]


class FolderViewSet(ModelViewSet):
    # permission_classes = [Permission]
    serializer_class = FolderSerializer
    # queryset = FileItem.objects.all()
    # filterset_class = FolderFilter
    # pagination_class = LimitOffsetPagination



    # def create(self, request, *args, **kwargs):
    #     from rest_framework import status
    #     from rest_framework.response import Response
    #     from rest_framework.settings import api_settings
    #
    #     serializer = self.get_serializer(data=request.data)
    #     print('serializer', request.data, serializer, serializer.is_valid())
    #
    #     serializer.is_valid(raise_exception=True)
    #     self.perform_create(serializer)
    #     headers = self.get_success_headers(serializer.data)
    #     return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


    def get_queryset(self):
        parent_folder_id = self.request.query_params.get('parent_id')
        file_folder_type = self.request.query_params.get('type')

        telegram_user = get_telegram_user(self.request)

        subfolders = FileItem.objects.filter(user_id=telegram_user['id'])
        if parent_folder_id is not None:
            if parent_folder_id:
                subfolders = subfolders.filter(parent_id=parent_folder_id)
            else:
                subfolders = subfolders.filter(parent_id__isnull=True)

        if file_folder_type in [FileItem.TYPE_FOLDER, FileItem.TYPE_FILE]:
            subfolders = subfolders.filter(type=file_folder_type)

        return subfolders

    @action(detail=False, methods=['get'])
    def get_path(self, request, *args, **kwargs):

        item_id = str(request.query_params.get('item_id', ''))
        telegram_user = get_telegram_user(request)
        request_user_id = telegram_user['id']

        if item_id.isdigit():
            file_folder_item = FileItem.objects.get(id=item_id)
        else:
            file_folder_item = FileItem.objects.get(
                user_id=request_user_id,
                parent__isnull=True
            )

        ancestors = [file_folder_item]

        if file_folder_item.parent_id is not None:
            ancestors = list(file_folder_item.get_ancestors(include_self=True))
            if file_folder_item.user_id != request_user_id:
                ancestors_list = list(ancestors)
                mount_instance = MountInstance.objects.filter(
                    share_content__folder__in=ancestors_list,
                    user_id=request_user_id
                ).select_related('share_content', 'mount_folder').first()

                if mount_instance:
                    while len(ancestors_list) and ancestors_list[0].id != mount_instance.share_content.folder_id:
                        ancestors_list.pop(0)

                    self_folders = list(mount_instance.mount_folder.get_ancestors(include_self=True))
                    ancestors = self_folders + ancestors_list

        serializer = self.get_serializer(ancestors, many=True)
        return Response(serializer.data)


