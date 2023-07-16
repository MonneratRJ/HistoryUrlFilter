function getManifest() {
    return fetch("manifest.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }
            return response.json();
        });
}

async function setHeader() {
    let jsonData = await getManifest();
    console.log(jsonData);
    document.getElementById("appName").textContent = jsonData.name;
    document.getElementById("appVersion").textContent = "version " + jsonData.version;
}


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

function persistData(wordArray) {
    chrome.storage.sync.set({ "wordList": wordArray }).then(function (res) {
        console.log(res)
    });
}

async function addDomain() {
    const input = document.getElementById("input");
    if (input.value !== "") {
        let wordArray = await retrieveData();
        wordArray.push(input.value);
        await persistData(wordArray);
        updateWordList();
    }
    input.value = '';
}

async function removeDomain(index) {
    let wordArray = await retrieveData();

    if (index >= 0 && index < wordArray.length) {
        wordArray.splice(index, 1);
        await persistData(wordArray);
        updateWordList();
    }
}

async function updateWordList() {
    document.getElementById("word-list").innerHTML = "";
    try {
        const wordArray = await retrieveData();
        for (var i = 0; i < wordArray.length; i++) {
            var domain = wordArray[i];
            var entry = document.createElement("h4");
            var text = document.createTextNode(domain + " ");
            entry.appendChild(text);
            var btn = document.createElement("BUTTON");
            btn.setAttribute('index', i);
            btn.textContent = "x";
            btn.onclick = function (event) {
                removeDomain(event.target.getAttribute("index"));
            };
            entry.appendChild(btn);
            document.getElementById("word-list").appendChild(entry);
        }
    } catch (error) {
        console.log(error);
    }
}

document.querySelector("input").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        addDomain();
    }
})

document.getElementById("add-domain").addEventListener("click", addDomain);
document.getElementById("refresh").addEventListener("click", updateWordList);
document.addEventListener("DOMContentLoaded", function () {
    setHeader();
    updateWordList();
});