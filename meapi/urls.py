from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from portfolio.views import RegisterView, api_root
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

# Simple health check for Railway - no Django complexity, no CSRF
@csrf_exempt
def simple_health(request):
    return JsonResponse({"status": "ok"})

urlpatterns = [
    path("admin/", admin.site.urls),

    # API Root
    path("", api_root, name="api_root"),

    # Simple health check for Railway
    path("health/", simple_health, name="simple_health"),

    # JWT Auth
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("auth/login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("", include("portfolio.urls")),
]
