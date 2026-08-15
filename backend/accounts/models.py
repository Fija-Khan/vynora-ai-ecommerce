from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):

    ROLE_CHOICES = (
        ('customer', 'Customer'),
        ('admin', 'Admin'),
    )

    email = models.EmailField(unique=True)

    phone = models.CharField(
        max_length=15,
        blank=True
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='customer'
    )

    profile_image = models.ImageField(
        upload_to='profiles/',
        blank=True,
        null=True
    )

    def __str__(self):
        return self.username