# Event Stage Live PoC

This repository contains the Proof of Concept (PoC) application for the Event Stage Live viewer.

## Project Structure

- `/backend`: A Node.js + Express server designed to run on Cloud Run. It serves stage data after processing it with mock AI functions.
- `/frontend`: A React + Tailwind CSS mobile web application that displays the stage information.

## How to Run

### Prerequisites

- Node.js (v18 or later)
- npm

### Simplified Setup

This project includes a setup script to automate the installation and launch process.

1.  Navigate to the project root directory:
    ```sh
    cd event-stage-app
    ```

2.  Run the setup script:
    ```sh
    ./setup.sh
    ```

This script will:
- Install dependencies for both the backend and frontend.
- Start the backend server in the background (`http://localhost:8080`).
- Start the frontend development server in the foreground (`http://localhost:3000`).

Your browser should automatically open to `http://localhost:3000`.

To stop both servers, simply press `Ctrl+C` in the terminal where the script is running.

*Note: For a real deployment, you would need to set the `GCLOUD_PROJECT` and `GCS_BUCKET_NAME` environment variables and implement the `// TODO` sections in `backend/index.js`.*

