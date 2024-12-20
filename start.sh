if [ ! -d "./node_modules" ]; then
  echo "node_modules not found. Installing dependencies..."
  npm install
  npm run build
else
  echo "node_modules exists. Skipping npm install."
fi

echo "Starting the application..."
node dist/main.js