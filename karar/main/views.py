from django.shortcuts import render
from .models import Post

# Create your views here.

def main(request):
    post_list = Post.objects.all()
    context = {'postes':post_list}
    return render(request, 'post/index.html', context)