var link;

// self.port.on('reportUrl', function(reportUrl) {
//   alert('report url: ' + reportUrl);
// });

if (link = document.querySelector('.build-status-details')) {
  self.port.emit('buildUrl', link.href.toString());
}
