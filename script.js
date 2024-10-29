function sendDataToAPI(dataSummary) {
    const fastapi_url = 'http://140.118.60.18:8002/model_response';

    const requestBody = {
        "model_name": "Llama3.1-8B-Instruct",
        "messages": [
            { "role": "system", "content": "你是一個有幫助的助手，請使用繁體中文進行回答。" },
            { "role": "user", "content": `現在你是我們數據分析師，請幫我講解我們提供的數據: ${dataSummary}` }
        ],
        "max_length": 2048,
        "temperature": 0.7,
        "top_p": 0.9
    };

    // Send the POST request to the FastAPI endpoint
    fetch(fastapi_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
    })
    .then(response => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
    })
    .then(data => {
        if (typeof data.response === "string") {
            displayResponse(data);
        } else {
            console.warn("Unexpected response format:", data);
            displayResponse({ response: "No valid response text found." });
        }
    })
    .catch(error => console.error("Error fetching data from API:", error));
}

function displayResponse(data) {
    const responseDiv = document.getElementById("apiResponse");
    responseDiv.innerText = data.response || "No insights available.";
}
