/* jshint node: true */
'use strict';
var BasePlugin = require('ember-cli-deploy-plugin');
var request = require('request');
var rp = require('request-promise');
var git = require('git-rev-sync');

module.exports = {
  name: 'ember-cli-deploy-newrelic',
  createDeployPlugin: function(options) {
    var DeployPlugin = BasePlugin.extend({
      name: options.name,
      requiredConfig: ['key', 'appID'],

      didDeploy: function(context) {
        console.log("Deploying for Newrelic")
        return rp({
          method: 'POST',
          url: `https://api.newrelic.com/v2/applications/${this.readConfig('appID')}/deployments.json`,
          json: true,
          headers: {
            'X-Api-Key': this.readConfig('key')
          },
          body: {
            deployment: {
              revision: `${context.project.pkg.version}+${git.long(context.project.root).substring(0, 8)}`,
            }
          }
        }).then((res) => {
          this.log('Successfully sent deployment');
        }, (err) => {
          this.log('Error setting deployment' + err.message, {color: 'red'});
          throw err;
        });
      }
    });

    return new DeployPlugin();
  }
};
