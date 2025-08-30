from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from portfolio.views import health, RegisterView, api_root

urlpatterns = [
    path("admin/", admin.site.urls),

    # API Root
    path("", api_root, name="api_root"),

    # Health check
    path("health/", health, name="health"),

    # JWT Auth
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("auth/login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("", include("portfolio.urls")),
]
