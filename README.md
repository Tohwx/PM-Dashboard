# PM Dashboard

Dashboard web application powered by MERN stack.

## Backend

Schema for data can be found under [src/backend/models](src/backend/models)

Set up database with mongo, with the right port number

Set the port number to expose the API of the database in [src/backend/api/index.js](src/backend/api/index.js) and [/src/backend/server/index.js](/src/backend/server/index.js)

Serve the database with:

> nodemon ./src/backend/server/index.js

**TODO**: write script to upload to database from csv

## Frontend

Once database is ready, use the following command at the root directory to start the web server (default port is 3000)

> npm run start

## Editing Code

-   Retrieve information from the database via API calls: [src/backend/server/controllers](src/backend/server/controllers) and [src/backend/server/routes](src/backend/server/routes)
-   React code for the various tables can be found here: [src/components/Tables.js](src/components/Tables.js)
-   Dashboard page can be found here: [src/pages/dashboard/DashboardOverview.js](src/pages/dashboard/DashboardOverview.js)
-   Routes can be found here: [src/routes.js](src/routes.js) and pages here: [src/pages/HomePage.js](src/pages/HomePage.js)
