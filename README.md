# Getting Started with Gen Express App

This project was bootstrapped with [Gen Express App](https://github.com/Dalufishe/gen-express-app).

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.\
Open [http://localhost:8081](http://localhost:8081) to view it in your browser.

The port can be modified in the .env.development file.
This mode includes a hot reloader.

### `npm run start`

### `npm run build && node ./dist/sequelize_tests.js`

Runs my lazy initializer script and populates the DB.

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The port can be modified in the .env file.
This mode utilizes an optimized build.

## Learn More

You can learn more in the [Gen Express App Github README](https://github.com/Dalufishe/gen-express-app).

## Additional notes

I have gone way off the rails from the standard MDN tutorial. The MDN tutorial uses plain Javascript. I have used Gen-Express-App to initialize an Express app with Typescript. I have also deviated from the tutorial by using MariaDB and Sequelize. This replaces the MongoDB and Mongoose dependencies in the original MDN tutorial. The goal of this was to force use of any gained knowledge removing the temptation to copy-paste tutorial code.

This ultimately created code and sometimes logic that is incompatible with a MongoDB/Mongoose route. This is because MongoDB is a NoSQL DB. Sequelize also introduces different method calls and query building.

I have also built out a lazy initializer script. I call it lazy because I used RNG to fill out the fields of objects. That means almost everything has a random number.

The DB is containerized using Podman because I wanted practice with Podman. You can find the connection credentials in `models/sqlize.ts`. Change it as needed. The project isn't intended to be connected to the internet. Use hardcoded values at your own risk.
