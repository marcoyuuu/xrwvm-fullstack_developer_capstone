# Generated by Django 5.1.4 on 2025-01-12 19:14

import django.core.validators
import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='CarMake',
            fields=[
                ('id',
                 models.BigAutoField(
                     auto_created=True,
                     primary_key=True,
                     serialize=False,
                     verbose_name='ID')),
                ('name',
                 models.CharField(
                     help_text='Unique name of the car make.',
                     max_length=100,
                     unique=True)),
                ('description',
                 models.TextField(
                     blank=True,
                     help_text='Optional description of the car make.')),
                ('created_at',
                 models.DateTimeField(
                     default=django.utils.timezone.now,
                     help_text='Date when the car make was created.')),
                ('updated_at',
                 models.DateTimeField(
                     auto_now=True,
                     help_text='Date when the car make was last updated.')),
            ],
        ),
        migrations.CreateModel(
            name='CarModel',
            fields=[
                ('id',
                 models.BigAutoField(
                     auto_created=True,
                     primary_key=True,
                     serialize=False,
                     verbose_name='ID')),
                ('dealer_id',
                 models.PositiveIntegerField(
                     help_text='Reference ID of the dealer.')),
                ('name',
                 models.CharField(
                     help_text='Name of the car model.',
                     max_length=100)),
                ('type',
                 models.CharField(
                     choices=[
                         ('SEDAN',
                          'Sedan'),
                         ('SUV',
                          'SUV'),
                         ('WAGON',
                          'Wagon')],
                     default='SUV',
                     help_text='Type of the car model (e.g., Sedan, SUV, Wagon).',
                     max_length=10)),
                ('year',
                 models.PositiveIntegerField(
                     help_text='Year the car model was manufactured (1980 - 2025).',
                     validators=[
                         django.core.validators.MaxValueValidator(2025),
                         django.core.validators.MinValueValidator(1980)])),
                ('created_at',
                 models.DateTimeField(
                     default=django.utils.timezone.now,
                     help_text='Date when the car model was created.')),
                ('updated_at',
                 models.DateTimeField(
                     auto_now=True,
                     help_text='Date when the car model was last updated.')),
                ('car_make',
                 models.ForeignKey(
                     help_text='Car make associated with this model.',
                     on_delete=django.db.models.deletion.CASCADE,
                     related_name='models',
                     to='djangoapp.carmake')),
            ],
        ),
    ]
