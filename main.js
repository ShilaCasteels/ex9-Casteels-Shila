// >$ npm install request --save 
var request = require('request');
//Drones
var dalDrone = require('./Dronestorage.js');

// http://stackoverflow.com/questions/10888610/ignore-invalid-self-signed-ssl-certificate-in-node-js-with-https-request
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


var BASE_URL = "https://web-ims.thomasmore.be/datadistribution/API/2.0";
var Settings = function (url) {
	this.url = BASE_URL + url;
	this.method = "GET";
	this.qs = {format: 'json'};
	this.headers = {
		authorization: "Basic aW1zOno1MTJtVDRKeVgwUExXZw=="
	};
};


var Drone = function (id, name, mac, location) {
	this._id = id;
	this.name = name;
	this.mac = mac;
        this.location = location;
};
var FileHead = function (id, ref){
        this._id = id;
        this.droneref = ref;
};
var Files = function(id,date_loaded, date_first_rec, date_last_rec, content_id ){
        this._id = id;
        this.date_loaded = date_loaded;
        this.date_first_rec = date_first_rec;
        this.date_last_rec;
        this.content_id = content_id;
};
var Contents = function(url, ref, id){
        this.url = url;
        this.Fileref = ref;
        this._id = id;
};
var Contenthead = function(content_id, contentmac, datetime, rssi){
        this._id = content_id;
        this.mac = contentmac;
        this.date = datetime;
        this.rssi = rssi;
};

var dronesSettings = new Settings("/drones/?format=json");

dalDrone.clearDrone();
dalDrone.clearFileHead();
dalDrone.clearFiles();
dalDrone.clearContents();
dalDrone.clearContenthead();


request(dronesSettings, function (error, response, dronesString) {
	var drones = JSON.parse(dronesString);
	console.log(drones);
	console.log("***************************************************************************");
	drones.forEach(function (drone) {
		var droneSettings = new Settings("/drones/"+drone.id + "?format=json");
		request(droneSettings, function (error, response, droneString) {
			var drone = JSON.parse(droneString);
			dalDrone.insertDrone(new Drone(drone._id, drone.name, drone.mac_address, drone.location));
                        console.log("Drones inserted");
		});
        var fileheadsettings = new Settings ("/files?drone_id.is="+drone.id+ "&date_loaded.greaterOrEqual=2016-11-01T00:00:00&format=json");
        request (fileheadsettings, function(error, response, fileheadString){
            var FileHead = JSON.parse(fileheadString);
            console.log(FileHead);
            console.log("----------------------fileheaders----------------------");
            FileHead.forEach(function(filehead){
                  var fileheadSettings = new Settings ("/files?drone_id.is="+drone.id+"/"+FileHead.id+"?format=json");
                  request(fileheadSettings, function(error, response, filehString){
                      var filehead = JSON.parse(filehString);
                      dalDrone.insertFileHead (new FileHead(FileHead._id, filehead.droneref));
                      console.log("Fileheaders inserted");
                  });
            var filessettings = new Settings ("/files?drone_id.is="+drone.id+"/"+FileHead.id+"?format=json");
            request(filessettings, function(error, response, fileString){
                var Files = JSON.parse(fileString);
                console.log(Files);
                console.log("-------------------files------------------------");
                Files.forEach(function(file){
                    var fileSettings= new Settings("/files?drone_id.is="+drone.id+"/"+FileHead.id+"/contents?format=json");
                    request(fileSettings,function(error, response, fileString){
                        var file = JSON.parse(fileString);
                        dalDrone.insertFiles(new Files(Files._id, Files.date_loaded, Files.date_first_rec, Files.date_last_rec,
                        Files.content_id));
                        });
                    var contentssettings = new Settings ("/files?drone_id.is="+drone.id+"/"+FileHead.id+"/contents?format=json");
                    request(contentssettings, function(error, response, contentsString){
                        var Contents = JSON.parse(contentsString);
                        console.log(Contents);
                        console.log("--------------------------------content-------------------------");
                        Contents.forEach(function(content){
                            var contentSettings = new Settings ("/files?drone_id.is="+drone.id+"/"+FileHead.id+"/contents/"+Contents.id+"?format=json");
                            request(contentSettings, function(error, response, contentString){
                                var content = JSON.parse(contentString);
                                dalDrone.insertContents(new Contents(Contents._id, Contents.url, Contents.Fileref));
                                });
                             var contentheadsettings = new Settings("/files?drone_id.is="+drone.id+"/"+FileHead.id+"/contents/"+Contents.id+"?format=json");
                             request(contentheadsettings, function(error, response, contentheadString){
                                 var Contenthead = JSON.parse(contentheadString);
                                 console.log(Contenthead);
                                 console.log("---------------------------------contenthead----------------------");
                                 Contenthead.forEach(function(contenthead){
                                     var contentheadSettings = new Settings ("/files?drone_id.is="+drone.id+"/"+FileHead.id+"/contents/"+Contents.id+"?format=json");
                                     request(contentheadSettings, function(error, response, contentHeadString){
                                         var contenthead = JSON.parse(contentHeadString);
                                         dalDrone.insertContenthead(new Contenthead(Contenthead._id, Contenthead.mac, Contenthead.date, Contenthead.rssi));
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});
var express = require('express');
var parser = require ('body-parser');

var app = express();
app.use(parser.json());
var dalLocatie = require('./locatiestorage.js');
var validate = require('./Validation.js');

//Locatie: op basis van code peter en wibren
var Locatie_M = function(id, migratie, pauze_id, pauze_tijd, bezetting, bezet, klas, aantal_studenten_klas, 
aantal_geregistreerde_studenten){
    this.id = id;
    this.migratie = migratie;
    this.pauze_id = pauze_id;
    this.pauze_tijd = pauze_tijd;
    this.bezetting = bezetting;
    this.bezet = bezet;
    this.klas = klas;
    this.aantal_studenten_klas = aantal_studenten_klas;
    this.aantal_geregistreerde_studenten = aantal_geregistreerde_studenten;
};

app.get("/locatie",function(request, response){
    dalLocatie.listAllLocaties(function(err, locatie){
        if(err){
            throw err;
        }
        response.send(locatie);
    });
});

app.post("/locatie", function (request, response) {
    var Locatie = new Locatie_M(
            request.body.id, 
            request.body.migratie,
            request.body.pauze_id,
            request.body.pauze_tijd,
            request.body.bezetting,
            request.body.bezet,
            request.body.klas,
            request.body.aantal_studenten_klas,
            request.body.aantal_geregistreerde_studenten
    );
    
    dalLocatie.createLocatie(Locatie, function(err, locatie){
        var errors = validate.fieldsNotEmpty(
                "id", 
                "pauze_id",
                "pauze_tijd",
                "klas", 
                 "bezet"
                );
             if(errors){
                 response.status(400).send({msg: "Volgende velden ontbreken: "+errors.concat()});
                 return;
             }
             response.send(locatie);
             
            console.log("locatie toegevoegd");
        });
    });
app.put("/locatie/:id", function (request, response) {
    var Locatie = new Locatie_M(
            request.body.id, 
            request.body.migratie,
            request.body.pauze_id,
            request.body.pauze_tijd,
            request.body.bezetting,
            request.body.bezet,
            request.body.klas,
            request.body.aantal_studenten_klas,
            request.body.aantal_geregistreerde_studenten
        );
    var error = validate.fieldsNotEmpty(
             "id", 
             "pauze_id",
             "pauze_tijd",
             "klas", 
             "bezet"
            );
    if (error) {
        response.status(400).send({msg: "Volgende velden ontbreken of zijn verkeerd ingevuld:" + error.concat()});
        return;
    }
    dalLocatie.updateLocatie(request.params.id, Locatie, function (err, locatie) {
        if (err) {
            console.log(err);
        }
        response.send(locatie);
    });
    console.log("Locatie updated");
});

var dalPauze = require('./pauzestorage.js');

//Locatie: op basis van code peter en wibren
var Pauze_M = function(pauze_id, pauze_tijd){
    this.pauze_id = pauze_id;
    this.pauze_tijd = pauze_tijd;
};

app.get("/pauze",function(request, response){
    dalPauze.listAllPauze(function(err, locatie){
        if(err){
            throw err;
        }
        response.send(locatie);
    });
});

app.post("/pauze", function (request, response) {
    var Pauze = new Pauze_M(
            request.body.pauze_id,
            request.body.pauze_tijd
    );
    
    dalPauze.createPauze(Pauze, function(err, locatie){
        var errors = validate.fieldsNotEmpty(
                "pauze_id",
                "pauze_tijd"
                );
             if(errors){
                 response.status(400).send({msg: "Volgende velden ontbreken: "+errors.concat()});
                 return;
             }
             response.send(locatie);
             
            console.log("pauze toegevoegd");
        });
    });
app.put("/pauze/:id", function (request, response) {
    var Pauze = new Pauze_M(
            request.body.pauze_id,
            request.body.pauze_tijd
        );
    var error = validate.fieldsNotEmpty(
             "pauze_id",
             "pauze_tijd"
            );
    if (error) {
        response.status(400).send({msg: "Volgende velden ontbreken of zijn verkeerd ingevuld:" + error.concat()});
        return;
    }
    dalPauze.updateLocatie(request.params.id, Pauze, function (err, locatie) {
        if (err) {
            console.log(err);
        }
        response.send(locatie);
    });
    console.log("Pauze updated");
});

app.listen(8765);
//console.log("Hello Shila!");