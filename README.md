# Event Stage Live PoC

This repository contains the Proof of Concept (PoC) application for the Event Stage Live viewer.

## Project Structure

- `/backend`: A Node.js + Express server designed to run on Cloud Run. It calls Vertex AI (Gemini, Imagen) and saves results to Cloud Storage.
- `/frontend`: A React + Tailwind CSS mobile web application that displays the stage information.

## How to Run Locally

### Prerequisites

- Node.js (v18 or later)
- npm

### Simplified Setup

This project includes a setup script to automate the local installation and launch process.

1.  Navigate to the project root directory.

2.  Run the setup script:
    ```sh
    ./setup.sh
    ```

This script will:
- Install dependencies for both the backend and frontend.
- Start the backend server in the background (`http://localhost:8080`).
- Start the frontend development server in the foreground (`http://localhost:3000`).

*Note: For the backend to connect to Google Cloud services from your local machine, you must first complete the **Google Cloud Setup** steps below and configure your `backend/.env` file.*

---

## Google Cloud Setup & Deployment

This section describes how to set up the necessary Google Cloud infrastructure and deploy the backend service to Cloud Run.

### 1. Manual Prerequisites

- **Install Google Cloud SDK:** Make sure the `gcloud` command-line tool is [installed](https://cloud.google.com/sdk/docs/install) on your machine.
- **Authenticate:** Log in to your Google account.
  ```sh
  gcloud auth login
  ```
- **Get Your Billing Account ID:** Find your billing account ID, as it is required to create a new project. Note it down for the next step.
  ```sh
  gcloud billing accounts list
  ```

### 2. Configure and Run the Setup Script

This project includes a script (`gcp_setup.sh`) to automate the creation of most Google Cloud resources.

1.  **Create a `.env` file** in the project root for the script to use. You can copy the example file:
    ```sh
    cp gcp_setup.env.example .env
    ```

2.  **Edit the `.env` file** and provide the following values:
    - `GCP_PROJECT_ID`: A **globally unique** ID for your new Google Cloud project (e.g., `event-stage-app-2025`).
    - `GCS_BUCKET_NAME`: A **globally unique** name for your new Cloud Storage bucket (e.g., `event-stage-app-videos-2025`).
    - `GCP_BILLING_ACCOUNT_ID`: The ID you noted down in the prerequisite step.

3.  **Run the setup script:**
    ```sh
    chmod +x gcp_setup.sh
    source .env
    ./gcp_setup.sh
    ```
    This script will create your project, enable APIs, create a public Cloud Storage bucket, and set up a service account with the correct permissions.

### 3. Deploy the Backend to Cloud Run

After the setup script is complete, deploy the backend service:

```sh
# Make sure you are using the correct project ID
export GCP_PROJECT_ID=$(grep GCP_PROJECT_ID .env | cut -d '=' -f2)

gcloud run deploy event-stage-backend \
  --source ./backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --service-account="event-stage-app-sa@$GCP_PROJECT_ID.iam.gserviceaccount.com"
```

When deployment is finished, it will output a **Service URL**. This is the public URL of your backend API.

### 4. Configure Local Development (Optional)

If you want to run the backend on your local machine while connecting to your live Google Cloud services, you need to create a service account key.

1.  **Create and download a key:**
    ```sh
    export GCP_PROJECT_ID=$(grep GCP_PROJECT_ID .env | cut -d '=' -f2)

    gcloud iam service-accounts keys create ./service-account-key.json \
      --iam-account="event-stage-app-sa@$GCP_PROJECT_ID.iam.gserviceaccount.com"
    ```

2.  **Configure the backend:**
    - Copy `backend/.env.example` to `backend/.env`.
    - Fill in the `GCLOUD_PROJECT` and `GCS_BUCKET_NAME` values.
    - Set `GOOGLE_APPLICATION_CREDENTIALS` to the path of the key file you just created (e.g., `../service-account-key.json`).