function retrieveData() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get('wordList', function (result) {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result.wordList);
      }
    });
  });
}

async function searchForMatches() {
  let wordArray;

  try {
    wordArray = await retrieveData();
  } catch (error) {
    console.log(error);
    return; // Exit the function if there was an error
  }

  if (wordArray) {
    wordArray.forEach(element => {
      chrome.history.search({ text: element }).then(function (results) {
        for (let k in results) {
          let onDelete = chrome.history.deleteUrl({ url: results[k].url });
          onDelete.then(() => console.log('ok'));
        }
      });
    });
  }
}

chrome.tabs.onUpdated.addListener(() => {
  searchForMatches();
});