
const {FireStore, Firestore} = require ('@google-cloud/firestore');

exports.write_crimeWatcher = (message, context) => {
    const incomingMessage = Buffer.from(message.data, 'base64').toString('utf-8');

    const parsedMessage = JSON.parse(incomingMessage);

    console.log(`Decoded message: ${JSON.stringify(parsedMessage)}`);
    console.log(`Location: ${parsedMessage.location}`);

    async function writeToFs(){
        const FireStore = new Firestore({
            projectId: 'cit50100-green-team-final',
            databaseId: ''
        });

        let watchObj = {};

        watchObj.watch_location = parsedMessage.watch_location
        watchObj.distance_radius = parsedMessage.distance_radius
        watchObj.email_address = parsedMessage.email_address


    
        //write to firestore
        let collectionRef = FireStore.collection('watchList');
        let documentRef = collectionRef.add(watchObj);
    }
    writeToFs()

}
