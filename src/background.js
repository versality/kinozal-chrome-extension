var DELAY = 5;

chrome.alarms.onAlarm.addListener(onAlarm);
chrome.runtime.onInstalled.addListener(initStorage);
chrome.runtime.onStartup.addListener(update);
chrome.alarms.create('update', {'periodInMinutes': DELAY});

function onAlarm(alarm) {
  if (alarm['name'] == 'update') {
    update();
    chrome.alarms.create('update', {'periodInMinutes': DELAY});
  }
}