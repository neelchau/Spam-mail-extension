function getEmailContent() {
    let subject = document.querySelector("h2.hP")?.innerText || "No Subject";
    let sender = document.querySelector(".gD")?.innerText || "Unknown Sender";
    let body = document.querySelector(".a3s.aiL")?.innerText || "No Content";

    let emailData = { subject, sender, body };
    console.log("📩 Extracted Email:", emailData);  // ✅ Add this log

    chrome.runtime.sendMessage({
        type: "EMAIL_CONTENT",
        data: emailData
    });
}


let lastUrl = location.href;
setInterval(() => {
    if (lastUrl !== location.href && location.href.includes("#inbox/")) {
        lastUrl = location.href;
        setTimeout(getEmailContent, 2000);
    }
}, 1000);
