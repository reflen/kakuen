#!/usr/bin/env node

const yargs = require("yargs");
const pkg = require("./package.json");

var express = require("express"),
	kakuen = require("./server/kakuen-server"),
	fs = require("fs"),
	chalk = require("chalk"),
	server = express();
	


const run = function(argv) {

	if (!fs.existsSync(argv.files)) {
		console.log(`Error: mocks directory ${argv.files} doesn't exist`);
		process.exit(1);
	}

	// noop log fn
	if (argv.quiet) {
		console.log = () => {};
	}

	console.log(
		chalk.red("Welcome to Kakuen - an easy reatful api mock tool is running at: http://localhost:" + argv.port+"\n")
	);

	moker = kakuen.createMocker(argv.files,argv.watch);
	server.use(moker);
    server.listen(argv.port);


};

const argv = yargs
	.config("config")
	.usage("$0 [options]")
	.options({
		port: {
			alias: "p",
			description: "Set port",
			default: 3000
		},
		files: {
			alias: "f",
			description: "mockup files",
			default: "./mocks"
		},
		quiet: {
			alias: "q",
			description: "Suppress log messages from output"
		},
		watch: {
			alias: "w",
			description: "Watch file(s)"
		}
	})
	.help("help")
	.alias("help", "h")
	.version(pkg.version)
	.alias("version", "v");

run(argv.argv);
