function update() {
  async.series([
      function(callback) {
        kinozal(function(movies) {
          callback(null, movies);
        });
      } // Insert more trackers here
    ], 

    function(err, movies) {
      parseTrackers(movies);
    }
  ); 

  function parseTrackers(movies) {
    var merged = [].concat.apply([], movies);

    chrome.storage.local.get('timeJoined', function(data) {
      var time = data['timeJoined'];
      var filtered = merged.filter(moviesBeforeJoined(time));

      seenMovies(filtered);
    });

    function moviesBeforeJoined(timeJoined) {
      return function(movie) {
        return movie['time'] > timeJoined;
      }
    }

    function seenMovies(movies) {
      chrome.storage.local.get('movies', function(storedMovies) {
        var unseenMovies = [];
        var mergedMovies = [];
        var found = false;

        movies.forEach(function(movie) {
          found = false;
          storedMovies['movies'].forEach(function(storedMovie) {
            if (movie['name'] === storedMovie['name']) {
              found = true;
              return false;
            }
          });

          if (!found)
            unseenMovies.push(movie);
        });

        mergedMovies = storedMovies['movies'].concat(unseenMovies);
        chrome.storage.local.set({'movies': mergedMovies});
        updateCounter();
      });
    }
  }
}

function updateCounter() {
  var counter = 0;

  chrome.storage.local.get('movies', function(storedMovies) {
    storedMovies['movies'].forEach(function(movie) {
      if (!movie['seen']) {
        counter += 1;
      }
    });

    counter = counter.toString();
    if (counter === '0') {
      chrome.browserAction.setBadgeText({text: ''});
      window.close();
    } else {
      chrome.browserAction.setBadgeText({text: counter});
    }
  });
}