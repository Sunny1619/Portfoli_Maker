from django.http import JsonResponse
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .models import UserProfile, Skill
from rest_framework.permissions import AllowAny
from rest_framework import generics, permissions
from .serializers import UserProfileSerializer, SkillSerializer, ProjectSerializer
from django.db.models import Count
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes

@api_view(['GET'])
@permission_classes([AllowAny])
def health(request):
    return Response({"status": "alive"}, status=200)

@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request):
    return Response({
        "message": "Portfolio API is running",
        "status": "active",
        "endpoints": {
            "health": "/health/",
            "profile": "/profile/",
            "skills": "/skills/",
            "projects": "/projects/",
            "auth": {
                "register": "/auth/register/",
                "login": "/auth/login/",
                "refresh": "/auth/refresh/"
            }
        }
    }, status=200)

class RegisterView(generics.CreateAPIView):
    permission_classes = [AllowAny]  # anyone can register

    def post(self, request, *args, **kwargs):
            username = request.data.get("username")
            password = request.data.get("password")
            email = request.data.get("email")
            first_name = request.data.get("first_name")
            last_name = request.data.get("last_name")

            if not username or not password:
                return Response({"error": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)

            if User.objects.filter(username=username).exists():
                return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)

            user = User.objects.create_user(username=username, email=email, password=password)
            if first_name:
                user.first_name = first_name
            if last_name:
                user.last_name = last_name
            user.save()
            UserProfile.objects.create(user=user)  # empty profile auto-created

            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
    

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # Always return the profile of the currently logged-in user
        try:
            return UserProfile.objects.get(user=self.request.user)
        except UserProfile.DoesNotExist:
            # Create profile if it doesn't exist
            return UserProfile.objects.create(user=self.request.user)

class UserSkillsView(generics.ListAPIView):
    serializer_class = SkillSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        try:
            user_profile = UserProfile.objects.get(user=self.request.user)
        except UserProfile.DoesNotExist:
            user_profile = UserProfile.objects.create(user=self.request.user)
        return user_profile.skills.all()

    def post(self, request, *args, **kwargs):
        try:
            user_profile = UserProfile.objects.get(user=self.request.user)
        except UserProfile.DoesNotExist:
            user_profile = UserProfile.objects.create(user=self.request.user)
        data = request.data
        # Accept either a single object or a list of objects
        if isinstance(data, dict):
            data = [data]
        serializer = SkillSerializer(data=data, many=True)
        if serializer.is_valid():
            # Save each skill with the correct profile
            skills = []
            for skill_data in serializer.validated_data:
                skill = Skill.objects.create(profile=user_profile, **skill_data)
                skills.append(skill)
            return Response(SkillSerializer(skills, many=True).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProjectsView(generics.ListAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        try:
            user_profile = UserProfile.objects.get(user=self.request.user)
        except UserProfile.DoesNotExist:
            user_profile = UserProfile.objects.create(user=self.request.user)
        skill_name = self.request.query_params.get('skill')
        queryset = user_profile.projects.all()
        if skill_name:
            queryset = queryset.filter(skills__name__iexact=skill_name)
        return queryset

    def post(self, request, *args, **kwargs):
        try:
            user_profile = UserProfile.objects.get(user=self.request.user)
        except UserProfile.DoesNotExist:
            user_profile = UserProfile.objects.create(user=self.request.user)
        skills_data = request.data.get('skills', [])
        # Create or get skills for the user
        skill_objs = []
        for skill in skills_data:
            skill_obj, created = Skill.objects.get_or_create(
                profile=user_profile,
                name=skill.get('name'),
                defaults={'level': skill.get('level')}
            )
            if not created and skill.get('level'):
                skill_obj.level = skill.get('level')
                skill_obj.save()
            skill_objs.append(skill_obj)
        # Remove skills from data for ProjectSerializer
        project_data = request.data.copy()
        project_data.pop('skills', None)
        serializer = ProjectSerializer(data=project_data)
        if serializer.is_valid():
            project = serializer.save(profile=user_profile)
            project.skills.set(skill_objs)
            return Response(ProjectSerializer(project).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserTopSkillsView(generics.ListAPIView):
    serializer_class = SkillSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        try:
            user_profile = UserProfile.objects.get(user=self.request.user)
        except UserProfile.DoesNotExist:
            user_profile = UserProfile.objects.create(user=self.request.user)
        # Annotate skills with project count and order by frequency
        return user_profile.skills.annotate(project_count=Count('projects')).order_by('-project_count')[:5]


# Simple views for work experience, education, and social links
class WorkExperienceView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            user_profile = UserProfile.objects.get(user=request.user)
        except UserProfile.DoesNotExist:
            user_profile = UserProfile.objects.create(user=request.user)
        return Response({"work": user_profile.work or ""})

    def post(self, request):
        try:
            user_profile = UserProfile.objects.get(user=request.user)
        except UserProfile.DoesNotExist:
            user_profile = UserProfile.objects.create(user=request.user)
        work_text = request.data.get('work', '')
        user_profile.work = work_text
        user_profile.save()
        return Response({"message": "Work experience saved", "work": work_text})


class EducationView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            user_profile = UserProfile.objects.get(user=request.user)
        except UserProfile.DoesNotExist:
            user_profile = UserProfile.objects.create(user=request.user)
        return Response({"education": user_profile.education or ""})

    def post(self, request):
        try:
            user_profile = UserProfile.objects.get(user=request.user)
        except UserProfile.DoesNotExist:
            user_profile = UserProfile.objects.create(user=request.user)
        education_text = request.data.get('education', '')
        user_profile.education = education_text
        user_profile.save()
        return Response({"message": "Education saved", "education": education_text})


class SocialLinksView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            user_profile = UserProfile.objects.get(user=request.user)
        except UserProfile.DoesNotExist:
            user_profile = UserProfile.objects.create(user=request.user)
        return Response({
            "github": user_profile.github or "",
            "linkedin": user_profile.linkedin or "", 
            "portfolio": user_profile.portfolio or ""
        })

    def post(self, request):
        try:
            user_profile = UserProfile.objects.get(user=request.user)
        except UserProfile.DoesNotExist:
            user_profile = UserProfile.objects.create(user=request.user)
        
        # Update individual fields if provided
        if 'github' in request.data:
            user_profile.github = request.data['github']
        if 'linkedin' in request.data:
            user_profile.linkedin = request.data['linkedin']
        if 'portfolio' in request.data:
            user_profile.portfolio = request.data['portfolio']
            
        user_profile.save()
        
        return Response({
            "message": "Social links saved",
            "github": user_profile.github or "",
            "linkedin": user_profile.linkedin or "",
            "portfolio": user_profile.portfolio or ""
        })







