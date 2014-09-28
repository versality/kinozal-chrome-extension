var DELAY = 5;

chrome.alarms.onAlarm.addListener(onAlarm);
chrome.alarms.create('update', {'periodInMinutes': DELAY});

chrome.runtime.onInstalled.addListener(initStorage);

Parser.update();

function onAlarm(alarm) {
  if (alarm['name'] == 'update') {
    Parser.update();
    chrome.alarms.create('update', {'periodInMinutes': DELAY});
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

function initStorage() {
    //chrome.storage.local.clear();
    //time_now = new Date('1900-01-01').getTime();

    var time_now = new Date().getTime();
    chrome.storage.local.set({'timeJoined': time_now});
    chrome.storage.local.set({'movies': []});
}
