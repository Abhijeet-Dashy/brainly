chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "saveToBrainly",
    title: "Capture to Brainly Console",
    contexts: ["selection", "link", "image"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "saveToBrainly") {
    let capturedData = "";
    let dataType = "text";

    if (info.selectionText) {
      capturedData = info.selectionText;
    } else if (info.linkUrl) {
      capturedData = info.linkUrl;
      dataType = "link";
    } else if (info.srcUrl) {
      capturedData = info.srcUrl;
      dataType = "image";
    }

    if (capturedData) {
      chrome.storage.local.set({ 
        copiedData: capturedData,
        copiedType: dataType 
      });
      // Optionally notify user
    }
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "GET_FOLDERS") {
    fetch("https://devlink-v9e2.onrender.com/api/folders", {
      headers: { "Authorization": `Bearer ${request.token}` }
    })
    .then(res => res.json())
    .then(data => sendResponse(data))
    .catch(err => sendResponse({ success: false, message: err.message }));
    return true; // Keep the message channel open for async response
  }
  
  if (request.action === "POST_ITEM") {
    fetch("https://devlink-v9e2.onrender.com/api/items", {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${request.token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(request.payload)
    })
    .then(res => res.json())
    .then(data => sendResponse(data))
    .catch(err => sendResponse({ success: false, message: err.message }));
    return true; // Keep the message channel open for async response
  }
});
