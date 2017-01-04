// >$ npm install request --save 
var request = require('request');
var dalDrone = require('./storage.js');

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
                  var fileheadSettings = new Settings ();
                  request(fileheadSettings, function(error, response, filehString){
                      var filehead = JSON.parse(filehString);
                      dalDrone.insertFileHead (new FileHead(FileHead._id, FileHead.droneref));
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

app.get("/drones",function(request, response){
    dalDrone.listAllDrones(function(err, Drone){
        if(err){
            throw err;
        }
        response.send(Drone);
    });
});
//console.log("Hello Shila!");