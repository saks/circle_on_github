var link, parts, buildNum, project, username, artifactsUrl;
var token = self.options.token;

if (link = document.querySelector('.build-status-details')) {
  parts = link.href.split('/');

  username = parts[parts.length - 3];
  project  = parts[parts.length - 2];
  buildNum = parts[parts.length - 1];


  artifactsUrl = 'https://circleci.com/api/v1/project/' + username +
    '/' + project + '/' + buildNum + '/artifacts?circle-token=' + token;

  alert(artifactsUrl)
}
