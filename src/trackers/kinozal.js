function kinozal(callback) {  
  var movies = [];
  var trs;

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

        movies.push({
          'name': $(this).children('.nam').text(),
          'time': finalDate,
          'url': 'http://kinozal.tv' + $(this).children('.nam').children().attr('href'),
          'seen': false
        });
      });
    });

    movies.splice(0, 1); // First movie is empty, slicing out

    callback(movies);
  }

  $.get('http://kinozal.tv/browse.php?s=&g=0&c=0&v=0&d=0&w=0&t=1&f=0/', parse_trs);
}