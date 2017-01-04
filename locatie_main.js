// >$ npm install request --save 
var request = require('request');

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

app.listen(3000);
