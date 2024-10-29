// Initialize the Tableau Extensions API
tableau.extensions.initializeAsync().then(() => {
    console.log("Tableau Extensions API initialized.");

    // Get the first worksheet in the dashboard (adjust this if you need a specific worksheet)
    const worksheet = tableau.extensions.dashboardContent.dashboard.worksheets[0];

    // Fetch and summarize data when the worksheet loads
    worksheet.getSummaryDataAsync().then(dataTable => {
        const dataSummary = formatDataForAPI(dataTable);
        console.log("Data Summary:", dataSummary);  // Log to verify the data summary
        sendDataToAPI(dataSummary);  // Function to send data to your API
    });
}).catch(error => {
    console.error("Error initializing Tableau Extensions API:", error);
});

// Function to format Tableau data into a string summary for the API
function formatDataForAPI(dataTable) {
    // Flatten and join data for a simple summary; you may need to adjust depending on data complexity
    return dataTable.data.map(row => row.map(cell => cell.formattedValue)).join(", ");
}

// Function to send the data to the FastAPI endpoint
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
    .then(response => response.json())
    .then(data => displayResponse(data))
    .catch(error => console.error("Error fetching data from API:", error));
}

// Function to display the API response in the HTML
function displayResponse(data) {
    const responseDiv = document.getElementById("apiResponse");
    if (data && data.response) {
        responseDiv.innerText = data.response;
    } else {
        responseDiv.innerText = "No insights available or error in fetching data.";
    }
}
