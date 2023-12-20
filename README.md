# Todos

## Getting Started

1- install dependencies

```
$ npm i
```

2- starts a mysql instance on docker

```
$ docker-compose up
```

3- runs the application

```
$ npm start
```

**Additional commands:**

- execute the tests

```
$ npm run test
```

- makes a production ready app

```
$ npm run build
```

## Project Setup

- I used a monorepo for easier feature shipment and rollback strategies. While it is generally not recommended to have the front end and backend in the same repository, it is a good compromise for the scale of this project.

## Architecture

### **API**

- Docker was used to configure dependencies such as the database.
- A feature-based folder structure was implemented to improve readability and code reusability.
- Unit tests were implemented for the business logic and integration tests were performed at the API level.
- The business logic was decoupled from the HTTP API library (in this case, Express) to facilitate the migration of the logic to another library like Nest.js or Koa by using a wrapper function.
- Access management was centralized to ensure that handlers do not have direct access.
- Custom errors were created to enhance code readability.
- Sequelize was chosen over other ORMs like TypeORM due to its better performance and comprehensive query builder.
- Dependencies were managed as configurations to avoid hardcoded values. (Note: I would recommend referring to a project I did 4 years ago with OOP and dependency management: [tad-group/app-platform-be](https://github.com/tad-group/app-platform-be)). I have gained more experience since then and can now create simpler architectures with less complexity and more benefits.

### Web

- To increase code readability, reusability, and testability, the core components have been separated into the "modules" folder.
- Pages have been separated from components to allow them to freely use multiple modules without violating any programming principle.
- The API service consumers have been decoupled from the service class by leveraging react context. This improves testability and follows the singleton principle, making it more memory efficient and preventing redundant instance creation.
- React context has been leveraged to centralize shared data, such as the authentication result and services.

**NOTE:** While it would be possible to implement a design system to decouple components from UI elements like buttons and inputs, it was not prioritized due to time constraints.

### Models

The base object models should be shared across applications to avoid redundant models.

- Each module should implement interface segregation to only include the necessary properties.

### Logger

A separate package should be created to manage the logs. This package can be managed by a non-feature team, such as infra teams.

## What would I have done if I had more time

### API

- Implemented the full repository pattern.
- Added another service layer to decouple the business logic from the handlers. This ensures that the core business logic is fully decoupled from the environment it is being used in. Currently, the logic resides in the handlers, which return HTTP status codes.
- Configured a complete test environment, including test databases. Currently, the database methods are mocked.
- Integrated a dependency injection library like "inversify" to manage dependencies and adhere to the SOLID principles without cluttering the code.
- Adopted a fully object-oriented programming (OOP) approach for all parts of the application, providing functionalities that can be used by other teams, such as an SDK.
- Integrated with a monitoring system and created a log analysis service.
- Developed a notification service to send daily reminders to users about their upcoming tasks.

### Web

- Create end-to-end testing using Cypress
- Create unit tests
- Make use of the search functionalities implemented on the API level
- Used a better UI package than bootstrap
- Better error management.
- Improve UX
