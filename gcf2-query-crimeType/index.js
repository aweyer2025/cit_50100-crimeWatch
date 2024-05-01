const { BigQuery } = require('@google-cloud/bigquery');
const cors = require('cors')({ origin: true });

exports.queryNearbyCrimesWithCORS = async (req, res) => {
  cors(req, res, async () => {
  const incoming = Buffer.from(message.data, 'base64').toString('utf-8');  
  const parsedMsg = JSON.parse(incoming);
  try {
    // Create a BigQuery client instance
    const bigquery = new BigQuery();
    
    const latitude = parsedMsg.latitude
    const longitude = parsedMsg.longitude
    const radius = parsedMsg.radius

    // Define the SQL query using template literals
    const query = `
      SELECT primary_type, COUNT(*) AS occurrences
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
      WHERE distance <= ${radius}
      GROUP BY primary_type;`;

    // Run the query using the BigQuery client instance
    const [rows] = await bigquery.query(query);

    // Send the response as JSON
    res.status(200).json(rows);
  } catch (error) {
    console.error(`Error executing query: ${error}`);
    res.status(500).send('Internal Server Error');
  }
});
}




























