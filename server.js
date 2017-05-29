'use strict';
const AV = require('leanengine');

//The APP_ID, APP_KEY and MASTER_KEY will be obtained from the env variables
//The or statements are used for testing
const APP_ID = process.env.LC_APP_ID || 'IcQOuCm50bcMT9xpfnspBPDI-MdYXbMMI';
const APP_KEY = process.env.LC_APP_KEY || 'iALM9nC4JzSU2gjKIAhNNcFp';
const MASTER_KEY = process.env.LC_APP_MASTER_KEY || 'oqyVJPDnoHkYmIaISQV5e6GJ';

AV.init({
    appId : APP_ID,
    appKey : APP_KEY,
    masterKey : MASTER_KEY,
    region: 'us'});
//Delete the following line to revoke the masterkey access
AV.Cloud.useMasterKey();

//This is THE APP
const app = require('./app');

//The port number is obtained throught the env variable on leancloud
//port 3000 is used for local testing
const PORT = parseInt(process.env.LEANCLOUD_APP_PORT || process.env.PORT || 3000);

app.listen(PORT, function (err) {
    console.log('Node app is running on port:', PORT);

    process.on('uncaughtException', function(err) {
        console.error("Caught exception:", err.stack);
    });
    process.on('unhandledRejection', function(reason, p) {
        console.error("Unhandled Rejection at: Promise ", p, " reason: ", reason.stack);
    });
});
