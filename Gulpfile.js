var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var forever = require('forever');

gulp.task('default', function() {
  nodemon({ script : './index.js', ext : 'js' });
});

gulp.task('deploy', function() {
  var argList = ['production']
  if (process.argv.indexOf('--reset') > 0) {
    argList.push('reset');
  };
  forever.list(true, (err, processes) => {
    if (err) {
      throw err;
    } else if (processes) {
      forever.stop("index.js", true);
      console.log("Redeploying server...");
    } else {
      console.log("Deploying server...");
    }
    forever.startDaemon('index.js', {
      max: 3,
      silent: true,
      minUptime: 3000,
      args: argList
    });
  });
});

gulp.task('destroy', function() {
  var runner = forever.stop("index.js")
  runner.on('error',(err) => {
    console.log("Stop failed, maybe nothing is running...")
  });
  runner.on('stop', (process) => {
    console.log("Stopped server")
  })
});
