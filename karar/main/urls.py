from django.urls import path
from . import views

urlpatterns = [
    path('', views.main, name='home'),
    path('gallery/<int:id>/', views.gallery, name='gallery'),
    path('blog/', views.blog, name='blog'),
    path('contact/', views.contact, name='contact'),
    path('about/', views.about, name='about'),
]
