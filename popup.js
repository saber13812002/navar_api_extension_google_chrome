document.getElementById('callApiBtn').addEventListener('click', async () => {
    if (typeof chrome !== 'undefined' && chrome.tabs) {

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

                // alert('POST request failed:', postData.origin);
                console.log(postData)
                // Send POST request
                let baseUrl = "http://bots.pardisania.ir"
                // baseUrl = "http://localhost:8000"
                let uri = baseUrl + '/api/rss-generator'
                // alert(uri)
                const postResponse = await fetch(uri, {
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
                alert('just work in navaar.ir');
            }
        });
    } else {
        console.error('Chrome API is not available.');
    }
});