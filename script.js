tableau.extensions.initializeAsync().then(() => {
    // Get the first worksheet (or modify to target a specific one)
    const worksheet = tableau.extensions.dashboardContent.dashboard.worksheets[0];
    worksheet.getSummaryDataAsync().then(dataTable => {
        // Format data and send to API
        const dataSummary = formatDataForAPI(dataTable);
        sendDataToAPI(dataSummary);
    });
});

function formatDataForAPI(dataTable) {
    // Convert Tableau data to a readable string summary
    const dataSummary = dataTable.data.map(row => row.map(cell => cell.formattedValue)).join(", ");
    return `Tableau data summary: ${dataSummary}`;
}

function sendDataToAPI(dataSummary) {
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
    .then(data => displayResponse(data))
    .catch(error => console.error("Error:", error));
}

function displayResponse(data) {
    const responseDiv = document.getElementById("apiResponse");
    responseDiv.innerText = data.response || "Error fetching data";
}
