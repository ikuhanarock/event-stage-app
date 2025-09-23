#!/bin/bash
# This script resumes the Cloud Run service by allowing public traffic again.

set -e

if [ -f .env ]; then
  source .env
fi

if [ -z "$GCP_PROJECT_ID" ]; then
  echo "Error: GCP_PROJECT_ID is not set. Please ensure it is in your .env file."
  exit 1
fi

SERVICE_NAME="event-stage-backend"
REGION="us-central1"

echo "--- Resuming Cloud Run service '$SERVICE_NAME' in project '$GCP_PROJECT_ID' ---"

# Allow all public traffic by setting ingress to all
gcloud run services update $SERVICE_NAME \
  --region=$REGION \
  --ingress=all

echo "\nService '$SERVICE_NAME' is now resumed. It can accept public traffic."
