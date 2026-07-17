const searchForm = document.getElementById("search-form");
const wordInput = document.getElementById("word-input");
const word = document.getElementById("word");
const phonetic = document.getElementById("phonetic");
const meanings = document.getElementById("meanings");
const audio = document.getElementById("audio");
const source = document.getElementById("source");
const loading = document.getElementById("loading");
const error = document.getElementById("error");
const saveButton = document.getElementById("favorite-btn");
const favorites = document.getElementById("favorites");

//search button
searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const searchWord = wordInput.value.trim();
    fetchWord(searchWord);
});
//fetch data from the API
async function fetchWord(wordToSearch) {
    try {
        loading.textContent = "loading...";
        error.textContent = "";
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${wordToSearch}`
        );


        if (!response.ok) {
            throw new Error("Word not found")
        }
        const data = await response.json();
        const entry = (data[0]);
        displayWord(entry)
    } catch (err) {
        error.textContent = err.message;
    } finally {
        loading.textContent = "";
    }

}
//display results

function displayWord(entry) {
    //word
    word.textContent = entry.word;

    //pronunciation

    phonetic.textContent = entry.phonetic || "No pronunciation available";
    //audio
    audio.innerHTML = "";

    const audioFile = entry.phonetics.find(item => item.audio);
    if (audioFile) {
        audio.innerHTML = `
            <audio controls>
                <source src="${audioFile.audio}" type="audio/mpeg">
            </audio>
        `;
    }

    //meanings
    meanings.innerHTML = "";
    entry.meanings.forEach((meaning) => {
        const heading = document.createElement("h3");
        heading.textContent = meaning.partOfSpeech;

        meanings.appendChild(heading);

        meaning.definitions.forEach((definition) => {

            const p = document.createElement("p");
            p.textContent = "." + definition.definition;
            meanings.appendChild(p);
        })

    })




    //source
    if (entry.sourceUrls && entry.sourceUrls.length > 0) {

        source.innerHTML = `
            <a href="${entry.sourceUrls[0]}" target="_blank">
                View Source
            </a>
        `;
    } else {
        source.innerHTML = "";
    }

    //save button
    saveButton.onclick = function () {
        saveFavorite(entry);

    }
}
function getFavorites() {
    return JSON.parse(localStorage.getItem("favorites"))
        || [];
}
function saveFavorite(entry) {
    let favorites = getFavorites();
    const exists = favorites.find(item => item.word === entry.word);
    if (!exists) {
        favorites.push(entry);
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }
    displayFavorites();
}
function removeFavorite(word) {
    let favorites = getFavorites();
    favorites = favorites.filter(item => item.word !== word);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    displayFavorites();
}

function displayFavorites() {
    const favoriteWords = getFavorites();
    favorites.innerHTML = "";
    if (favoriteWords.length === 0) {
        favorites.textContent = "No favorite words saved yet"
        return;
    }
    favoriteWords.forEach(item => {
        const div = document.createElement("div");
        div.innerHTML = `<strong>${item.word}</strong
    <button onclick = "removeFavorite('${ item.word }')">
    Remove</button>
    `;
    favorites.appendChild(div);

});
}


