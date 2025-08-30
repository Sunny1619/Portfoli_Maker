# Technical Issues Fix Guide

## Priority 1: Critical Fixes

### 1. Fix Database Configuration
```python
# meapi/settings.py
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",  # Fix: Use PostgreSQL
        "NAME": os.getenv("DB_NAME"),
        "USER": os.getenv("DB_USER"),
        "PASSWORD": os.getenv("DB_PASSWORD"),
        "HOST": os.getenv("DB_HOST", "127.0.0.1"),
        "PORT": os.getenv("DB_PORT", "5432"),  # Fix: PostgreSQL port
        "OPTIONS": {
            "init_command": "SET sql_mode='STRICT_TRANS_TABLES'",
        },
    }
}
```

### 2. Add Missing JWT App
```python
# meapi/settings.py
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # third-party
    "rest_framework",
    "rest_framework_simplejwt",  # Add this
    "corsheaders",
    # local
    "portfolio",
]
```

### 3. Fix RegisterPage Implementation
```javascript
// RegisterPage.js - Replace handleSubmit function
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  // Validate passwords match
  if (formData.password !== formData.confirmPassword) {
    setError('Passwords do not match');
    setLoading(false);
    return;
  }

  try {
    const response = await fetch('http://localhost:8000/auth/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: formData.email,
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    navigate('/login');
  } catch (err) {
    setError(err.message || 'Registration failed');
  } finally {
    setLoading(false);
  }
};
```

## Priority 2: Medium Fixes

### 4. Standardize API Usage
Replace all hardcoded URLs with:
```javascript
// Create API_BASE_URL constant usage
import { API_BASE_URL } from './utils/auth';
const response = await fetch(`${API_BASE_URL}/endpoint/`);
```

### 5. Add Error Handling to Backend Views
```python
# portfolio/views.py - Wrap get operations
def get_object(self):
    try:
        return UserProfile.objects.get(user=self.request.user)
    except UserProfile.DoesNotExist:
        UserProfile.objects.create(user=self.request.user)
        return UserProfile.objects.get(user=self.request.user)
```

### 6. Use Consistent Authentication
Replace manual fetch calls with authenticatedFetch:
```javascript
// In WorkExperiencePage, EducationPage, SocialLinksPage
import { authenticatedFetch } from './utils/auth';
const response = await authenticatedFetch(`${API_BASE_URL}/work-experience/`);
```

## Priority 3: Security & Production

### 7. Environment-Based Settings
```python
# settings.py
DEBUG = os.getenv("DJANGO_DEBUG", "False") == "True"
ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

### 8. Add Authentication Guards
```javascript
// Add to each protected page
useEffect(() => {
  if (!isAuthenticated()) {
    navigate('/login');
  }
}, [navigate]);
```

## Quick Fixes

### 9. Fix URL Consistency
```python
# portfolio/urls.py
path("skills/top/", UserTopSkillsView.as_view(), name="top-skills"),  # Add trailing slash
```

### 10. Remove Duplicate Import
```python
# settings.py - Remove one of these
from pathlib import Path
# import os  # Keep this one
# from pathlib import Path  # Remove this duplicate
```
