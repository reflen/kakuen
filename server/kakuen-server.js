var chokidar = require('chokidar'),
	_ = require('underscore'),
	fs = require('fs');

//config
var mocksFolder = process.env.KAKUEN_MOCKS_FOLDER || 'mocks',
	port = process.env.KAKUEN_PORT | 8443,
	allowMethod = ['GET', 'POST', 'PUT', 'DELETE'],
	allowType = ['json', 'xml'];

var watcher = chokidar.watch(mocksFolder, {
	ignored: /^\./,
	persistent: true
});

var mockResponses = [];

var mockService = function(fn) {
	var requestAttribute = fn.split('__', 2);
	var method = requestAttribute[0] || '';
	var pathAndType = requestAttribute[1] || '';
	var type = pathAndType.split('.').pop();
	var path = pathAndType.slice(0, -(type.length + 1));
	//http method in a set, json or xml type, and url start with # (replace of /)
	if (allowMethod.indexOf(method) > -1 && (/^|/).test(path) && allowType.indexOf(type) > -1) {
		path = path.replace(/\#/g, '/');
		mockResponses.push({
			'method': method,
			'path': path,
			'type': type,
			'content': fs.readFileSync(mocksFolder + '/' + fn).toString()
		});
	} else {
		// return 501 error
	}
};

var reloadMocks = function() {
	mockResponses = [];
	var mocks = fs.readdirSync(mocksFolder);
	mocks.forEach(function(mock) {
		mockService(mock);
	});
};

watcher
	.on('add', function(path) {
		reloadMocks();
	})
	.on('change', function(path) {
		reloadMocks();
	})
	.on('unlink', function(path) {
		reloadMocks();
	});

watcher.close();

reloadMocks();

exports.mocker = function(req, res, next) {
	var mock = _.find(mockResponses, function(item) {
		return item.method === req.method && item.path === req.url;
	});
	if (mock) {
		var type = mock.type;
		if (type === 'json') {
			res.set('Content-Type', 'application/json');
		} else if (type === 'xml') {
			res.set('Content-Type', 'application/xml');
		} else {
			res.set('Content-Type', 'text/plain');
		};
		res.send(mock.content);
	} else {
		res.send({
			error: 'no mockup for this request: ' + req.url
		});
	}
};
