from django.urls import path
from .views import (
    UserProfileView, UserSkillsView, UserProjectsView, UserTopSkillsView,
    WorkExperienceView, EducationView, SocialLinksView, health
)

urlpatterns = [
    path("health", health, name="health"),
    path("profile/", UserProfileView.as_view(), name="profile"),
    path("skills/", UserSkillsView.as_view(), name="skills"),
    path("skills/top/", UserTopSkillsView.as_view(), name="top-skills"),
    path("projects/", UserProjectsView.as_view(), name="projects"),
    path("work-experience/", WorkExperienceView.as_view(), name="work-experience"),
    path("education/", EducationView.as_view(), name="education"),
    path("social-links/", SocialLinksView.as_view(), name="social-links"),
]
