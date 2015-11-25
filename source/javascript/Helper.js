// Helper functions
var Helper = {
    downloadFile: function(filename, contents) {
        var element = document.createElement('a');
        
        element.setAttribute('href', contents);
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    },

    storage: {
		get: function(key, callback) {
			chrome.storage.local.get(key, function(result) {
				if (result[key] === undefined) {
					callback(false)
				} else {
					callback(result[key]);
				}
	        });
		},

		set: function(key, value, callback) {
			var objectToSave = {};
			objectToSave[key] = value;
			
			chrome.runtime.lastError = null;

			chrome.storage.local.set(objectToSave, function() {
				if (chrome.runtime.lastError) {
					callback(false);
				} else {
		          	callback(true);
				}
	        });
		},

		delete: function(key, callback) {
			chrome.runtime.lastError = null;

			chrome.storage.local.remove(key, function() {
				if (chrome.runtime.lastError) {
					callback(false);
				} else {
		          	callback(true);
				}
	        });
		}
    }

};
