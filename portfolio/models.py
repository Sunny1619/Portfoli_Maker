from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    education = models.TextField(blank=True, null=True)   # JSON string or plain text
    work = models.TextField(blank=True, null=True)        # JSON string or plain text
    github = models.URLField(blank=True, null=True)
    linkedin = models.URLField(blank=True, null=True)
    portfolio = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.user.username


class Skill(models.Model):
    profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="skills")
    name = models.CharField(max_length=100)
    level = models.CharField(max_length=50, blank=True, null=True)  # e.g. Beginner, Intermediate, Advanced

    def __str__(self):
        return f"{self.name} ({self.profile.user.username})"


class Project(models.Model):
    profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="projects")
    title = models.CharField(max_length=200)
    description = models.TextField()
    links = models.TextField(blank=True, null=True)  # JSON or comma-separated URLs
    skills = models.ManyToManyField(Skill, related_name="projects")

    def __str__(self):
        return f"{self.title} ({self.profile.user.username})"
