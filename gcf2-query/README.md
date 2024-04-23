gcloud functions deploy queryNearbyCrimes \
--entry-point queryNearbyCrimes \
--runtime nodejs18 \
--trigger-topic=user_search_topic

installs
// npm install @google-cloud/bigquery