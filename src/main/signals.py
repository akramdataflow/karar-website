from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Post  # استيراد النموذج

@receiver(post_save, sender=Post)
def compress_post_image(sender, instance, created, **kwargs):
    """
    ضغط الصورة الخاصة بالمنشور بعد حفظ الكائن.
    """
    if created and instance.image:
        instance.compress_image()  # ضغط الصورة
        instance.save()  # حفظ التغييرات بعد الضغط
