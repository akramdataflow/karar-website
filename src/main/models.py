from django.db import models

def image_upload(instance, filename):
    imagename, extension = filename.split('.')
    return "post/%s.%s"%(instance.id, extension)

CATEGORY_CHOICES = [
    ('weddings', 'Weddings'),
    ('portraits', 'Portraits'),
    ('product', 'Product'),
    ('graduation', 'Graduation'),
    ('story', 'Story'),
    ('fashion', 'Fashion'),
]

# نموذج الألبوم
class Post(models.Model):
    name = models.CharField(max_length=255, unique=True)
    image = models.ImageField(upload_to=image_upload, unique=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='portraits')
    lift_side_content = models.TextField(null=True, blank=True)
    right_side_content = models.TextField(null=True, blank=True)    

    def __str__(self):
        return self.name

# وظيفة تحميل الصور المرتبطة بـ Gallery
def gallery_upload(instance, filename):
    imagename, extension = filename.split('.')
    return "gallery/%s/%s.%s" % (instance.name.id, imagename, extension)

# نموذج المعرض
class Gallery(models.Model):
    name = models.ForeignKey(Post, related_name='gallery_images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to=gallery_upload)

    

    def __str__(self):
        return f"Image for album: {self.name.name}"
    

class PostDetails(models.Model):
    name = models.OneToOneField(Post, on_delete=models.CASCADE, to_field='name', related_name='details_name')
    post = models.ImageField(upload_to=image_upload, unique=True)
    additional_info = models.TextField(null=True, blank=True)
    published_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name.name