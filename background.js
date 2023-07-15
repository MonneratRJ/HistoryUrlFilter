wordArray = [];

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.get('wordList', function (result) {
    wordArray = result.wordList;
  });
});



function searchForMatches(wordArray) {
  if (wordArray) {
    wordArray.forEach(element => {
      //console.log(element);
      chrome.history.search({ text: element }).then(function (results) {
        for (let k in results) {
          let onDelete = chrome.history.deleteUrl({ url: results[k].url });
          onDelete.then(() => console.log('ok'));
        }
      })
    });
  }
}

chrome.tabs.onUpdated.addListener(() => {
  searchForMatches(wordArray);
});