'use strict';
var chokidar = require('chokidar');
var chalk = require('chalk');
var eslint = require('eslint');

var defaultPath = './';
var jsFileRules = ['*.js$', '**/*.js$'];
var events = {
  change: 'change'
};

function watcher(options) {
  var cli = new eslint.CLIEngine();
  var specifiedPath = options._;
  var formatter = cli.getFormatter();

  var watch = chokidar.watch(specifiedPath);

  if (specifiedPath.length) {
    watch.unwatch(defaultPath);
    watch.add(specifiedPath);
    watch.add(jsFileRules[0]);
    console.log('Watching', specifiedPath);
  }
  else {
    watch.add(jsFileRules);
    console.log('Watching', defaultPath);
  }

  function lintFile(path, config) {
    var results = cli.executeOnFiles([path], config).results;
    console.log(formatter(results));
    printSuccess(path, results);
  }

  function printSuccess(path, results) {
    var errorCount = results[0].errorCount;
    var warningCount = results[0].warningCount;
    if (errorCount === 0 && warningCount === 0) {
      console.log(chalk.underline(path), chalk.green('(0) Errors | (0) Warnings'));
    }
  }

  watch.on(events.change, function (path) {
    var config = cli.getConfigForFile(path);
    lintFile(path, config);
  });
}

module.exports = watcher;
