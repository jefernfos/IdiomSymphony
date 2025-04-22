async function searchSongLyrics() {
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

async function displaySong() {
    const data = await searchSongLyrics();

    if (data.error) {
        document.getElementById("title").textContent = "IdiomSymphony";
        document.getElementById("author").textContent = "Learn new languages with music!";
        document.getElementById("lyrics").textContent = data.error;
        return;
    }

    document.getElementById("title").textContent = data.title;
    document.getElementById("author").textContent = data.author;
    document.getElementById("lyrics").textContent = data.lyrics;
}


async function translate(text, from = 'auto', to = 'pt-BR') {
    const query = encodeURIComponent(text);
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${query}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const translation = data[0].map(item => item[0]).join('');
        return translation;
    } catch (err) {
        console.error('Translation failed:', err);
    }
}