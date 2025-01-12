from .models import CarMake, CarModel


def initiate():
    """
    Populate CarMake and CarModel data into the database.
    Checks if data already exists to avoid duplicate entries.
    """
    car_make_data = [
        {"name": "NISSAN", "description": "Innovative Japanese engineering"},
        {"name": "Mercedes", "description": "Premium German craftsmanship"},
        {"name": "Audi", "description": "Precision German technology"},
        {"name": "Kia", "description": "Advanced Korean engineering"},
        {"name": "Toyota", "description": "Reliability of Japanese manufacturing"},
    ]
    car_make_instances = []
    for data in car_make_data:
        car_make, created = CarMake.objects.get_or_create(
            name=data["name"],
            defaults={"description": data["description"]}
        )
        car_make_instances.append(car_make)
    car_model_data = [
        {"name": "Pathfinder", "type": "SUV", "year": 2023,
         "car_make": car_make_instances[0]},
        {"name": "Qashqai", "type": "SUV", "year": 2023,
         "car_make": car_make_instances[0]},
        {"name": "XTRAIL", "type": "SUV", "year": 2023,
         "car_make": car_make_instances[0]},
        {"name": "A-Class", "type": "SUV", "year": 2023,
         "car_make": car_make_instances[1]},
        {"name": "C-Class", "type": "SUV", "year": 2023,
         "car_make": car_make_instances[1]},
        {"name": "E-Class", "type": "SUV", "year": 2023,
         "car_make": car_make_instances[1]},
        {"name": "A4", "type": "SUV", "year": 2023,
         "car_make": car_make_instances[2]},
        {"name": "A5", "type": "SUV", "year": 2023,
         "car_make": car_make_instances[2]},
        {"name": "A6", "type": "SUV", "year": 2023,
         "car_make": car_make_instances[2]},
        {"name": "Sorento", "type": "SUV", "year": 2023,
         "car_make": car_make_instances[3]},
        {"name": "Carnival", "type": "SUV", "year": 2023,
         "car_make": car_make_instances[3]},
        {"name": "Cerato", "type": "Sedan", "year": 2023,
         "car_make": car_make_instances[3]},
        {"name": "Corolla", "type": "Sedan", "year": 2023,
         "car_make": car_make_instances[4]},
        {"name": "Camry", "type": "Sedan", "year": 2023,
         "car_make": car_make_instances[4]},
        {"name": "Kluger", "type": "SUV", "year": 2023,
         "car_make": car_make_instances[4]},
    ]
    for data in car_model_data:
        CarModel.objects.get_or_create(
            name=data["name"],
            car_make=data["car_make"],
            defaults={
                "type": data["type"],
                "year": data["year"],
                "dealer_id": 0
            }
        )
