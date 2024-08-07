# Ran Out of Compute Minutes


We ran out of compute minutes for our pipeline on gitlab, so for all new commits the pipeline failed since none of the jobs were created. When we still had compute minutes, the pipeline was successfully running, and you can find such a commit at sha: 33cb9e9f0c3d16aaa7b08b59a7032b5dd25f339d


# QuickBytes CICD Pipeline


This document summarizes the CI/CD pipeline for the QuickBytes project, focusing on the build and testing approach. The pipeline ensures that the application is built, tested, and deployed efficiently and reliably. The steps outlined below are designed to automate the process and maintain high code quality.


## Deployment


Our application is deployed with Netlify here: https://main--quickbytes-app.netlify.app/


All commits made to our main branch are automatically reflected in the deployed application. This is done through the Netlify configuration. We also deployed to Heroku in the actual automated pipeline but its not active or used due to the cost of Dyno formation.


## Frontend/Backend Pipeline


The CI/CD pipeline is designed to build, test, and deploy the application using Docker. Here’s a quick summary of the build and testing approach:


### .gitlab-ci.yml Overview


The `.gitlab-ci.yml` file  automates the build, push, deploy, and test stages for both the frontend and backend components of the application using Docker. 


### Structure


1.  **Global Configuration**:
    
    -   **Image**: Specifies the Docker image to be used (`docker:latest`).
    -   **Services**: Enables Docker-in-Docker service (`docker:dind`) for running Docker commands within the CI pipeline.
2.  **Before Script**:
    
    -   Logs in to Docker using credentials stored in CI/CD variables 
    -   Logs in to Heroku's container registry using `HEROKU_API_KEY`.
    
3.  **Stages**:
    
    -   **build**: Builds Docker images for the frontend and backend.
    -   **push**: Pushes the built Docker images to Docker Hub.
    -   **deploy**: Deploys the Docker images to Heroku.
    -   **test**: (Though not implemented in the provided file, it is listed as a stage).


### Jobs


1.  **build_backend**:
    
    -   **Stage**: `build`
    -   **Script**:
        -   Builds the Docker image for the backend from the `app/backend` directory.
        -   Pushes the built image to Docker Hub.
    -   **Trigger**: Runs only on the `main` branch.
2.  **build_frontend**:
    
    -   **Stage**: `build`
    -   **Script**:
        -   Builds the Docker image for the frontend from the `app/frontend` directory.
        -   Pushes the built image to Docker Hub.
    -   **Trigger**: Runs only on the `main` branch.
3.  **deploy_backend**:
    
    -   **Stage**: `deploy`
    -   **Script**:
        -   Pulls the backend Docker image from Docker Hub.
        -   Logs in to Heroku container registry using `HEROKU_API_KEY`.
        -   Tags the pulled image for Heroku and pushes it to the Heroku container registry.
        -   Updates the Heroku app (`quickbytes-backend`) with the new Docker image using Heroku API.
    -   **Trigger**: Runs only on the `main` branch.
4.  **deploy_frontend**:
    
    -   **Stage**: `deploy`
    -   **Script**:
        -   Pulls the frontend Docker image from Docker Hub.
        -   Tags the pulled image for Heroku and pushes it to the Heroku container registry.
        -   Updates the Heroku app (`quickbytes-frontend`) with the new Docker image using Heroku API.
    -   **Trigger**: Runs only on the `main` branch.


### Execution


To build and deploy the Docker images, the GitLab CI/CD pipeline will:


1.  Authenticate with Docker and Heroku registries.
2.  Build and push Docker images for the frontend and backend.
3.  Deploy the built images to Heroku, ensuring the latest versions are running.




1. **Dockerfile Overview**:
   - The Dockerfile is divided into multiple stages to optimize the build process:
     - **Testing Stage**: Installs dependencies and runs tests.
     - **Build Stage**: Builds the application if tests pass.
     - **Serving Stage**: Deploys the built application using Nginx.


2. **Build and Test Process**:
   - **Testing Stage**:
     - **Base Image**: Uses `node:22` as the base image.
     - **Dependencies**: Installs npm dependencies.
     - **Tests**: Runs `npm test` to execute all tests. If any test fails, the build process stops, preventing further stages from executing.
   - **Build Stage**:
     - **Base Image**: Uses `node:22`.
     - **Dependencies**: Re-installs npm dependencies to ensure a clean environment.
     - **Build**: Executes `npm run build` to compile the frontend application into production-ready code.
   - **Serving Stage**:
     - **Base Image**: Uses `nginx:alpine`.
     - **Deployment**: Copies the build output from the previous stage into the Nginx HTML directory.
     - **Configuration**: Exposes port 80 and runs the Nginx server to serve the application.


3. **Execution**:
   - **Build Command**: The Docker image is built by running the following command from the root directory of the project:
     ```bash
     docker build -t myapp .
     ```
   - **Docker Context**: The `.` at the end of the command specifies the build context as the current directory, ensuring all necessary files are included in the build process.


   The backend also has a dockerfile split up into similar stages.






4. **Benefits**:
   - **Automated Testing**: Ensures that only applications with passing tests are deployed.
   - **Multi-Stage Build**: Optimizes the build process by separating testing, building, and serving stages.
   - **Consistent Environment**: Uses Docker to create a consistent build and runtime environment, reducing the risk of environment-specific issues.


## Performance Testing

The QuickBytes CI/CD pipeline incorporates performance testing to ensure the application can handle user load efficiently. This is achieved using k6, an open-source tool for testing the performance of web applications.

The performance testing script (performanceTest.js) is designed to simulate user activity and measure the response times of the application. The primary goal is to ensure that the application remains responsive under load and meets performance benchmarks.

1. **Script Overview**:
   - The script simulates traffic to the main screen (root URL) of the application to verify its performance.
   - It tests whether the application is responding with a status code of 200 and checks that the response time is under 500ms for 95% of the requests.

2. **Test Configuration**:
   - **Stages**:
     - **Ramp-up**: The test begins by ramping up to 10 virtual users over 30 seconds.
     - **Steady State**: The test holds at 10 virtual users for 1 minute to simulate consistent traffic.
     - **Ramp-down**: Finally, the test ramps down to 0 users over 30 seconds.
   - **Thresholds**:
     - The test ensures that 95% of requests have a response time of less than 500ms.
     - Additionally, it checks that at least 95% of the requests pass the status and response time checks.

3. **Execution**:
   - The performance test is executed as part of the CI/CD pipeline using the following command:
     ```k6 run performanceTest.js
     ```
   - The script targets the deployed application at https://main--quickbytes-app.netlify.app/ to test its live performance.

4. **Benefits**:
   - **Load Simulation**: The test simulates real-world user activity to assess the application's performance under load.
   - **Performance Metrics**: By defining thresholds, the test helps identify performance bottlenecks before they impact users.



This approach helps maintain code quality and ensures that the application is deployed in a reliable and consistent manner.
