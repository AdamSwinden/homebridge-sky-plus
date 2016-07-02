'use strict';

var SkyRemote = require('sky-remote');
var Accessory, Service, Characteristic;

module.exports = function(homebridge) {

	Accessory = homebridge.platformAccessory;
	Service = homebridge.hap.Service;
	Characteristic = homebridge.hap.Characteristic;
	homebridge.registerAccessory("homebridge-sky-plus", "SkyPlus", SkyPlusAccessory);
};

function SkyPlusAccessory(log, config, api) {

	this.log = log;
	this.config = config;
	this.name = config.name || 'Sky+';

	var remoteControl = new SkyRemote(config.ipAddress);
	this.skyPlus = remoteControl;
}


SkyPlusAccessory.prototype = {

	setPowerState: function(powerOn, callback) {

		this.log("Sending on command to '" + this.name + "'...");

		this.skyPlus.press('power', function(error) {

			if (error) {

				this.log('Failed to turn on ' + this.name + '. ' + error);
			}

			callback();
		});
	},

	identify: function(callback) {

		this.log("Identify...");

		callback();
	},

	getServices: function() {

		var switchService = new Service.Switch(this.name);

		switchService.getCharacteristic(Characteristic.On).on('set', this.setPowerState.bind(this));

		return [switchService];
	}
};
