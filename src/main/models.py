from django.db import models
from PIL import Image
from io import BytesIO
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.core.files.base import ContentFile

def image_upload(instance, filename):
    imagename, extension = filename.split('.')
    return "post/%s.%s" % (instance.id, extension)

CATEGORY_CHOICES = [
    ('weddings', 'Weddings'),
    ('portraits', 'Portraits'),
    ('product', 'Product'),
    ('graduation', 'Graduation'),
    ('story', 'Story'),
    ('fashion', 'Fashion'),
]

class Post(models.Model):
    name = models.CharField(max_length=255, unique=True)
    image = models.ImageField(upload_to=image_upload, unique=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='portraits')
    lift_side_content = models.TextField(null=True, blank=True)
    right_side_content = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name
    

    def compress_image(self):
        if self.image:
            try:
                img = Image.open(self.image)
                img = img.convert("RGB")
                img.thumbnail((800, 800), Image.Resampling.LANCZOS)

                buffer = BytesIO()
                img.save(buffer, format="JPEG", quality=70)
                buffer.seek(0)

                self.image.save(f"compressed_{self.image.name}", ContentFile(buffer.read()), save=False)
            except Exception as e:
                print(f"Error compressing image: {e}")


# إشارة لضغط الصور
@receiver(pre_save, sender=Post)
def compress_image_on_save(sender, instance, **kwargs):
    """
    ضغط الصورة أثناء الحفظ.
    """
    if instance.image:
        try:
            # فتح الصورة
            img = Image.open(instance.image)
            img = img.convert("RGB")  # تحويل الصورة إلى صيغة RGB
            img.thumbnail((800, 800), Image.Resampling.LANCZOS)  # تصغير الحجم

            # إنشاء ملف جديد للصورة المضغوطة
            buffer = BytesIO()
            img.save(buffer, format="JPEG", quality=70)  # ضغط الصورة بجودة 70%
            buffer.seek(0)

            # استبدال الصورة الحالية بالصورة المضغوطة
            instance.image.save(f"compressed_{instance.image.name}", ContentFile(buffer.read()), save=False)

        except Exception as e:
            print(f"Error compressing image: {e}")

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