var link = document.querySelector('.build-status-details');

self.port.on('msg', function(msg) {
  alert(msg)
});

if (link) {
  self.port.emit('buildUrl', link.href.toString());
} else {
  self.port.emit('noBuildUrl');
}
