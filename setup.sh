#!/bin/bash
# This script automates the setup and launch process for the PoC application.

# Exit immediately if a command exits with a non-zero status.
set -e

# Get the root directory of the script
ROOT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

echo "--- Setting up Backend ---"
cd "$ROOT_DIR/backend"
npm install

echo "\n--- Setting up Frontend ---"
cd "$ROOT_DIR/frontend"
npm install

# Start the backend server in the background
cd "$ROOT_DIR/backend"
echo "\n--- Starting Backend Server in the background (http://localhost:8080) ---"
npm start &
BACKEND_PID=$!
echo "Backend server started with PID: $BACKEND_PID"

# Add a trap to kill the backend server on script exit
trap "echo '\n--- Shutting down backend server (PID: $BACKEND_PID) ---';kill $BACKEND_PID" EXIT

# Start the frontend server in the foreground
cd "$ROOT_DIR/frontend"
echo "\n--- Starting Frontend Development Server (http://localhost:3000) ---"
echo "Press Ctrl+C to stop both frontend and backend servers."
npm start
