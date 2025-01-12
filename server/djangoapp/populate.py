# djangoapp/populate.py

from .models import CarMake, CarModel
import logging

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)  # Ensure logger captures debug-level logs

if not logger.handlers:
    handler = logging.StreamHandler()
    formatter = logging.Formatter('%(asctime)s %(levelname)s %(message)s')
    handler.setFormatter(formatter)
    logger.addHandler(handler)

def initiate():
    logger.info("Starting data population for CarMake and CarModel.")
    try:
        # Data for car makes with descriptions
        car_make_data = [
            {"name": "NISSAN", "description": "Innovative Japanese engineering"},
            {"name": "Mercedes", "description": "Premium German craftsmanship"},
            {"name": "Audi", "description": "Precision German technology"},
            {"name": "Kia", "description": "Advanced Korean engineering"},
            {"name": "Toyota", "description": "Reliability of Japanese manufacturing"},
        ]
        car_make_instances = []

        # Create CarMake instances and handle existing entries
        for data in car_make_data:
            car_make, created = CarMake.objects.get_or_create(
                name=data["name"],
                defaults={"description": data["description"]}
            )
            if created:
                logger.info(f"Created CarMake: {car_make.name}")
            else:
                logger.debug(f"CarMake already exists: {car_make.name}")
            car_make_instances.append(car_make)

        # Data for car models with types, year, and associated car make
        car_model_data = [
            {"name": "Pathfinder", "type": "SUV", "year": 2023, "car_make": car_make_instances[0]},
            {"name": "Qashqai", "type": "SUV", "year": 2023, "car_make": car_make_instances[0]},
            {"name": "XTRAIL", "type": "SUV", "year": 2023, "car_make": car_make_instances[0]},
            {"name": "A-Class", "type": "SUV", "year": 2023, "car_make": car_make_instances[1]},
            {"name": "C-Class", "type": "SUV", "year": 2023, "car_make": car_make_instances[1]},
            {"name": "E-Class", "type": "SUV", "year": 2023, "car_make": car_make_instances[1]},
            {"name": "A4", "type": "SUV", "year": 2023, "car_make": car_make_instances[2]},
            {"name": "A5", "type": "SUV", "year": 2023, "car_make": car_make_instances[2]},
            {"name": "A6", "type": "SUV", "year": 2023, "car_make": car_make_instances[2]},
            {"name": "Sorento", "type": "SUV", "year": 2023, "car_make": car_make_instances[3]},
            {"name": "Carnival", "type": "SUV", "year": 2023, "car_make": car_make_instances[3]},
            {"name": "Cerato", "type": "Sedan", "year": 2023, "car_make": car_make_instances[3]},
            {"name": "Corolla", "type": "Sedan", "year": 2023, "car_make": car_make_instances[4]},
            {"name": "Camry", "type": "Sedan", "year": 2023, "car_make": car_make_instances[4]},
            {"name": "Kluger", "type": "SUV", "year": 2023, "car_make": car_make_instances[4]},
        ]

        # Create CarModel instances and handle existing entries
        for data in car_model_data:
            car_model, created = CarModel.objects.get_or_create(
                name=data["name"],
                car_make=data["car_make"],
                defaults={"type": data["type"], "year": data["year"]}
            )
            if created:
                logger.info(f"Created CarModel: {car_model.car_make.name} {car_model.name} ({car_model.year})")
            else:
                logger.debug(f"CarModel already exists: {car_model.car_make.name} {car_model.name} ({car_model.year})")
    except Exception as e:
        logger.error(f"Error during data population: {e}")
