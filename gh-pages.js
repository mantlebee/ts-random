var ghpages = require('gh-pages');

// Every error reaches the callback, which reports it and sets the exit code.
// The returned promise is rejected only by some of them, which are already
// reported: it is caught so they don't crash as unhandled rejections.
ghpages
  .publish('docs/api', function(err) {
    if (!err) return;
    console.error(err);
    process.exitCode = 1;
  })
  .catch(function() {});
