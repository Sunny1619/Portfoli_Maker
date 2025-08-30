from django.contrib import admin
from .models import UserProfile, Skill, Project

admin.site.register(UserProfile)
admin.site.register(Skill)
admin.site.register(Project)
