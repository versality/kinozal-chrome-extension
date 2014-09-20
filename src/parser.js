var Parser = {
    update: function() {
        async.series(
            [
                function(callback) {
                    kinozal(function(movies) {
                        callback(null, movies);
                    });
                }
            ],

            function(err, movies) {
                Parser._parseTrackers(movies);
            }
        );
    },

    _parseTrackers: function(movies) {
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
};
