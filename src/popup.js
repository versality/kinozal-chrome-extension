var table = $('table');

chrome.storage.local.get('movies', function(data) {
  if (Object.keys(data).length === 0) return;

  data['movies'].forEach(function(movie) {
    if (!movie.seen)
      $('table').append('\
        <tr>\
          <td><a href=' + movie.url + '>' + movie.name + '</a></td>\
          <td>' + movie.rating.score + ' : ' + movie.rating.votes + '</td>\
          <td><input type="checkbox"></td>\
        </tr>');
  });

  if ($('table > tr').length === 0) {
    $('h3').show();
  }

  $('a').on('click', function() {
    chrome.tabs.create({url: $(this).attr('href')});
    return false;
  });

  $(':checkbox').change(function() {
    $(this).closest('tr').fadeOut();
    var movieName = $(this).parent().siblings().text();

    chrome.storage.local.get('movies', function(data) {
      data.movies.forEach(function(movie, index) {
        if (movie.name === movieName)
          data.movies[index]['seen'] = true;
      });

      chrome.storage.local.set(data);
      updateCounter();
    });
  });
});
