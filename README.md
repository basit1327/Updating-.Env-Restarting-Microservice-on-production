
# Updating .env And restaring Node Microservice on Production
In NodeJS .env file is used to keep Credenitals/Keys used for running our application, Usally these Credenitals/Keys are different in UAT/Production
environment from development environment.

### Challenge
Challenge come when we are running our application which is getting configuration from .env file saved on server os. If we have to change e.g ```Google Map Key``` 
- In typicall way we go to server and change the .env file are restart the service.
- In this approach we have a configuration database and service are listening to this database.
    - This database is key/value database whose values are different for each environment.
    - And Credenitals to read this database is stored on Operation system Variables which make is super secure.

    
![Architecture](https://i.ibb.co/qJzc2vX/Service-path.png)
