var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017/prober';
// mongo in nodeJs: http://mongodb.github.io/node-mongodb-native/2.2/
// mongo API : http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html

var dal = {

	connect: function (err, result) {
		MongoClient.connect(url, function (error, db) {
			if (error)
				throw new Error(error);
			console.log("Connected successfully to server");
			result(db);
		});
	},
	clearDrone: function (call) {
		this.connect(null, function (db) {
			db.collection('drones').drop(function (err, result) {
				//callback(result);
				db.close();
			});
		})
	},
	insertDrone: function (drone, callback) {
		this.connect(null, function (db) {
			db.collection('drones').insert(drone, function (err, result) {
				//callback(result);
				db.close();
			});
		});
	},
        clearFileHead: function(call){
                this.connect(null, function(db){
                     db.collection('FileHead').drop(function(err,result){
                         db.close();
                     });
                });
        },
        insertFileHead: function (drone, callback) {
		this.connect(null, function (db) {
			db.collection('FileHead').insert(drone, function (err, result) {
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
        insertFiles: function (drone, callback) {
		this.connect(null, function (db) {
			db.collection('Files').insert(drone, function (err, result) {
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
        insertContents: function (drone, callback) {
		this.connect(null, function (db) {
			db.collection('Contents').insert(drone, function (err, result) {
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
        insertContenthead: function (drone, callback) {
		this.connect(null, function (db) {
			db.collection('Contenthead').insert(drone, function (err, result) {
				//callback(result);
				db.close();
			});
		});
	}
};

module.exports = dal;