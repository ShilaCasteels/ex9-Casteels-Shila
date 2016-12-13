// >$ npm install request --save 
var request = require("request");
var dal = require('./storage.js');

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

var Drone = function (id, name, mac) {
	this._id = id;
	this.name = name;
	this.mac = mac;
};
var FileHead = function (id, ref){
        this.id = id;
        this.droneref = ref;
};
var Files = function(id,date_loaded, date_first_rec, date_last_rec, content_id ){
        this.id = id;
        this.date_loaded = date_loaded;
        this.date_first_rec = date_first_rec;
        this.date_last_rec;
        this.content_id = content_id;
};
var Contents = function(url, ref, id){
        this.url = url;
        this.Fileref = ref;
        this.id = id;
};
var Contenthead = function(content_id, contentmac, datetime, rssi){
        this.id = content_id;
        this.mac = contentmac;
        this.date = datetime;
        this.rssi = rssi;
};

var dronesSettings = new Settings("/drones?format=json");

dal.clearDrone();
//dal.clearFileHead();
//dal.clearFiles();
//dal.clearContents();
//dal.clearContenthead();

request(dronesSettings, function (error, response, dronesString) {
	var drones = JSON.parse(dronesString);
	console.log(drones);
	console.log("***************************************************************************");
	drones.forEach(function (drone) {
		var droneSettings = new Settings("/drones/" + drone.id + "?format=json");
		request(droneSettings, function (error, response, droneString) {
			var drone = JSON.parse(droneString);
			dal.insertDrone(new Drone(drone.id, drone.name, drone.mac_address));
		});
        var fileheadsettings = new Settings ("/drones/" + drone.id + "/files?format=json");
        request (fileheadsettings, function(error, response, fileheadString){
            var FileHead = JSON.parse(fileheadString);
            console.log(FileHead);
            console.log("**************************************************************************");
            FileHead.forEach(function(FileHeads){
                  var fileheadSettings = new Settings ("/drones/" + drone.id + "/files/"+FileHead.id+"?format=json");
                  request(fileheadSettings, function(error, response, filehString){
                      var FileHeads = JSON.parse(filehString);
                      dal.insertFileHeads (new FileHead(FileHead.id, FileHead.droneref));
                  });
            var filessettings = new Settings ("/drones/"+drone.id+"/files/"+FileHead.id+"?format=json");
            request(filessettings, function(error, response, fileString){
                var Files = JSON.parse(fileString);
                console.log(Files);
                console.log("*********************************************************************************");
                Files.forEach(function(file){
                    var fileSettings= new Settings("/drones/"+drone.id+"/files/"+FileHead.id+"/contents?format=json");
                    request(fileSettings,function(error, response, fileString){
                        var file = JSON.parse(fileString);
                        dal.insertFiles(new Files(Files.id, Files.date_loaded, Files.date_first_rec, Files.date_last_rec,
                        Files.content_id));
                        });
                    var contentssettings = new Settings ("/drones/"+drone.id+"/files/"+FileHead.id+"/contents?format=json");
                    request(contentssettings, function(error, response, contentsString){
                        var Contents = JSON.parse(contentsString);
                        console.log(Contents);
                        console.log("**********************************************************************************");
                        Contents.forEach(function(content){
                            var contentSettings = new Settings ("/drones/"+drone.id+"/files/"+FileHead.id+"/contents/"+Contents.id+"?format=json");
                            request(contentSettings, function(error, response, contentString){
                                var content = JSON.parse(contentString);
                                dal.insertContents(new Contents(Contents.url, Contents.Fileref, Contents.id));
                                });
                             var contentheadsettings = new Settings("/drones/"+drone.id+"/files/"+FileHead.id+"/contents/"+Contents.id+"?format=json");
                             request(contentheadsettings, function(error, response, contentheadString){
                                 var Contenthead = JSON.parse(contentheadString);
                                 console.log(Contenthead);
                                 console.log("************************************************************************************");
                                 Contenthead.forEach(function(contenthead){
                                     var contentheadSettings = new Settings ("/drones/"+drone.id+"/files/"+FileHead.id+"/contents/"+Contents.id+"?format=json");
                                     request(contentheadSettings, function(error, response, contentHeadString){
                                         var contenthead = JSON.parse(contentHeadString);
                                         dal.insertContenthead(new Contenthead(Contenthead.id, Contenthead.mac, Contenthead.date, Contenthead.rssi));
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


console.log("Hello Shila!");