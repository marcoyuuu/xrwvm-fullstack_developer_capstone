# djangoapp/models.py

from django.db import models
from django.utils import timezone
from django.core.validators import MaxValueValidator, MinValueValidator

CURRENT_YEAR = timezone.now().year


class CarMake(models.Model):
    """
    Model representing the car make information.
    Attributes:
        name (str): The name of the car make.
        description (str): A brief description of the car make.
        created_at (datetime): Date when the car make was created.
        updated_at (datetime): Date when the car make was last updated.
    """
    name = models.CharField(
        max_length=100,
        unique=True,
        help_text="Unique name of the car make.")
    description = models.TextField(
        blank=True, help_text="Optional description of the car make.")
    created_at = models.DateTimeField(
        default=timezone.now,
        help_text="Date when the car make was created.")
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Date when the car make was last updated.")

    def __str__(self):
        # Display name and partial description for readability
        return f"{self.name} - {self.description[:30]}"


class CarModel(models.Model):
    """
    Model representing the car model details.
    Attributes:
        car_make (ForeignKey): ForeignKey to the CarMake model (many-to-one relationship).
        dealer_id (int): ID that relates to the dealer in an external database.
        name (str): Name of the car model.
        type (str): Type of the car model (Sedan, SUV, etc.).
        year (int): Year the model was manufactured.
        created_at (datetime): Date when the car model was created.
        updated_at (datetime): Date when the car model was last updated.
    """
    CAR_TYPES = [
        ('SEDAN', 'Sedan'),
        ('SUV', 'SUV'),
        ('WAGON', 'Wagon'),
        # Add other types if needed
    ]

    car_make = models.ForeignKey(
        CarMake,
        related_name='models',
        on_delete=models.CASCADE,
        help_text="Car make associated with this model."
    )
    dealer_id = models.PositiveIntegerField(
        help_text="Reference ID of the dealer.")
    name = models.CharField(max_length=100, help_text="Name of the car model.")
    type = models.CharField(
        max_length=10,
        choices=CAR_TYPES,
        default='SUV',
        help_text="Type of the car model (e.g., Sedan, SUV, Wagon)."
    )
    year = models.PositiveIntegerField(
        validators=[
            MaxValueValidator(CURRENT_YEAR),
            MinValueValidator(1980)
        ],
        help_text=f"Year the car model was manufactured (1980 - {CURRENT_YEAR})."
    )
    created_at = models.DateTimeField(
        default=timezone.now,
        help_text="Date when the car model was created.")
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Date when the car model was last updated.")

    def __str__(self):
        # Display car make, model name, and year for clarity
        return f"{self.car_make.name} {self.name} ({self.year})"
