document.getElementById('callApiBtn').addEventListener('click', async () => {
    // Get the current tab's URL
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        const url = tabs[0].url;

        // Check if the URL matches the specified pattern
        const match = url.match(/https:\/\/www\.navaar\.ir\/audiobook\/(\d{4,10})\/.*/);
        if (match) {
            const audioBookId = match[1]; // Extract the integer number

            const response = await fetch(`https://www.navaar.ir/api/audiobooks/${audioBookId}/detail2`, {
                method: 'GET',
                headers: {
                    "accept": "application/json, text/plain, */*",
                    "authorization": "Bearer YOUR_TOKEN_HERE",
                    // Add other headers as needed
                }
            });

            if (response.ok) {
                const data = await response.json();
                const audioBookIdFromResponse = data.audioBookId; // Adjust according to the actual response structure
                const audioUrl = `https://www.navaar.ir/content/books/${audioBookIdFromResponse}/sample.ogg`;
                console.log(audioUrl);
                alert(`Audio URL: ${audioUrl}`);
            } else {
                console.error('API call failed:', response.statusText);
            }
        } else {
            alert('Invalid URL format. Please ensure the URL matches the required pattern.');
        }
    });
});
