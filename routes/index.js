/**
 * Created by alvin on 4/6/17.
 */
var router = require('express').Router();
var AV = require('leanengine');
var https = require('https');


/* GET home page. */
router.get('/', function(req, res) {
    res.render('index');
});

module.exports = router;
