//imports
const {Storage} = require('@google-cloud/storage');
const {BigQuery} = require('@google-cloud/bigquery')



//table and dataset ID for bq
const bq = new BigQuery;
const datasetId='chicago_crime';
const tableId = 'fileclass';


exports.crimeQuerry = async (event, context) => {
    const triggerResource = context.resource;


    //query location
    const getlocation = async () => {
        //SQL query to run
        const sqlQueryLocation = "SELECT "
    }
    
}