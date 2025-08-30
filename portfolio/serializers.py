from rest_framework import serializers
from .models import UserProfile, Skill, Project
from django.contrib.auth.models import User

# Serializer for Skills
class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['name', 'level']

# Serializer for Projects
class ProjectSerializer(serializers.ModelSerializer):
    skills = SkillSerializer(many=True, read_only=True)  # Nested skills inside project

    class Meta:
        model = Project
        fields = ['title', 'description', 'links', 'skills']

# Serializer for User (optional, to show username/email)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

# Main UserProfile Serializer
class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)      # Nested user info
    skills = SkillSerializer(many=True, read_only=True)
    projects = ProjectSerializer(many=True, read_only=True)

    class Meta:
        model = UserProfile
        fields = ['user', 'education', 'work', 'github', 'linkedin', 'portfolio', 'skills', 'projects']
