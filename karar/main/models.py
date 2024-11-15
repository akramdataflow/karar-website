from django.db import models



# Create your models here.
class Post(models.Model):
    name = models.CharField(max_length=255)
    image = models.ImageField(upload_to='postes/')


    def __str__(self) -> str:
        return self.name