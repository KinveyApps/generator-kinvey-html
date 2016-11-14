var KinveyApi = require('./mapi.js');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var parseArgs = require('minimist');
var RSVP = require('rsvp');
var fs = require('fs');
var path = require('path');

module.exports = yeoman.Base.extend({
  prompting: function() {
    this.log(yosay(
      'Welcome to the incredible ' + chalk.red('generator-kinvey-html') + ' generator!'
    ));

    var args = parseArgs(process.argv.slice(2));

    if (args.config || args.c) {
      // Read config file
      var file = path.resolve(this.destinationPath(), args.config || args.c);
      return new RSVP.Promise(function(resolve, reject) {
        fs.open(file, 'r', function(error, fd) {
          if (error) {
            if (error.code === 'ENOENT') {
              this.log(file + ' does not exist');
              ;
            }

            return reject(error);
          }

          fs.readFile(fd, 'utf8', function(error, data) {
            if (error) {
              return reject(error);
            }

            try {
              this.props = {};
              this.props.config = JSON.parse(data);
              resolve();
            } catch (e) {
              reject(e);
            }
          }.bind(this));
        }.bind(this));
      }.bind(this));
    }

    this.log('Enter your Kinvey credentials to continue');

    var prompts = [{
      type: 'input',
      name: 'email',
      message: 'Email:',
      default: '',
      store: true
    }, {
      type: 'password',
      name: 'password',
      message: 'Password:',
      default: ''
    }];

    return this.prompt(prompts).then(function (props) {
      this.props = props;
      this.props.config = {};
      return KinveyApi.login(this.props.email, this.props.password);
    }.bind(this)).then(function(user){
      return KinveyApi.apps();
    }.bind(this)).then(function(apps){
      var envChoices = [];

      apps.forEach(function(app) {
        app.environments.forEach(function(env) {
          envChoices.push({
            name: app.name + ' (' + env.name + ')',
            value: {
             app: app,
             env: env
            }
          });
        });
      });

      var envPrompt = [{
        type: 'list',
        name: 'environment',
        message: 'What environment are you building this app for?',
        choices: envChoices,
        filter: function (selection){
          return selection;
        }
      }];

      return this.prompt(envPrompt);
    }.bind(this)).then(function(props){
      this.props.config.app = props.environment.app;
      this.props.config.env = props.environment.env;
      return KinveyApi.collections(props.environment.env.id);
    }.bind(this)).then(function(collections){
      var colPrompt = [{
        type: 'checkbox',
        name: 'collections',
        message: 'Select the collections you want to include in your app',
        choices: collections
      }];

      return this.prompt(colPrompt);
    }.bind(this)).then(function(selection){
      var collections = selection.collections;
      this.props.config.collections = collections;
    }.bind(this)).catch(function(error){
      this.log("Something bad happened.\n" + error);
    }.bind(this));
  },

  writing: function() {
    var config = this.props.config;
    config.app.packageName = config.app.name.replace(/\s+/g, '-').toLowerCase();

    // Copy the static part of the template first
    this.fs.copy(
      this.templatePath() + '/**/!(_)*',
      this.destinationPath()
    );

    // Copy _index.js
    this.fs.copyTpl(
      this.templatePath('static/js/_index.js'),
      this.destinationPath('static/js/index.js'),
      config
    );

    // Copy _index.html
    this.fs.copyTpl(
      this.templatePath('static/_index.html'),
      this.destinationPath('static/index.html'),
      config
    );

    // Copy collection files
    config.collections.forEach(function(collection) {
      this.fs.copyTpl(
        this.templatePath('static/js/_collection.js'),
        this.destinationPath('static/js/' + collection + '.js'),
        {
          collection: collection
        }
      );
      this.fs.copyTpl(
        this.templatePath('static/_collection.html'),
        this.destinationPath('static/' + collection + '.html'),
        {
          app: config.app,
          collections: config.collections,
          collection: collection
        }
      );
    }.bind(this));

    // Copy _login.html
    this.fs.copyTpl(
      this.templatePath('static/_login.html'),
      this.destinationPath('static/login.html'),
      config
    );

    // Copy _logout.html
    this.fs.copyTpl(
      this.templatePath('static/_logout.html'),
      this.destinationPath('static/logout.html'),
      config
    );

    // Copy _profile.html
    this.fs.copyTpl(
      this.templatePath('static/_profile.html'),
      this.destinationPath('static/profile.html'),
      config
    );

    // Copy _signup.html
    this.fs.copyTpl(
      this.templatePath('static/_signup.html'),
      this.destinationPath('static/signup.html'),
      config
    );

    // Copy _upload.html
    this.fs.copyTpl(
      this.templatePath('static/_upload.html'),
      this.destinationPath('static/upload.html'),
      config
    );

    // Copy _package.json
    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath('package.json'),
      config
    );

     // Copy all dotfiles
    this.fs.copy(
      this.templatePath('.*'),
      this.destinationRoot()
    );
  },

  install: function() {
    this.installDependencies();
  },

  end: {
    goodbye: function(){
      console.log ('\n\nWe\'re done! Your app is ready to be tried out. Run ' + chalk.yellow('npm start') + ' and enjoy!\n');
    }
  }
});
