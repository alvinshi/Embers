var AV = require('leanengine');

/**
 * cloud function Hello world
 */
AV.Cloud.define('hello', function(request, response) {
  response.success('Hello world!');
});
