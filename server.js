var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');

var myTeams = require('./myTeams.json');
var allTeams = require('./allTeams.json');

var app = express();

var port = process.env.PORT || 8000;

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());

app.use(express.static('public'));

app.get('/', function (req, res, next) {
    if(myTeams["myTeams"]["teams"].length == 0){
        res.status(200).render('initialNoTeams');
    }
    else{
        res.status(200).render('initial', myTeams["myTeams"]);
    }
  });

app.get('/teams', function (req, res, next) {
    res.status(200).render('teams', allTeams["divisions"]);
});

app.get('/teams/:division/:team', function (req, res, next) {
    var division = req.params.division.toLowerCase();
    var teamName = req.params.team.toLowerCase();
    if(division == "north" || division == "south"){
        if(allTeams["divisions"][division][teamName]){
            res.status(200).render('teamPage', allTeams["divisions"][division][teamName]);
        }
        else next();
    }
    else next();
});

app.post('/updateMyTeams', function (req, res, next) {
    if(req.body)
    newMyTeams = req.body;
    var i = 0;
    if (myTeams["myTeams"]["teams"].length > 0){
        if(newMyTeams.length == 0) myTeams["myTeams"]["teams"].length = 0;
        else{
    while(i < myTeams["myTeams"]["teams"].length){
        var j = 0;
        for(j = 0; j < newMyTeams.length; j++){
            if(myTeams["myTeams"]["teams"][i].lowerName == newMyTeams[j]){
                break;
            }
        }
        if(j == newMyTeams.length){
            myTeams["myTeams"]["teams"].splice(i,1);
        }
        else i++;
    }}}
    for(i = 0; i < newMyTeams.length; i++ ){
        var j = 0;
        for(j = 0; j < myTeams["myTeams"]["teams"].length; j++){
            if(myTeams["myTeams"]["teams"][j].lowerName == newMyTeams[i]){
                break;
            }
        }

        if(j == myTeams["myTeams"]["teams"].length){
            if(allTeams["divisions"]["north"][newMyTeams[i]]){
                var team = allTeams["divisions"]["north"][newMyTeams[i]];
                pushObj = {
                    lowerName: team.lowerName,
                    name: team.name,
                    mascot:team.mascot,
                    logoURL:team.logoURL,
                    record: team.record,
                    confWins: team.confWins,
                    teamColor: team.teamColor,
                    division: team.division
                }
                myTeams["myTeams"]["teams"].push(pushObj);
            }
            else if(allTeams["divisions"]["south"][newMyTeams[i]]){
                var team = allTeams["divisions"]["south"][newMyTeams[i]];
                pushObj = {
                    lowerName: team.lowerName,
                    name: team.name,
                    mascot:team.mascot,
                    logoURL:team.logoURL,
                    record: team.record,
                    confWins: team.confWins,
                    teamColor: team.teamColor,
                    division: team.division
                }
                myTeams["myTeams"]["teams"].push(pushObj);
            }
        }
    }
    res.status(200).send("Success");
});

app.get('*', function (req, res, next) {
    res.status(404).render('404');
});

app.listen(port, function () {
    console.log("== Server is listening on port", port);
  });

/*
    "name": "",
    "mascot":"",
    "logoURL":"",
    "record": "",
    "confWins": ,
    "teamColor": "" 
*/