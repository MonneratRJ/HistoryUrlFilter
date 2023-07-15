let wordArray = [];

chrome.storage.sync.get('wordList', function (result) {
    wordArray = result.wordList;
});

function persistData(wordArray) {
    chrome.storage.sync.set({ "wordList": wordArray }).then(function (res) {
        console.log(res)
    });
}

function addDomain() {
    var input = document.getElementById("input");
    if (input.value !== "") {
        wordArray.push(input.value);
        persistData(wordArray);

        updateWordList();
    }
    input.value = '';
}

function removeDomain(index) {
    if (index > -1) {
        wordArray.splice(index, 1);
        persistData(wordArray);

        updateWordList();
    }
}

function updateWordList() {
    document.getElementById("word-list").innerHTML = "";
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
}

document.querySelector("input").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        addDomain();
    }
})

document.getElementById("add-domain").addEventListener("click", addDomain);
document.getElementById("refresh").addEventListener("click", updateWordList);

document.addEventListener("DOMContentLoaded", function () {
    updateWordList();
});