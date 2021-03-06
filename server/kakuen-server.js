var chokidar = require("chokidar"),
  _ = require("underscore"),
  Chance = require("chance"),
  chance = new Chance(),
  jsonpath = require("JSONPath").eval,
  chalk = require("chalk"),
  fs = require("fs");

//config
var mockResponses = [];

var match = function(path, url) {
  //if no wildcard, compare
  var re = /{param}/;
  var match = null;
  match = re.exec(path);
  if (!match) {
    return path === url;
  }
  while (match) {
    if (path.substring(0, match.index) !== url.substring(0, match.index)) {
      return false;
    }
    path = path.substring(match.index + "{param}".length);
    match = re.exec(path);
    if (match === null) return true;
    else {
      var interString = match.input.substring(0, match.index);
      url = url.substring(url.indexOf(interString));
    }
  }
  return false;
};

const run = function(files = "mocks", isWatch = true) {
  var mocksFolder = process.env.KAKUEN_MOCKS_FOLDER || files,
    allowMethod = [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "PATCH",
      "HEAD",
      "OPTIONS",
      "LINK",
      "UNLINK",
      "PURGE"
    ],
    allowType = ["json", "xml"];

  var watcher = chokidar.watch(mocksFolder, {
    ignored: /^\./,
    persistent: true
  });

  //extent chance with image type
  chance.image = function(param) {
    var result = "http://lorempixel.com";
    result = result + "/" + param.w + "/" + param.h + "/" + param.topic;
    return result;
  };

  chance.avatar = function(param) {
    var result = "http://www.avatarpro.biz/avatar";
    if (param.size)
      result =
        result +
        "/" +
        Math.random()
          .toString(36)
          .substring(7) +
        "?s=" +
        param.size;
    return result;
  };

  var mocks = [];

  var hasSchema = function(json) {
    try {
      var allElem = jsonpath(JSON.parse(json), "$..*");
      var filter = /^@KAKUEN/;
      var ke = _.find(allElem, function(obj) {
        var key;
        for (key in obj) {
          if (obj.hasOwnProperty(key) && filter.test(key)) {
            return true;
          }
        }
      });
      if (ke) return true;
    } catch (e) {
      return false;
    }
    return false;
  };

  var traverse = function(obj, func, parent) {
    for (i in obj) {
      func.apply(this, [i, obj[i], parent, obj]);
      if (obj[i] instanceof Object && !(obj[i] instanceof Array)) {
        traverse(obj[i], func, i);
      } else if (obj[i] instanceof Array) {
        obj[i].forEach(function(each) {
          traverse(each, func);
        });
      }
    }
  };

  var genFromSchema = function(json) {
    var jsonObj = {};
    var itemFilter = /^@KAKUEN_ITEM/;
    var collectionFilter = /^@KAKUEN_COLLECTION/;
    try {
      jsonObj = JSON.parse(json);
      traverse(jsonObj, function(key, value, parent, obj) {
        var ki,
          kk,
          value,
          chanceSetting = "";
        var schema,
          tempObj = {};
        var count = 0;
        var kc = [];

        // transform item
        if (itemFilter.test(key)) {
          ki = _.keys(obj)[0];
          chanceSetting = obj[ki];
          kk = ki.match(/\((.*)\)$/)[1];
          try {
            value = chance[chanceSetting["@KAKUEN_TYPE"]](
              chanceSetting["@KAKUEN_PARAM"]
            );
          } catch (ee) {
            value = "Error: can't find this type data." + ee.message;
          }

          delete obj[ki];
          obj[kk] = value;
        }
        // transform collection
        if (collectionFilter.test(key)) {
          kc = [];
          schema = obj[key];
          kk = key.match(/\((\w+)\)/)[1];
          count = parseInt(key.match(/\((\d+)\)/)[1]);
          for (var i = 0; i < count; i++) {
            tempObj = {};
            for (var n in schema) {
              chanceSetting = schema[n];
              try {
                tempObj[n] = chance[chanceSetting["@KAKUEN_TYPE"]](
                  chanceSetting["@KAKUEN_PARAM"]
                );
              } catch (ee) {
                tempObj[n] = "Error: can't find this type data." + ee.message;
              }
            }
            kc.push(tempObj);
          }
          delete obj[key];
          obj[kk] = kc;
        }
      });
    } catch (e) {
      return "";
    }
    return JSON.stringify(jsonObj);
  };

  var mockService = function(fn) {
    var requestAttribute = fn.split("__", 2);
    var method = requestAttribute[0] || "";
    var pathAndType = requestAttribute[1] || "";
    var type = pathAndType.split(".").pop();
    var path = pathAndType.slice(0, -(type.length + 1));
    var rawData = fs.readFileSync(mocksFolder + "/" + fn).toString() || "";
    var finalData = "";

    // if raw json do not include json schema, take as it is
    // otherwise, transfer it using schema
    if (hasSchema(rawData) && type === "json") {
      finalData = genFromSchema(rawData);
    } else {
      finalData = rawData;
    }

    //http method in a set, json or xml type, and url start with # (replace of /)
    if (
      allowMethod.indexOf(method) > -1 &&
      /^|/.test(path) &&
      allowType.indexOf(type) > -1
    ) {
      path = path.replace(/\#/g, "/");
      path = path.replace(/\@/g, "?");
      mockResponses.push({
        method: method,
        path: path,
        type: type,
        content: finalData
      });
    } else {
      // return 501 error
    }
  };

  var reloadMocks = function(showRoute) {
    mockResponses = [];
    var mocks = fs.readdirSync(mocksFolder);

    mocks.forEach(function(mock) {
      mockService(mock);
    });

    if (showRoute) {
      console.log(chalk.bold("Mock follwing routes:"));
      mockResponses.forEach(function(route) {
        console.log(chalk.yellow(route.method) + " " + chalk.cyan(route.path));
      });
    }
  };

  if (isWatch) {
    watcher.on("all", function(path) {
      reloadMocks(false);
    });

    watcher.close();
  }
  reloadMocks(true);
};

exports.mocker = function(req, res, next) {
  run();

  var mock = _.find(mockResponses, function(item) {
    return item.method === req.method && match(item.path, req.url);
  });
  if (mock) {
    var type = mock.type;
    if (type === "json") {
      res.set("Content-Type", "application/json");
    } else if (type === "xml") {
      res.set("Content-Type", "application/xml");
    } else {
      res.set("Content-Type", "text/plain");
    }
    res.send(mock.content);
  } else {
    res.send({
      error: "no mockup for this request: " + req.url
    });
  }
};

exports.createMocker = function(files) {
  run(files);

  return function(req, res, next) {
    var mock = _.find(mockResponses, function(item) {
      return item.method === req.method && match(item.path, req.url);
    });
    if (mock) {
      var type = mock.type;
      if (type === "json") {
        res.set("Content-Type", "application/json");
      } else if (type === "xml") {
        res.set("Content-Type", "application/xml");
      } else {
        res.set("Content-Type", "text/plain");
      }
      res.send(mock.content);
    } else {
      res.send({
        error: "no mockup for this request: " + req.url
      });
    }
  };
};
