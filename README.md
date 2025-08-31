# Portfolio Maker 🚀

A full-stack web application that allows users to create, manage, and showcase their professional portfolios with projects, skills, work experience, and education information.

## 🌐 Live Demo

- **Frontend**: https://portfoli-maker.vercel.app/
- **Backend API**: https://portfolimaker-production.up.railway.app/

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React.js 19.1.1 with React Router
- **Backend**: Django 5.2.4 with Django REST Framework
- **Database**: MySQL 8.0
- **Authentication**: JWT (JSON Web Tokens)
- **Deployment**: 
  - Frontend: Vercel
  - Backend: Railway
  - Database: Railway MySQL

### System Architecture

```
┌─────────────────┐    HTTP/HTTPS     ┌─────────────────┐
│   React.js      │◄─────────────────►│   Django REST   │
│   Frontend      │     API Calls     │   Framework     │
│   (Vercel)      │                   │   (Railway)     │
└─────────────────┘                   └─────────────────┘
                                               │
                                               │ Database
                                               │ Queries
                                               ▼
                                      ┌─────────────────┐
                                      │   MySQL         │
                                      │   Database      │
                                      │   (Railway)     │
                                      └─────────────────┘
```

### Project Structure

```
me-api/
├── frontend/                 # React.js frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── utils/          # Authentication utilities
│   │   ├── config/         # API configuration
│   │   └── pages/          # Page components
│   ├── public/             # Static assets
│   └── build/              # Production build
├── meapi/                   # Django project settings
│   ├── settings.py         # Main configuration
│   ├── urls.py            # URL routing
│   └── wsgi.py            # WSGI application
├── portfolio/               # Main Django app
│   ├── models.py          # Database models
│   ├── views.py           # API views
│   ├── serializers.py     # DRF serializers
│   └── urls.py            # App URLs
├── manage.py               # Django management
├── requirements.txt        # Python dependencies
├── Procfile               # Railway deployment
└── railway.json           # Railway configuration
```

## 📊 Database Schema

### Entity Relationship Diagram

```sql
User (Django Auth)
├── id (PK)
├── username
├── email
├── password
└── first_name, last_name

UserProfile
├── id (PK)
├── user_id (FK → User)
├── education (TEXT)
├── work (TEXT)
├── github (URL)
├── linkedin (URL)
└── portfolio (URL)

Skill
├── id (PK)
├── profile_id (FK → UserProfile)
├── name (VARCHAR 100)
└── level (VARCHAR 50)

Project
├── id (PK)
├── profile_id (FK → UserProfile)
├── title (VARCHAR 200)
├── description (TEXT)
└── links (TEXT, JSON)

Project_Skills (M2M)
├── project_id (FK → Project)
└── skill_id (FK → Skill)
```

### Key Relationships
- **User ↔ UserProfile**: One-to-One
- **UserProfile ↔ Skills**: One-to-Many
- **UserProfile ↔ Projects**: One-to-Many
- **Projects ↔ Skills**: Many-to-Many

## 🚀 Setup Instructions

### Prerequisites
- Python 3.11+
- Node.js 16+
- MySQL 8.0+
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sunny1619/Portfoli_Maker.git
   cd Portfoli_Maker
   ```

2. **Create virtual environment**
   ```bash
   python -m venv .venv
   # Windows
   .venv\Scripts\activate
   # macOS/Linux
   source .venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment variables**
   Create `.env` file in root directory:
   ```env
   DEBUG=True
   SECRET_KEY=your-secret-key-here
   
   # Database
   MYSQLDATABASE=portfolio_db
   MYSQLHOST=localhost
   MYSQLPASSWORD=your-password
   MYSQLPORT=3306
   MYSQLUSER=your-username
   
   # CORS (for development)
   CORS_ALLOW_ALL_ORIGINS=True
   ```

5. **Database setup**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   python manage.py createsuperuser
   ```

6. **Run development server**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API endpoint**
   Update `frontend/src/config/api.js`:
   ```javascript
   export const API_BASE_URL = 'http://localhost:8000';
   ```

4. **Start development server**
   ```bash
   npm start
   ```

## 📡 API Documentation

### Authentication Endpoints

#### Register User
```bash
curl -X POST http://localhost:8000/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpassword123",
    "first_name": "John",
    "last_name": "Doe"
  }'
```

#### Login
```bash
curl -X POST http://localhost:8000/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "testpassword123"
  }'
```

**Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com"
  }
}
```

### Profile Endpoints

#### Get User Profile
```bash
curl -X GET http://localhost:8000/profile/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Update Work Experience
```bash
curl -X POST http://localhost:8000/work-experience/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "work": "Software Engineer at TechCorp\n2022-Present\n\n• Developed web applications\n• Led team of 3 developers"
  }'
```

#### Update Education
```bash
curl -X POST http://localhost:8000/education/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "education": "Computer Science, B.S.\nUniversity of Technology\n2018-2022\nGPA: 3.8/4.0"
  }'
```

### Project Endpoints

#### Create Project
```bash
curl -X POST http://localhost:8000/projects/add/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Portfolio Website",
    "description": "A full-stack portfolio application\nBuilt with React and Django\n\nFeatures:\n• User authentication\n• Project management\n• Responsive design",
    "links": "[{\"type\":\"GitHub\",\"url\":\"https://github.com/user/project\"},{\"type\":\"Live Demo\",\"url\":\"https://project.vercel.app\"}]",
    "skills": [
      {"name": "React", "level": "Advanced"},
      {"name": "Django", "level": "Intermediate"},
      {"name": "MySQL", "level": "Intermediate"}
    ]
  }'
```

#### Get User Projects
```bash
curl -X GET http://localhost:8000/projects/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Skills Endpoints

#### Add Skills
```bash
curl -X POST http://localhost:8000/skills/add/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "skills": [
      {"name": "Python", "level": "Advanced"},
      {"name": "JavaScript", "level": "Advanced"},
      {"name": "React", "level": "Intermediate"}
    ]
  }'
```

#### Get User Skills
```bash
curl -X GET http://localhost:8000/skills/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Social Links Endpoints

#### Update Social Links
```bash
curl -X POST http://localhost:8000/social-links/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "github": "https://github.com/username",
    "linkedin": "https://linkedin.com/in/username",
    "portfolio": "https://myportfolio.com"
  }'
```

## 🔧 Key Features

### ✅ Implemented Features
- **User Authentication**: Registration, login, JWT-based auth
- **Profile Management**: Complete profile creation and editing
- **Project Showcase**: Add, edit, delete projects with multiple links
- **Skills Management**: Categorized skills with proficiency levels
- **Work Experience**: Rich text formatting with line breaks
- **Education**: Academic background with formatting support
- **Social Links**: GitHub, LinkedIn, portfolio integration
- **Responsive Design**: Mobile-first, cross-device compatibility
- **Real-time Updates**: Dynamic content updates without page refresh

### 🎨 UI/UX Features
- Clean, modern interface
- Intuitive navigation
- Form validation and error handling
- Loading states and feedback
- Responsive grid layouts
- Professional color scheme

## ⚠️ Known Limitations

### Current Limitations
1. **File Uploads**: No support for image/document uploads
2. **Rich Text Editor**: Basic textarea input only (no WYSIWYG)
3. **Export Options**: No PDF/resume export functionality
4. **Search/Filter**: No search or filtering capabilities
5. **Public Profiles**: Profiles are not publicly accessible via direct links
6. **Email Verification**: No email verification during registration
7. **Password Reset**: No forgot password functionality
8. **Bulk Operations**: No bulk import/export of data

### Technical Limitations
1. **Caching**: No Redis/caching layer for improved performance
2. **Rate Limiting**: No API rate limiting implemented
3. **Pagination**: Large datasets may affect performance
4. **Real-time Updates**: No WebSocket support for live updates
5. **Backup System**: No automated backup system
6. **Monitoring**: No application monitoring/logging system

### Security Considerations
1. **CORS**: Currently allows all origins (development setting)
2. **Input Sanitization**: Basic validation, could be enhanced
3. **SQL Injection**: Protected by Django ORM, but custom queries need review
4. **XSS Protection**: Basic React protection, no additional sanitization

## 🔮 Future Enhancements

### Planned Features
- [ ] **Portfolio Templates**: Multiple design themes
- [ ] **Public Portfolio URLs**: Shareable portfolio links
- [ ] **Resume Export**: PDF generation from portfolio data
- [ ] **Image Upload**: Profile pictures and project screenshots
- [ ] **Analytics**: Portfolio view tracking
- [ ] **SEO Optimization**: Meta tags and social sharing
- [ ] **Dark Mode**: Theme switching capability
- [ ] **Multi-language**: Internationalization support

### Technical Improvements
- [ ] **Caching Layer**: Redis implementation
- [ ] **API Documentation**: Swagger/OpenAPI integration
- [ ] **Testing**: Comprehensive test coverage
- [ ] **CI/CD Pipeline**: Automated testing and deployment
- [ ] **Performance**: Database optimization and query efficiency
- [ ] **Security**: Enhanced validation and sanitization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Sunny Kumar Pandit**
- GitHub: [@Sunny1619](https://github.com/Sunny1619)
- LinkedIn: [Connect with me](https://linkedin.com/in/your-profile)

## 🙏 Acknowledgments

- Django REST Framework documentation
- React.js community
- Railway and Vercel for hosting
- All contributors and users

---

**Built with ❤️ using Django + React**
