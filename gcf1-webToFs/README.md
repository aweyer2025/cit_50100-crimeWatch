gcloud functions deploy write_crimeWatcher \
--entry-point write_crimeWatcher \
--runtime nodejs18 \
--trigger-topic=crime_watch_signup



//installs
npm install @google-cloud/firestore
