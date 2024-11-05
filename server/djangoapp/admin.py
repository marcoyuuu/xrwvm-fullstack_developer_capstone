from django.contrib import admin
from .models import CarMake, CarModel


class CarModelInline(admin.TabularInline):
    """
    Inline admin descriptor for CarModel objects,
    allowing them to be edited within the CarMake admin page.
    """
    model = CarModel
    extra = 1  # Display 1 extra blank CarModel entry
    fields = ('name', 'type', 'year', 'dealer_id')  # Fields to display
    ordering = ['-year']  # Order by year, most recent first
    show_change_link = True  # Provide a link to edit each CarModel instance


@admin.register(CarModel)
class CarModelAdmin(admin.ModelAdmin):
    """
    Admin view for CarModel objects.
    Provides search functionality, list filters, and field display settings.
    """
    list_display = ('name', 'car_make', 'type', 'year', 'dealer_id')
    list_filter = ('type', 'year', 'car_make')  # Filter by type, year, and car make
    search_fields = ('name', 'car_make__name', 'dealer_id')  # Search by model name, car make name, and dealer ID
    ordering = ['car_make', '-year']  # Default ordering by car make and year
    list_per_page = 20  # Display 20 items per page for easy browsing


@admin.register(CarMake)
class CarMakeAdmin(admin.ModelAdmin):
    """
    Admin view for CarMake objects.
    Provides inline editing of CarModel instances and search functionality.
    """
    list_display = ('name', 'description', 'created_at', 'updated_at')
    search_fields = ('name',)  # Enable search by car make name
    inlines = [CarModelInline]  # Inline CarModel editing within CarMake admin
    list_per_page = 10  # Display 10 items per page for easy browsing
