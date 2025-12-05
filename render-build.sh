#!/bin/bash
set -e

echo "Installing backend dependencies..."
cd backend
npm install
echo "Backend ready for deployment"
