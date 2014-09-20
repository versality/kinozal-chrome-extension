function kinozal(callback) {
    var movies = [];
    var trs;

    $.get('http://kinozal.tv/browse.php?s=&g=0&c=0&v=0&d=0&w=0&t=1&f=0/', parse_trs);

    function parse_trs(data) {
        trs = $(data).find('.w100p > tbody > tr');

        trs.each(function() {
            $(this).each(function () {
                var _time = $(this).children('.s:eq(2)').text();

                _time = _time.replace(/[\u0250-\ue007]/g, '');
                _time = _time.split('  ');

                var timeDate = _time[0].split('.');
                var time = _time[1];

                if (timeDate[0] === '') {
                    finalDate = new Date().getTime();
                } else {
                    finalDate = Date.parse(timeDate[2]+"-"+timeDate[1]+"-"+timeDate[0]+"T"+time);
                }

                var name = $(this).children('.nam').text();  // Get name
                var url = 'http://kinozal.tv' + $(this).children('.nam').children().attr('href');

                if (!name) return;

                var moviesInQueue = 0;  // Wait until all IMDB rating were returned

                // If Movie is not Russian
                if (name.match(/\//g).length === 4) {
                    name = name.split(' / ')[1];  // Get English title

                    moviesInQueue += 1;
                    getImdbRating(name, function(rating) {
                        movies.push({
                            'name': name,
                            'time': finalDate,
                            'url': url,
                            'rating': rating,
                            'seen': false
                        });

                        moviesInQueue -= 1;
                        if (moviesInQueue === 0) callback(movies);
                    });
                } else {
                    name = name.split(' / ')[0];  // Get Russian title

                    movies.push({
                        'name': name,
                        'time': finalDate,
                        'url': url,
                        'rating': {score: 'N/A', votes: 'N/A'},
                        'seen': false
                    });
                }
            });
        });
    }

    function getImdbRating(movieName, callback) {
        $.getJSON("http://www.omdbapi.com/?i=&t=" + movieName, function(data) {
            if (data['Response'] === 'False') {
                callback({
                    score: 'N/A',
                    votes: 'N/A'
                });
            } else {
                callback({
                    score: data.imdbRating,
                    votes: data.imdbVotes
                });
            }
        });
    }
}
