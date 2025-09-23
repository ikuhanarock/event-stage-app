#!/bin/bash
# This script automates the initial setup of Google Cloud resources.

# Exit immediately if a command exits with a non-zero status.
set -e

# --- Configuration ---
# The script requires the following environment variables to be set:
# - GCP_PROJECT_ID: Your desired unique Google Cloud project ID.
# - GCS_BUCKET_NAME: Your desired unique Google Cloud Storage bucket name.
# - GCP_BILLING_ACCOUNT_ID: Your Google Cloud billing account ID.

if [ -z "$GCP_PROJECT_ID" ] || [ -z "$GCS_BUCKET_NAME" ] || [ -z "$GCP_BILLING_ACCOUNT_ID" ]; then
  echo "Error: Please set GCP_PROJECT_ID, GCS_BUCKET_NAME, and GCP_BILLING_ACCOUNT_ID environment variables."
  echo "You can create a .env file and run 'source .env' before executing this script."
  exit 1
fi

SA_NAME="event-stage-app-sa"
SA_EMAIL="$SA_NAME@$GCP_PROJECT_ID.iam.gserviceaccount.com"

echo "--- Using the following configuration ---"
echo "Project ID:         $GCP_PROJECT_ID"
echo "Bucket Name:        $GCS_BUCKET_NAME"
echo "Billing Account ID: $GCP_BILLING_ACCOUNT_ID"
echo "Service Account:    $SA_EMAIL"
echo "-----------------------------------------"

# Step 1: Project Creation & Configuration
echo "\n--- Step 1: Creating and configuring project '$GCP_PROJECT_ID' ---"
if ! gcloud projects describe "$GCP_PROJECT_ID" >/dev/null 2>&1; then
  gcloud projects create "$GCP_PROJECT_ID" --name="Event Stage App"
else
  echo "Project '$GCP_PROJECT_ID' already exists. Skipping creation."
fi
gcloud config set project "$GCP_PROJECT_ID"
gcloud billing projects link "$GCP_PROJECT_ID" --billing-account="$GCP_BILLING_ACCOUNT_ID"

# Step 2: Enabling APIs
echo "\n--- Step 2: Enabling required Google Cloud APIs ---"
gcloud services enable run.googleapis.com \
                       storage.googleapis.com \
                       aiplatform.googleapis.com \
                       iam.googleapis.com \
                       cloudbuild.googleapis.com

# Step 3: Cloud Storage Bucket Creation
echo "\n--- Step 3: Creating Cloud Storage bucket '$GCS_BUCKET_NAME' ---"
if ! gsutil ls -b "gs://$GCS_BUCKET_NAME" >/dev/null 2>&1; then
  gsutil mb -p "$GCP_PROJECT_ID" -l US-CENTRAL1 "gs://$GCS_BUCKET_NAME/"
  gsutil iam ch allUsers:objectViewer "gs://$GCS_BUCKET_NAME"
  echo "Bucket created and configured for public read access."
else
  echo "Bucket 'gs://$GCS_BUCKET_NAME' already exists. Skipping creation."
fi

# Step 4: Service Account Creation & Permissions
echo "\n--- Step 4: Creating Service Account and assigning roles ---"
if ! gcloud iam service-accounts describe "$SA_EMAIL" >/dev/null 2>&1; then
  gcloud iam service-accounts create "$SA_NAME" --display-name="Event Stage App Service Account"
else
  echo "Service Account '$SA_NAME' already exists. Skipping creation."
fi

echo "Assigning role 'roles/aiplatform.user'..."
gcloud projects add-iam-policy-binding "$GCP_PROJECT_ID" \
  --member="serviceAccount:$SA_EMAIL" \
  --role="roles/aiplatform.user" --condition=None >/dev/null

echo "Assigning role 'roles/storage.admin'..."
gcloud projects add-iam-policy-binding "$GCP_PROJECT_ID" \
  --member="serviceAccount:$SA_EMAIL" \
  --role="roles/storage.admin" --condition=None >/dev/null

echo "\n--- Google Cloud setup script finished successfully! ---"
