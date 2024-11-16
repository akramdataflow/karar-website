from django.contrib import admin

# Register your models here.

from .models import Post, Gallery, PostDetails

admin.site.register(Post)
admin.site.register(Gallery)
admin.site.register(PostDetails)