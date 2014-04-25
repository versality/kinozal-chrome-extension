function initStorage() {
  //chrome.storage.local.clear();
  time_now = new Date().getTime();
  //time_now = new Date('2014-04-01').getTime();
	chrome.storage.local.set({'timeJoined': time_now});
  chrome.storage.local.set({'movies': []});
}