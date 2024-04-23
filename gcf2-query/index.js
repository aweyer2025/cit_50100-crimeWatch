const { BigQuery } = require('@google-cloud/bigquery');

exports.queryNearbyCrimes = async (message, context) => {
  try {
    // Create a BigQuery client instance
    const bigquery = new BigQuery();
    const incoming = Buffer.from(message.data, 'base64').toString('utf-8');
    const parsedMsg = JSON.parse(incoming);

    const latitude=parsedMsg.latitude;
    const longitude = parsedMsg.longitude;
    const radius=parsedMsg.radius;




    // Define the SQL query using single quotes
    const query = `
      SELECT DISTINCT primary_type
      FROM (
          SELECT *,
              3959 * 2 * ASIN(
                  SQRT(
                      POWER(SIN((${latitude} - Latitude) * 3.14159265359 / 180 / 2), 2) +
                      COS(${latitude} * 3.14159265359 / 180) * COS(Latitude * 3.14159265359 / 180) *
                      POWER(SIN((${longitude} - Longitude) * 3.14159265359 / 180 / 2), 2)
                  )
              ) AS distance
          FROM \`chicago-crimes-420200.chicago_crime.crime\`
          WHERE CAST(Date AS DATE) >= DATE_SUB(CURRENT_DATE(), INTERVAL 1 YEAR)
      ) AS distances
      WHERE distance <= ${radius};
    `;

    // Run the query using the BigQuery client instance
    const [rows] = await bigquery.query(query);
    console.log(rows);
  } catch (error) {
    console.error(`Error executing query: ${error}`);
  }
};












// const { BigQuery } = require('@google-cloud/bigquery');
// const { Firestore } = require('@google-cloud/firestore');
// const { PubSub } = require('@google-cloud/pubsub');


// const firestore = new Firestore();
// const bq = new BigQuery();

// exports.processFirestoreData = async (snap, context) => {
//   try {
//     const data = snap.data();  
//     const { latitude, longitude, radius, email_address } = data;

//     // Ensure radius is handled correctly, converting miles to meters for BigQuery.
//     const radiusInMeters = radius * 1609.34;

//     const query = `
//       SELECT *
//       FROM (
//         SELECT *,
//           3959 * 2 * ASIN(
//             SQRT(
//               POWER(SIN((${latitude} - Latitude) * 3.14159265359 / 180 / 2), 2) +
//               COS(${latitude} * 3.14159265359 / 180) * COS(Latitude * 3.14159265359 / 180) *
//               POWER(SIN((${longitude} - Longitude) * 3.14159265359 / 180 / 2), 2)
//             )
//           ) AS distance
//         FROM \`chicago-crimes-420200.chicago_crime.crime\`
//         WHERE CAST(Date AS DATE) >= DATE_SUB(CURRENT_DATE(), INTERVAL 1 YEAR)
//       ) AS distances
//       WHERE distance <= ${radiusInMeters};`;

//     const options = {
//       query: query,
//       location: 'US',
//     };

//     const [rows] = await bq.query(options);
    
//     if (rows.length > 0) {
//       const resultsRef = await firestore.collection('searchResults').add({
//         searchId: context.params.docId,
//         email_address: email_address,
//         results: rows,
//         timestamp: new Date().toISOString()
//       });
//       console.log(`Query results stored with ID: ${resultsRef.id}`);
//     } else {
//       console.log('No results found for the given parameters.');
//     }
//   } catch (error) {
//     console.error('Error:', error);
//     throw new Error(`Error querying BigQuery: ${error}`);
//   }
// };
