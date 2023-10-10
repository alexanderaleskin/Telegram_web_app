from django.contrib import admin

from .models import User, FileItem, MountInstance, ShareLink

admin.site.register(MountInstance)
admin.site.register(ShareLink)


@admin.register(FileItem)
class AdminFolder(admin.ModelAdmin):
    list_display = ('id', 'name', 'user', 'parent')
    list_filter = ('user', 'name')


@admin.register(User)
class AdminUser(admin.ModelAdmin):
    list_display = ('id', 'first_name', 'last_name')
    list_filter = ('first_name', 'last_name')

