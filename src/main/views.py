from django.shortcuts import render, get_object_or_404
from .models import Post, Gallery, PostDetails
from django.shortcuts import render

from .signals import compress_post_image  # تأكد من استيراد الإشارة بشكل صحيح

def main(request):
    """
    عرض الصفحة الرئيسية مع الصور.
    """
    # الحصول على كل المنشورات
    post_list = Post.objects.all()

    # إعداد السياق لتمريره إلى القالب
    context = {'postes': post_list}
    return render(request, 'home-4.html', context)

def portfolio(request):
    post_list = Post.objects.all()
    context = {'postes':post_list}
    return render(request, 'portfolio.html', context)    

def gallery(request, id):
    post = get_object_or_404(Post, id=id)
    images = Gallery.objects.filter(name=post)  
    post_list = Post.objects.filter(name=post)  
    context = {'post': post, 'images': images, 'post_list':post_list}
    return render(request, 'gallery.html', context)

def blog(request):
    post_list = PostDetails.objects.all()
    context = {'postes':post_list}
    return render(request, 'blog.html', context)

def contact(request):
    return render(request, 'contact.html')

def about(request):
    return render(request, 'about-me.html')