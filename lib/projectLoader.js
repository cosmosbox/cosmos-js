// Read a folder as a Cosmos Project

// parse process arguments to get appConfig and actorConfig
"use strict";

var path = require('path');
var fs = require('fs');

var ProjectLoader = function(projectPath) {
	this.projectPath = projectPath;

};

ProjectLoader.prototype.getActorTypes = function(forceReload) {

	if (forceReload || this.actorTypes == undefined) {
		var actorTypesPath = path.resolve(this.projectPath, './actor');
		this.actorTypes = {};
		var $this = this;
		fs.readdirSync(actorTypesPath).forEach(function(dirpath) {
			var dirFullPath = path.resolve(actorTypesPath, dirpath);
			var stat = fs.statSync(dirFullPath);

				
			if (stat.isDirectory()) {
				var actorTypeName = path.basename(dirpath);	

				var handler = require(path.resolve(dirFullPath, 'handler'));
				var remote = require(path.resolve(dirFullPath, 'remote'));
				$this.actorTypes[actorTypeName] = {
					handler : handler,
					remote : remote
				}
			}
			
		});
	}

	return this.actorTypes;
}

ProjectLoader.prototype.getConfigs = function(forceReload) {

	if (forceReload || this.configs == undefined) {
		var configsPath = path.resolve(this.projectPath, './config');
		this.configs = {};
		var $this = this;
		fs.readdirSync(configsPath).forEach(function(filepath) {
			var configFullPath = path.resolve(configsPath, filepath);
			var configName = path.parse(filepath).name;
			$this.configs[configName] = require(configFullPath);
		});
	}


	return this.configs;
}

module.exports = ProjectLoader;