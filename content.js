// Create the button
const button = document.createElement('button');
button.id = 'callApiBtn'; // Set the ID for the button
button.innerText = 'Call API'; // Set the button text

// Find the target element to insert the button after
const targetElement = document.evaluate(
    '/html/body/div[1]/div[2]/div/div/section[1]/div',
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
).singleNodeValue;

// Insert the button after the target element
if (targetElement) {
    targetElement.parentNode.insertBefore(button, targetElement.nextSibling);
}

// Add event listener to the button
button.addEventListener('click', async () => {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, async (tabs) => {
        const url = tabs[0].url;
        const match = url.match(/https:\/\/www\.navaar\.ir\/audiobook\/(\d{4,10})\/.*/);

        if (match) {
            const audioBookId = match[1];

            // Fetch the audiobook page to extract description and image
            const response = await fetch(url);
            const pageContent = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(pageContent, 'text/html');

            // Extract description
            const description = doc.evaluate(
                '/html/body/div[1]/div[2]/div/div/section[2]/div/div/div[2]/div[1]/p/span',
                doc,
                null,
                XPathResult.STRING_TYPE,
                null
            ).stringValue;

            // Extract image URL and title
            const imageElement = doc.evaluate(
                '/html/body/div[1]/div[2]/div/div/section[2]/div/div/div[1]/div[1]/figure/a/img',
                doc,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            ).singleNodeValue;

            const imageUrl = imageElement ? imageElement.getAttribute('src') : '';
            const title = imageElement ? imageElement.getAttribute('alt') : '';

            // Prepare data for POST request
            const postData = {
                origin: 'navaar.ir',
                media_id: audioBookId,
                image: imageUrl,
                link: `https://www.navaar.ir/audiobook/${audioBookId}`,
                title: title,
                description: description
            };

            // Send POST request
            const postResponse = await fetch('http://localhost:8000/api/rss-generator', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            });

            if (postResponse.ok) {
                alert('Data sent successfully!');
            } else {
                console.error('POST request failed:', postResponse.statusText);
            }
        } else {
            alert('This feature only works on navaar.ir');
        }
    });
});
