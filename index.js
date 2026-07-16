const searchForm = document.getElementById("search-form");
const wordInput = document.getElementById("word-input");
const word = document.getElementById("word");
const phonetic = document.getElementById("phonetic");
const meanings = document.getElementById("meanings");
const audio = document.getElementById("audio");
const source = document.getElementById("source");
const loading = document.getElementById("loading");
const error = document.getElementById("error");

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
        const response = await fetch('https://dictionaryapi.dev/api/v2/entries/en/${wordToSearch}'
        );
        const response = await response.json();

        if (!response.ok) {
            throw new Error("Word not found")
        }
        const data = await response.json();
        const entry=(data[0]);
    } catch (err) {
        error.textContent = err.message;
    } finally {
        loading.textContent = "";
    }

}
//display results
function displayWord(entry){
    //word
    word.textContent = entry.word;

    //pronunciation
    phonetic.textContent = entry.phonetic || "No pronunciation available"
}






