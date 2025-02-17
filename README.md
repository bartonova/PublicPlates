# 🏷️ Plates

A full-stack monolithic application for managing plates, signs, and registrations across various countries.

---

## 🚀 Development Setup

### Prerequisites
Ensure the following dependencies are installed before starting development:

- **[Node.js](https://nodejs.org/)** - Required for running the development server and building the project.
- **[Gradle](https://gradle.org/)** - Used for managing Java dependencies and building the backend.

### Install Dependencies
After installing Node.js, install project dependencies by running:

```sh
npm install
```

We use **npm scripts** and **Webpack** as the build system.

### Running the Development Server
Run the following commands in separate terminals:

```sh
./gradlew -x webpack
npm start
```

Your browser will auto-refresh upon file changes.

---

## 📱 Progressive Web App (PWA) Support

To enable service worker functionality, uncomment the following in `src/main/webapp/index.html`:

```html
<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js').then(() => {
      console.log('Service Worker Registered');
    });
  }
</script>
```

---

## 📦 Packaging & Deployment

### JAR Build
To build and optimize the application for production, run:

```sh
./gradlew -Pprod clean bootJar
```

Run the packaged JAR:

```sh
java -jar build/libs/*.jar
```

Access the application at [http://localhost:8080](http://localhost:8080).

### WAR Build
For deployment to an application server, package as a WAR file:

```sh
./gradlew -Pprod -Pwar clean bootWar
```

---

## 🧪 Testing

### Backend Tests
Run unit and integration tests with:

```sh
./gradlew test integrationTest jacocoTestReport
```

### Client Tests
Client-side unit tests are managed with **Jest** and **Jasmine**:

```sh
npm test
```

### Code Quality
Run a **SonarQube** analysis:

```sh
docker-compose -f src/main/docker/sonar.yml up -d
./gradlew -Pprod clean check jacocoTestReport sonarqube
```

---

## 🐳 Dockerized Development (Optional)

### Start Database
Spin up a MariaDB container:

```sh
docker-compose -f src/main/docker/mariadb.yml up -d
```

Stop and remove the container:

```sh
docker-compose -f src/main/docker/mariadb.yml down
```

### Fully Dockerized Application
Build a Docker image:

```sh
./gradlew bootJar -Pprod jibDockerBuild
```

Run the application using Docker Compose:

```sh
docker-compose -f src/main/docker/app.yml up -d
```

---

🔹 **Happy coding!** 🏷️🚀
