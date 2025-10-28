chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.type === "EMAIL_CONTENT") {
        const emailData = {
            subject: message.data.subject,
            message: message.data.body
        };

        try {
            console.log("📤 Sending to Flask:", emailData);

            const response = await fetch("http://localhost:5000/predict", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(emailData)
            });

            const result = await response.json();
            const label = result.prediction;

            const emailHtml = `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                      <meta charset="UTF-8">
                      <title>Spam Prediction</title>
                      <style>
                        body {
                          font-family: Arial, sans-serif;
                          margin: 0;
                          padding: 20px;
                          background: #f5f5f5;
                          color: #333;
                        }
                        .container {
                          background: white;
                          border-radius: 12px;
                          padding: 20px;
                          box-shadow: 0 2px 12px rgba(0,0,0,0.1);
                        }
                        h2 {
                          margin-top: 0;
                          font-size: 18px;
                        }
                        .sender {
                          font-weight: bold;
                          margin-bottom: 10px;
                        }
                        .body {
                          background: #f9f9f9;
                          padding: 10px;
                          border-radius: 8px;
                          white-space: pre-wrap;
                        }
                        .label {
                          margin-top: 20px;
                          font-size: 16px;
                          font-weight: bold;
                          padding: 10px;
                          border-radius: 8px;
                          display: inline-block;
                        }
                        .label.spam {
                          background: #ffe5e5;
                          color: #c00;
                        }
                        .label.ham {
                          background: #e5ffe5;
                          color: #070;
                        }
                      </style>
                    </head>
                    <body>
                      <div class="container">
                        <h2>${message.data.subject}</h2>
                        <div class="sender">From: ${message.data.sender}</div>
                        <div class="body">${message.data.body}</div>
                        <div class="label ${label === 'Spam' ? 'spam' : 'ham'}">
                          Prediction: ${label}
                        </div>
                      </div>
                    </body>
                    </html>
                    `;


            const dataUrl = "data:text/html;charset=utf-8," + encodeURIComponent(emailHtml);
            chrome.windows.create({
                url: dataUrl,
                type: "popup",
                width: 500,
                height: 450
            });
        } catch (err) {
            console.error("❌ Error during prediction:", err);
        }
    }
});
