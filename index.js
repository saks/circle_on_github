var self = require('sdk/self');

var { ToggleButton } = require('sdk/ui/button/toggle');
var { ActionButton } = require('sdk/ui/button/action');
var tabs = require('sdk/tabs');
var Request = require('sdk/request').Request;
var Panel = require('sdk/panel').Panel;

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
      if (200 != response.status) { callback(null, 'not authorized'); return };

      var artifacts = response.json;

      for (var i = 0, len = artifacts.length; i < len; i++) {
        if (artifacts[i].path.endsWith('rubocop.html')) {
          callback(artifacts[i].url);
          return
        }
      }
      callback(null, 'no rubocop report')
    }
  }).get();
}

function createPanel(url) {
  var settings = prefs();

  return Panel({
    contentURL: url,
    width:      settings.panel_width,
    height:     settings.panel_height,
    onHide:     handleHide,
  })
}


function prefs() {
  return require('sdk/simple-prefs').prefs
}

function noReportFound(message) {
  var panel = Panel({
    contentURL:           self.data.url('no_report_panel.html'),
    contentScriptFile:    self.data.url('no_report_panel.js'),
    contentScriptOptions: { message: message },
    width:                200,
    height:               40,
    onHide:               handleHide,
  });

  panel.show({
    position: button,
  });
}

function handleChange(state) {
  var worker = tabs.activeTab.attach({
    contentScriptFile: './content-script.js',
  });

  worker.port.on('noBuildUrl', function() {
    noReportFound('no build information')
  })
  worker.port.on('buildUrl', function(buildUrl) {
    var parts = buildUrl.split('/');

    var username = parts[parts.length - 3];
    var project  = parts[parts.length - 2];
    var buildNum = parts[parts.length - 1];
    var token = prefs().token;

    var artifactsUrl = 'https://circleci.com/api/v1/project/' + username +
      '/' + project + '/' + buildNum + '/artifacts?circle-token=' + token;

    getArtifactUrl(artifactsUrl, function(reportUrl, error) {
      if (reportUrl) {
        reportUrl = reportUrl + '?circle-token=' + token;
        var panel = createPanel(reportUrl);

        if (state.checked) {
          panel.show({ position: { top: 0 } });
        }
      } else {
        noReportFound(error)
      }
    })
  })
}

function handleHide() {
  button.state('window', {checked: false});
}

exports.dummy = dummy;
