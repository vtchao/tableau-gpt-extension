$(document).ready(function() {
  // Initialize Tableau Extension API
  tableau.extensions.initializeAsync().then(() => {
    console.log("Tableau Extensions API initialized.");

    // Event handler for the Generate Insights button
    $('#generateInsights').click(function() {
      generateInsights();
    });
  });

  // Function to call GPT API and display insights
  function generateInsights() {
    const fastapiUrl = 'http://140.118.60.18:8002/model_response';

    const body = {
      "model_name": "Llama3.1-8B-Instruct",
      "messages": [
        {
          "role": "system",
          "content": "你是一個有幫助的助手，請使用繁體中文進行回答。"
        },
        {
          "role": "assistant",
          "content": "你是一個有幫助的助手，請使用繁體中文進行回答。"
        },
        {
          "role": "user",
          "content": "現在你是我們數據分析師，請幫我講解我們提供的數據"
        }
      ],
      "max_length": 2048,
      "temperature": 0.7,
      "top_p": 0.9
    };

    // Call the GPT API
    $.ajax({
      url: fastapiUrl,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(body),
      success: function(data) {
        // Display the response or a message if response is empty
        $('#apiResponse').html(data.response || JSON.stringify(data) || 'No response from GPT');
      },
      error: function(xhr, status, error) {
        // Detailed error handling
        const errorMessage = `
          <strong>Error:</strong> ${error} <br>
          <strong>Status:</strong> ${status} <br>
          <strong>Response:</strong> ${xhr.responseText || 'No response from server'}
        `;
        $('#apiResponse').html(errorMessage);
      }
    });
  }
});
