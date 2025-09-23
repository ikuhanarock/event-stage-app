#!/bin/bash
# This script pauses the Cloud Run service to save costs by blocking all external traffic.

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

echo "--- Pausing Cloud Run service '$SERVICE_NAME' in project '$GCP_PROJECT_ID' ---"

# Block all public traffic by setting ingress to internal-only
gcloud run services update $SERVICE_NAME \
  --region=$REGION \
  --ingress=internal

echo "\nService '$SERVICE_NAME' is now paused. It will not accept public traffic."
