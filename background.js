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
          chrome.history.deleteUrl({ url: results[k].url });
        }
      });
    });
  }
}

function checkForOccurrences(url, wordArray) {
  return wordArray.some(word => url.includes(word));
}

chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
  console.log(JSON.stringify(tab));
  let wordArray = await retrieveData();
  if (wordArray === undefined) {
    chrome.storage.sync.set({ "wordList": [] });
  } else {
    if (tab.url && wordArray.some(word => tab.url.includes(word))) {
      cleanHistory();
    }
  }
});