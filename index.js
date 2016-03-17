var self = require('sdk/self');
var panels = require('sdk/panel');

// a dummy function, to show how tests work.
// to see how to test this function, look at test/test-index.js
function dummy(text, callback) {
  callback(text);
}

var ui = require('sdk/ui');
var { ToggleButton } = require('sdk/ui/button/toggle');
var tabs = require("sdk/tabs");

tabs.on('ready', function(tab) {
  if (!tab.url.includes('github.com')) return;

  tab.attach({
    contentScriptFile: "./content-script.js",
    contentScriptOptions: {
      token: require("sdk/simple-prefs").prefs.token,
    }
  });

  // var worker = tab.attach({
  //   // contentScript: 'self.port.emit("html", document.body.innerHTML);'
  //   contentScriptFile: './'
  // });
  // worker.port.on("html", function(message) {
  //   console.log(message)
  // })
});




// tabs.on('activate', function(tab) {
//   var worker = tab.attach({
//     contentScript: 'self.port.emit("html", document.body.innerHTML);'
//   });
//   worker.port.on("html", function(message) {
//     console.log(message)
//   })
// });















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

var panel = panels.Panel({
  contentURL: self.data.url('panel.html'),
  onHide: handleHide
});

function handleChange(state) {
  console.log(require("sdk/simple-prefs").prefs.token);
  // if (state.checked) {
  //   panel.show({
  //     position: button
  //   });
  // }
}

function handleHide() {
  button.state('window', {checked: false});
}

exports.dummy = dummy;


