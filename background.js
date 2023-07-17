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

async function cleanHistory() {
  let wordArray;

  try {
    wordArray = await retrieveData();
  } catch (error) {
    // Exit the function if there was an error
    console.error(error);
    return;
  }

  if (wordArray) {
    wordArray.forEach(element => {
      // Basic history cleaning
      chrome.history.search({ text: element }).then(function (results) {
        for (let k in results) {
          let onDelete = chrome.history.deleteUrl({ url: results[k].url });
          onDelete.then(() => console.log('ok'));
        }
      });
    });
  }
}

async function checkForOccurrences(url) {
  let wordArray;

  try {
    wordArray = await retrieveData();
  } catch (error) {
    // Exit the function if there was an error
    console.error(error);
    return;
  }

  return wordArray.some(word => url.includes(word));
}

chrome.webNavigation.onCommitted.addListener(async function (details) {
  if (details.url && await checkForOccurrences(details.url)) {
    cleanHistory();
  }
});