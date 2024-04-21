const { BigQuery } = require('@google-cloud/bigquery');
const { Firestore } = require('@google-cloud/firestore');

const firestore = new Firestore();
const bq = new BigQuery();

exports.processNewSearch = async (snap, context) => {
  const data = snap.data();  // This line was incorrect in the error logs provided.
  const { latitude, longitude, radius, email_address } = data;

  // Ensure radius is handled correctly, converting miles to meters for BigQuery.
  const radiusInMeters = radius * 1609.34;

  const query = `
    SELECT unique_key, date, block, primary_type, description, latitude, longitude
    FROM \`chicago-crimes-420200.chicago_crime.crime\`
    WHERE ST_DWITHIN(ST_GEOGPOINT(longitude, latitude), ST_GEOGPOINT(@longitude, @latitude), @radius)
    ORDER BY date DESC
    LIMIT 100;
  `;
  const options = {
    query: query,
    location: 'US',
    params: {
      longitude: longitude,
      latitude: latitude,
      radius: radiusInMeters
    }
  };

  try {
    const [rows] = await bq.query(options);
    if (rows.length > 0) {
      // Avoid duplication by adding results directly to a results collection
      const resultsRef = await firestore.collection('searchResults').add({
        searchId: context.params.docId,
        email_address: email_address,
        results: rows,
        timestamp: new Date().toISOString()
      });
      console.log(`Query results stored with ID: ${resultsRef.id}`);
    } else {
      console.log('No results found for the given parameters.');
    }
  } catch (error) {
    console.error('BigQuery Error:', error);
    throw new Error(`Error querying BigQuery: ${error}`);
  }
};
