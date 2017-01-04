var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017/prober';
// mongo in nodeJs: http://mongodb.github.io/node-mongodb-native/2.2/
// mongo API : http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html

MongoClient.connect(url, function(error, db){
    if (error)
        throw new Error(error);
    console.log("Connected succesfully to server");
    db.close();
});

var dalDrone = {

	connect: function (err, result) {
		MongoClient.connect(url, function (error, db) {
			if (error)
				throw new Error(error);
			console.log("Connected successfully to server");
			result(db);
		});
	},
	clearDrone: function (callback) {
		this.connect(null, function (db) {
			db.collection('drones').drop(function (err, result) {
				//callback(result);
				db.close();
			});
		});
	},
	insertDrone: function (drone, callback) {
		this.connect(null, function (db) {
			db.collection('drones').insert(drone, function (err, result) {
				db.close();
			});
		});
	},
        clearFileHead: function(callback){
                this.connect(null, function(db){
                     db.collection('FileHeaders').drop(function(err,result){
                         db.close();
                     });
                });
        },
        insertFileHead: function (filehead, callback) {
		this.connect(null, function (db) {
			db.collection('FileHeaders').insert(filehead, function (err, result) {
				//callback(result);
				db.close();
			});
		});
	},
         clearFiles: function(call){
                this.connect(null, function(db){
                     db.collection('Files').drop(function(err,result){
                         db.close();
                     });
                });
        },
        insertFiles: function (file, callback) {
		this.connect(null, function (db) {
			db.collection('Files').insert(file, function (err, result) {
				//callback(result);
				db.close();
			});
		});
	},
         clearContents: function(call){
                this.connect(null, function(db){
                     db.collection('Contents').drop(function(err,result){
                         db.close();
                     });
                });
        },
        insertContents: function (content, callback) {
		this.connect(null, function (db) {
			db.collection('Contents').insert(content, function (err, result) {
				//callback(result);
				db.close();
			});
		});
	},
         clearContenthead: function(call){
                this.connect(null, function(db){
                     db.collection('Contenthead').drop(function(err,result){
                         db.close();
                     });
                });
        },
        insertContenthead: function (contenthead, callback) {
		this.connect(null, function (db) {
			db.collection('Contenthead').insert(contenthead, function (err, result) {
				//callback(result);
				db.close();
			});
		});
	}
};

module.exports = dalDrone;

var dalLocatie = {
    connect: function (err, result) {
		MongoClient.connect(url, function (error, db) {
			if (error)
				throw new Error(error);
			console.log("Connected successfully to server");
			result(db);
		});
	},
    clearLocatie: function(call){
        this.connect(null, function(db){
            db.collection('locatie').drop(function(err, result){
                db.close();
            });
        });
    },
    insertLocatie:function(locatie, callback){
        this.connect(null, function(db){
            db.collection('locatie').insert(locatie, function(err, result){
                db.close();
            });
        });
    } 
};

module.exports = dalLocatie;