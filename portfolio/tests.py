from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from .models import UserProfile, Skill, Project

class APITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.profile = UserProfile.objects.create(user=self.user)
        self.client.force_authenticate(user=self.user)

    def test_get_skills(self):
        Skill.objects.create(profile=self.profile, name='Python', level='Advanced')
        url = reverse('skills')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['results'][0]['name'], 'Python')

    def test_post_skills(self):
        url = reverse('skills')
        data = {'name': 'Django', 'level': 'Intermediate'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data[0]['name'], 'Django')

    def test_get_projects(self):
        skill = Skill.objects.create(profile=self.profile, name='Python')
        project = Project.objects.create(profile=self.profile, title='Proj1', description='Desc')
        project.skills.add(skill)
        url = reverse('projects')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['results'][0]['title'], 'Proj1')

    def test_post_projects(self):
        url = reverse('projects')
        data = {
            'title': 'Proj2',
            'description': 'Desc2',
            'skills': [{'name': 'Django', 'level': 'Intermediate'}]
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'Proj2')

    def test_get_projects_filter_by_skill(self):
        skill1 = Skill.objects.create(profile=self.profile, name='Python')
        skill2 = Skill.objects.create(profile=self.profile, name='Django')
        project1 = Project.objects.create(profile=self.profile, title='Proj1', description='Desc')
        project2 = Project.objects.create(profile=self.profile, title='Proj2', description='Desc2')
        project1.skills.add(skill1)
        project2.skills.add(skill2)
        url = reverse('projects') + '?skill=Python'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['results'][0]['title'], 'Proj1')

    def test_get_top_skills(self):
        skill1 = Skill.objects.create(profile=self.profile, name='Python')
        skill2 = Skill.objects.create(profile=self.profile, name='Django')
        project1 = Project.objects.create(profile=self.profile, title='Proj1', description='Desc')
        project2 = Project.objects.create(profile=self.profile, title='Proj2', description='Desc2')
        project1.skills.add(skill1)
        project2.skills.add(skill1)
        project2.skills.add(skill2)
        url = reverse('top-skills')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['results'][0]['name'], 'Python')
