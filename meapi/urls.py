from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from portfolio.views import health, RegisterView, api_root
from django.http import JsonResponse

# Simple health check that bypasses Django views (backup)
def simple_health(request):
    return JsonResponse({"status": "ok", "service": "railway-health"})

urlpatterns = [
    path("admin/", admin.site.urls),

    # API Root
    path("", api_root, name="api_root"),

    # Health checks (multiple endpoints for Railway compatibility)
    path("health/", health, name="health"),
    path("healthcheck/", health, name="healthcheck"),  # Alternative endpoint
    path("ping/", simple_health, name="simple_health"),  # Simple backup health check

    # JWT Auth
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("auth/login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("", include("portfolio.urls")),
]
