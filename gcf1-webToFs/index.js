const { Firestore } = require('@google-cloud/firestore');

exports.write_crimeWatcher = async (message, context) => {
  const firestore = new Firestore({
    projectId: 'chicago-crimes-420200'
  });

  try {
    const incoming = Buffer.from(message.data, 'base64').toString('utf-8');
    const parsedMsg = JSON.parse(incoming);

    const watchObj = {
      latitude: parsedMsg.latitude || 0, // default to 0 if undefined
      longitude: parsedMsg.longitude || 0, // default to 0 if undefined
      email_address: parsedMsg.email_address || "noemail@example.com", // provide a default email if undefined
    };

    let collectionRef = firestore.collection('watchList');
    const docRef = await collectionRef.add(watchObj);

    console.log(`New search document added with ID: ${docRef.id}`);
  } catch (error) {
    console.error(`Error adding document to Firestore: ${error}`);
    console.error(`Incoming message data: ${message.data.toString()}`);
  }
};
