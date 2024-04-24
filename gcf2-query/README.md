gcloud functions deploy crimeQuery \
  --runtime=nodejs18 \
  --region=us-central1 \
  --source=. \
  --entry-point=queryNearbyCrimes \
  --trigger-http \
  --allow-unauthenticated



FUNCTION_TARGET=queryNearbyCrimes npx @google-cloud/functions-framework
installs
// npm install @google-cloud/bigquery