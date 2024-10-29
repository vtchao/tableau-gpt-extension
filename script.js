tableau.extensions.initializeAsync().then(() => {
    const worksheet = tableau.extensions.dashboardContent.dashboard.worksheets[0];
    worksheet.getSummaryDataAsync().then(dataTable => {
        const dataSummary = formatDataForAPI(dataTable);
        console.log("Data Summary:", dataSummary);  // Log the data summary
        sendDataToAPI(dataSummary);
    });
});

function sendDataToAPI(dataSummary) {
    console.log("Sending data to API:", dataSummary);  // Log data before sending to API
    fetch("http://140.118.60.18:8002/model_response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "model_name": "Llama3.1-8B-Instruct",
            "messages": [
                { "role": "system", "content": "你是一個有幫助的助手，請使用繁體中文進行回答。" },
                { "role": "user", "content": dataSummary }
            ],
            "max_length": 2048,
            "temperature": 0.7,
            "top_p": 0.9
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("API Response:", data);  // Log API response
        displayResponse(data);
    })
    .catch(error => console.error("Error:", error));
}
