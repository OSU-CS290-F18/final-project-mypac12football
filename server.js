var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;

var mongoHost = "classmongo.engr.oregonstate.edu";
var mongoPort = process.env.MONGO_PORT || '27017';
var mongoUsername = "cs290_pavoni";
var mongoPassword = "cs290_pavoni";
var mongoDBName = "cs290_pavoni";

var mongoURL = "mongodb://" +
  mongoUsername + ":" + mongoPassword + "@" + mongoHost + ":" + mongoPort +
  "/" + mongoDBName;

var mongoDB = null;

var app = express();

var port = process.env.PORT || 8000;

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());

app.use(express.static('public'));

app.get('/', function (req, res, next) {
    var myTeamsCollection = mongoDB.collection('myTeams');
    myTeamsCollection.find({}).toArray(function (err, myTeamsArr) {
        if (err) {
          res.status(500).send("Error connecting to DB.");
        }
        if(myTeamsArr.length == 0){
            res.status(200).render('initialNoTeams');
        }
        else{
            res.status(200).render('initial', {
            teams: myTeamsArr
            });
        }
      });
  });

app.get('/teams', function (req, res, next) {
    var allTeamsCollection = mongoDB.collection('allTeams');

    allTeamsCollection.find().sort({confWins: -1}).toArray(function (err, allTeamsSorted){
        if (err) {
            res.status(500).send("Error connecting to DB.");
        }
        var northTeams = [];
        var southTeams = [];
        var i;
        for(i = 0; i < allTeamsSorted.length; i++){
            if(allTeamsSorted[i].division == "north"){
                var northPusher = allTeamsSorted[i];
                northTeams.push(northPusher);
            }
            else if(allTeamsSorted[i].division == "south"){
                var southPusher = allTeamsSorted[i];
                southTeams.push(southPusher);
            }
        }
        var teams = {
            north: northTeams,
            south: southTeams
        }
        res.status(200).render('teams', teams);
    });
});

app.get('/teams/:division/:team', function (req, res, next) {
    var allTeamsCollection = mongoDB.collection('allTeams');
    var division = req.params.division.toLowerCase();
    var teamName = req.params.team.toLowerCase();
    if(division == "north" || division == "south"){
        allTeamsCollection.find({lowerName: teamName}).toArray(function (err, teamObj){
            if (err) {
                res.status(500).send("Error communicating with the DB.");
              } else if (teamObj.length == 1) {
                res.status(200).render('teamPage', teamObj[0]);
              } else {
                next();
              }
        });
    }
    else next();
});

app.post('/updateMyTeams', function (req, res, next) {
    if(req.body)
    newMyTeams = req.body;
    var myTeams;
    var myTeamsCollection = mongoDB.collection('myTeams');
    var allTeamsCollection = mongoDB.collection('allTeams');

    myTeamsCollection.find({}).toArray(function (err, myTeamsArr) {
        if (err) {
          res.status(500).send("Error connecting to DB.");
        }
        myTeams = myTeamsArr;
    

    var i = 0;
    if (myTeams.length > 0){
        if(newMyTeams.length == 0) myTeams.length = 0;
        else{
    while(i < myTeams.length){
        var j = 0;
        for(j = 0; j < newMyTeams.length; j++){
            if(myTeams[i].lowerName == newMyTeams[j]){
                break;
            }
        }
        if(j == newMyTeams.length){
            myTeams.splice(i,1);
        }
        else i++;
    }}}


    allTeamsCollection.find().toArray(function(err, allTeamsArr){
        if (err) {
            res.status(500).send("Error connecting to DB.");
        }

    for(i = 0; i < newMyTeams.length; i++ ){
        var j = 0;
        for(j = 0; j < myTeams.length; j++){
            if(myTeams[j].lowerName == newMyTeams[i]){
                break;
            }
        }

        if(j == myTeams.length){
            var k;
            for(k = 0; k < allTeamsArr.length; k++){

                if(newMyTeams[i] == allTeamsArr[k].lowerName){

                    pushObj = {
                        lowerName: allTeamsArr[k].lowerName,
                        name: allTeamsArr[k].name,
                        mascot:allTeamsArr[k].mascot,
                        logoURL:allTeamsArr[k].logoURL,
                        record: allTeamsArr[k].record,
                        confWins: allTeamsArr[k].confWins,
                        teamColor: allTeamsArr[k].teamColor,
                        division: allTeamsArr[k].division
                    }
                    myTeams.push(pushObj);
                    break;
                }
            }
        }
    }

    myTeamsCollection.deleteMany({}, function(err, obj){
        if(err) res.status(500).send("Error connecting to DB.");
        if(myTeams.length > 0){
        myTeamsCollection.insertMany(myTeams, function(err, obj){
            if(err) res.status(500).send("Error connecting to DB.");
            else res.status(200).send("Success");
        });}
        else res.status(200).send("Success");
    });});});
});

app.get('*', function (req, res, next) {
    res.status(404).render('404');
});

MongoClient.connect(mongoURL, function (err, client) {
    if (err) {
      throw err;
    }
    mongoDB = client.db(mongoDBName);
    app.listen(port, function () {
      console.log("== Server listening on port", port);
    });
  });

/*
    "name": "",
    "mascot":"",
    "logoURL":"",
    "record": "",
    "confWins": ,
    "teamColor": "" 
*/