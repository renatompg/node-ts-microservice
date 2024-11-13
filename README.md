# Request Logging Microservice

## Overview

This microservice is built using Node.js and TypeScript to log incoming requests, track their statuses (success or failure), and provide statistics about the processed calls. It uses Redis for caching request details and PostgreSQL for persistent storage.

### Features

- **Log Requests:** Logs incoming requests based on their status (success or failure).
- **Track Statistics:** Provides statistics on the total number of calls, successful calls, and failed calls.
- **Redis Caching:** Caches request data in Redis, including the total calls, successes, and failures.
- **PostgreSQL Integration:** Stores request details (path, start time, finish time, and result) in a PostgreSQL database for persistent storage.
- **Batching and Flushing:** Every 5 requests, cached data is flushed to PostgreSQL for efficiency.

### Endpoints

- **POST /create/:status**
  - **Description:** Logs the request with the given status (`success` or `failure`).
  - **Path Parameter:**
    - `status`: The status of the request (`success` or `failure`).
  - **Response:**
    - 200: Request processed successfully.
    - 400: Invalid status.
    - 500: Internal server error.

- **GET /stats/status**
  - **Description:** Retrieves statistics for total, successful, and failed calls.
  - **Response:**
    - 200: Returns the statistics (total calls, successes, and failures).
    - 500: Error retrieving statistics.

## Setup and Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/request-logging-microservice.git
    cd request-logging-microservice
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Docker Compose Setup:**
   This project includes a Docker Compose configuration to run the microservice, Redis, and PostgreSQL together. Ensure Docker and Docker Compose are installed. To build and run the services:

     ```bash
     docker-compose up --build
     ```

   - This will start the following services:
     - **Microservice**: Node.js app running on port 3000.
     - **Redis**: For caching request logs.
     - **PostgreSQL**: For persistent storage of request details.

4. **PostgreSQL Access Credentials:**
   When running the services with Docker Compose, the PostgreSQL database will be configured with the following credentials:

   - **Username**: `user`
   - **Password**: `password`
   - **Database**: `microservice`

   You can use these credentials to connect to PostgreSQL either from within the Docker container or externally.

5. **Access the Swagger API Documentation:**

   Once the application is running, you can access the API documentation at:


## Code Overview
1. **Request Controller:**
createRequest: Handles POST requests to /create/:status, logs request data, and stores it in Redis. Every 5 requests, cached data is flushed to PostgreSQL.
getStats: Handles GET requests to /stats/status, retrieves and returns the statistics (total calls, successes, and failures) from Redis.

2. **Redis Database:**
redisClient: A Redis client is used to track request logs in a list (request_logs), and increment counters for total calls, successes, and failures.

3. **PostgreSQL Integration:**
pgClient: Connects to PostgreSQL and inserts request details into a table (request) with fields such as path, start_time, finish_time, and result.

4. **Cache Service:**
flushCacheToDatabase: Flushed cached request data to PostgreSQL in batches of 5.

5. **Swagger Documentation:**
The API is documented using Swagger for easy integration and testing. Access it at /api-docs endpoint after running the microservice.

Running the Application Locally
Make sure Docker is running on your system.
Use Docker Compose to start the services.
Access the application on http://localhost:3000.
License
This project is licensed under the MIT License.

## Contact
For any issues or questions, feel free to open an issue in the repository or contact renatompg@gmail.com.
