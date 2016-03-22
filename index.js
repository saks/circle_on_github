var self = require('sdk/self');
var panels = require('sdk/panel');

var ui = require('sdk/ui');
var { ToggleButton } = require('sdk/ui/button/toggle');
var tabs = require("sdk/tabs");
var Request = require("sdk/request").Request;

// a dummy function, to show how tests work.
// to see how to test this function, look at test/test-index.js
function dummy(text, callback) {
  callback(text);
}

var button = ToggleButton({
  id: 'my-button',
  label: 'CircleCI',
  icon: {
    '16': './circle_on_github_16.png',
    '32': './circle_on_github_32.png',
    '64': './circle_on_github_64.png',
  },
  onChange: handleChange,
});

function getArtifactUrl(artifactsUrl, callback) {
  Request({
    url: artifactsUrl,
    onComplete: function (response) {
      console.log(response.text);

      var artifacts = response.json;

      for (var i = 0, len = artifacts.length; i < len; i++) {
        if (artifacts[i].path.endsWith('rubocop.html')) {
          callback(artifacts[i].url);
        }
      }
    }
  }).get();
}

function countReportOffenses(reportUrl) {
  var d = document.querySelector('.infobox')
  d.innerText
}


function CreatePanel(url) {
  var panel = require("sdk/panel").Panel({
    contentURL: url,
    width: 1000,
    height: 500,
    onHide: handleHide
  });

  return panel
}

var { ActionButton } = require("sdk/ui/button/action");

function handleChange(state) {

  var worker = tabs.activeTab.attach({
    contentScriptFile: "./content-script.js",
  });

  worker.port.on("noBuildUrl", function(buildUrl) {
    // console.log('no build url!!!')
    // worker.port.emit('msg', 'no buld url!!!')
  })
  worker.port.on("buildUrl", function(buildUrl) {
    var parts = buildUrl.split('/');

    var username = parts[parts.length - 3];
    var project  = parts[parts.length - 2];
    var buildNum = parts[parts.length - 1];
    var token = require("sdk/simple-prefs").prefs.token;

    var artifactsUrl = 'https://circleci.com/api/v1/project/' + username +
      '/' + project + '/' + buildNum + '/artifacts?circle-token=' + token;

    getArtifactUrl(artifactsUrl, function(reportUrl) {
      var token = require("sdk/simple-prefs").prefs.token;
      var reportUrl = reportUrl + '?circle-token=' + token;

      var panel = CreatePanel(reportUrl);

      if (state.checked) {
        panel.show({
          position: {
            top: 0,
          },
        });
      }
    })
  })
}

function handleHide() {
  button.state('window', {checked: false});
}

exports.dummy = dummy;


