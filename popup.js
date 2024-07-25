document.getElementById('callApiBtn').addEventListener('click', async () => {
    const response = await fetch('https://www.navaar.ir/api/audiobooks/17207/detail2', {
        method: 'GET',
        headers: {
            "accept": "application/json, text/plain, */*",
            "authorization": "Bearer YOUR_TOKEN_HERE",
            // Add other headers as needed
        }
    });

    if (response.ok) {
        const data = await response.json();
        const audioBookId = data.audioBookId; // Adjust according to the actual response structure
        const audioUrl = `https://www.navaar.ir/content/books/${audioBookId}/sample.ogg`;
        console.log(audioUrl);
        alert(`Audio URL: ${audioUrl}`);
    } else {
        console.error('API call failed:', response.statusText);
    }
});
