let abortPreviousLyrics;

async function translate(text, fromLang = 'auto', toLang = 'auto', signal) {
    if (toLang === 'auto') {
        toLang = navigator.language;
    }

    const query = encodeURIComponent(text);
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${fromLang}&tl=${toLang}&dt=t&q=${query}`;

    try {
        const response = await fetch(url, { signal });
        const data = await response.json();
        const translation = data[0].map(item => item[0]).join('');
        return translation;
    } catch (err) {
        if (err.name === "AbortError") {
            throw err;
        }
        console.error('Translation failed:', err);
    }
}

async function searchSongInfo() {
    const song = document.getElementById("song").value.trim();
    const apiUrl = `https://some-random-api.com/lyrics?title=${encodeURIComponent(song)}`;

    if (!song) {
        alert("Please enter a song.");
        return;
    }

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            return {error: "Song not found."};
        }

        const data = await response.json();

        return {
            title: data.title ?? "Unknown Title",
            author: data.author ?? "Unknown Artist",
            lyrics: data.lyrics ?? "No lyrics available.",
        };
    } catch (error) {
        console.error(error);
        return {error: "Song not found."};
    }
}

async function displaySongInfo() {    
    const title = document.getElementById("title");
    const author = document.getElementById("author");
    const lyrics = document.getElementById("lyrics");

    const fromLang = document.getElementById("fromLang").value;
    const toLang = document.getElementById("toLang").value;

    if (abortPreviousLyrics) {
        abortPreviousLyrics.abort();
    }

    abortPreviousLyrics = new AbortController();
    const signal = abortPreviousLyrics.signal;

    lyrics.textContent = "";

    const data = await searchSongInfo();

    if (data.error) {
        title.textContent = "IdiomSymphony";
        author.textContent = "Learn new languages with music!";
        lyrics.textContent = data.error;
        return;
    }

    title.textContent = data.title;
    author.textContent = "by " + data.author;

    const lines = data.lyrics.split("\n");

    for (const line of lines) {
        if (line.trim() === "") {
            const emptyLine = document.createElement("br");
            lyrics.appendChild(emptyLine);
            continue;
        }

        const originalLine = document.createElement("p");
        originalLine.textContent = line;
        originalLine.classList.add("original");
        lyrics.appendChild(originalLine);

        try {
            const translation = await translate(line, fromLang, toLang, signal);
            const translatedLine = document.createElement("p");
            translatedLine.textContent = translation;
            translatedLine.classList.add("translation");
            lyrics.appendChild(translatedLine);
        } catch (err) {
            if (err.name === "AbortError") {
                console.log("Translation aborted for line:", line);
                return;
            }
            console.error("Translation failed for line:", line, err);
        }
    }
}

async function languageOptions() {
    try {
        const response = await fetch('js/languages.json');
        const languages = await response.json();

        const fromLang = document.getElementById('fromLang');
        const toLang = document.getElementById('toLang');

        for (const [code, name] of Object.entries(languages)) {
            const fromOption = document.createElement('option');
            fromOption.value = code;
            fromOption.textContent = name;
            fromLang.appendChild(fromOption);

            const toOption = document.createElement('option');
            toOption.value = code;
            toOption.textContent = name;
            toLang.appendChild(toOption);
        }
    } catch (error) {
        console.error('Failed to load languages:', error);
    }
}