# Drive Bot Backend

This section is responsible for the service part. Here, docker-composite is used to deploy a database, a server for sending messages to Telegram, and a web server for interacting with the web app.

Docker files are configured for local development.

The easiest way to run your own bot is via docker-compose:

1. create and fill the .env file as specified in the .env.example;
2. start the containers by running the following command from the project directory: ```docker-compose up```.

Make sure docker and docker-compose are installed on your machine.

The section has the following folders and items:

1. base - the directory with database models and admin panel;
2. bot_conf - settings for launching Django and Telegram Bot;
3. docker_configs - files for running docker containers;
4. web_api -- folder for communicate with Web app 
5. run_bot.py - this is the file that starts the bot;
6. common.yml, docker-compose.yml, docker-entrypoint.sh, Dockerfile - files for running docker.

## run on server

Docker compose files can be used for deployment on a server by specifying additional 
variables in .env file (as in the example). This approach is not recommended for non-pet projects.

To deploy on a server, you also need a web server to serve static content (front-end part)
and proxy requests to the backend. You can use Nginx for these purposes.