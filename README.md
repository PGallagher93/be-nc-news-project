# Northcoders News API

Link to hosted version: https://nc-news-app-bch2.onrender.com/

SUMMARY: Allows user to seed a database and then retrieve data through various endpoints on the host URL.

USAGE: 
Installing Dependencies: 
    Input the command "npm install" into the command line in order to install the required dependencies.

Seeding Local Database:
    Input the command "npm run seed" into the command line in order to seed
    the local database.

Cloning The Repo:
    Input the command "git clone https://github.com/PGallagher93/be-nc-news-project.git" into the command line in order to clone the repo locally.

Running Tests:
    Input the command "npm run test" into the command line in order to run the tests.


CREATING .ENV FILES:
    Two files will need to be created in order for the application to run. First create a .env.development file and inside write "PGDATABASE=<database name>".
    Then create a second .env.production file and inside write
    "DATABASE_URL=<database URL>

 
REQUIREMENTS:
    Minimum node version required: v18.13.0
    Minimum Postgress version required: 15.3