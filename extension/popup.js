document.addEventListener("DOMContentLoaded", async () => {
  const API_URL = "http://localhost:5000/api";
  
  // elements
  const loader = document.getElementById("loader");
  const authView = document.getElementById("auth-view");
  const workspaceView = document.getElementById("workspace-view");
  const logoutBtn = document.getElementById("logoutBtn");

  const syncWebBtn = document.getElementById("syncWebBtn");
  const authError = document.getElementById("authError");

  const saveForm = document.getElementById("saveForm");
  const folderSelect = document.getElementById("folderSelect");
  const typeSelect = document.getElementById("typeSelect");
  const contentInput = document.getElementById("contentInput");
  const noteInput = document.getElementById("noteInput");
  const saveStatus = document.getElementById("saveStatus");
  const commitBtn = document.getElementById("commitBtn");

  // State
  let globalToken = null;

  // Utilities
  const showView = (view) => {
    loader.classList.add("hidden");
    authView.classList.add("hidden");
    workspaceView.classList.add("hidden");
    if (view === "auth") {
      authView.classList.remove("hidden");
      logoutBtn.classList.add("hidden");
    } else if (view === "workspace") {
      workspaceView.classList.remove("hidden");
      logoutBtn.classList.remove("hidden");
    } else {
      loader.classList.remove("hidden");
      logoutBtn.classList.add("hidden");
    }
  };

  const showStatus = (msg, isError = false) => {
    saveStatus.textContent = msg;
    saveStatus.classList.remove("hidden", "status-success", "status-error");
    saveStatus.classList.add(isError ? "status-error" : "status-success");
    setTimeout(() => saveStatus.classList.add("hidden"), 3000);
  };

  const detectType = (text) => {
    if (text.startsWith("http://") || text.startsWith("https://")) return "link";
    if (text.includes("function") || text.includes("{") || text.includes("const ") || text.includes("let ")) return "code";
    return "text";
  };

  // Initialize
  const initialize = async () => {
    showView("loader");
    const { token } = await chrome.storage.local.get("token");
    if (token) {
      globalToken = token;
      await loadWorkspace();
    } else {
      showView("auth");
    }
  };

  const loadWorkspace = async () => {
    try {
      showView("loader");
      
      // Fetch Folders
      const res = await fetch(`${API_URL}/folders`, {
        headers: { "Authorization": `Bearer ${globalToken}` }
      });
      if (res.status === 401) throw new Error("Unauthorized");
      
      const data = await res.json();
      if (data.success) {
        folderSelect.innerHTML = `<option value="" disabled selected>Target Directory...</option>`;
        data.data.forEach(f => {
          const opt = document.createElement("option");
          opt.value = f._id;
          opt.textContent = f.name;
          folderSelect.appendChild(opt);
        });

        if(data.data.length > 0) folderSelect.value = data.data[0]._id; // default to first

        // Buffer Copied Data
        const { copiedData, copiedType, lastUsedFolderId } = await chrome.storage.local.get(["copiedData", "copiedType", "lastUsedFolderId"]);
        
        const updateCommitBtnText = () => {
          if (folderSelect.value && folderSelect.value === lastUsedFolderId) {
            const folderName = data.data.find(f => f._id === lastUsedFolderId)?.name || "";
            commitBtn.textContent = folderName ? `QUICK SAVE: ${folderName.toUpperCase()}` : "COMMIT";
          } else {
            commitBtn.textContent = "COMMIT";
          }
        };

        if (lastUsedFolderId && data.data.some(f => f._id === lastUsedFolderId)) {
          folderSelect.value = lastUsedFolderId;
        } else if (data.data.length > 0) {
          folderSelect.value = data.data[0]._id; // default to first
        }

        updateCommitBtnText();
        folderSelect.addEventListener("change", updateCommitBtnText);

        if (copiedData) {
           contentInput.value = copiedData;
           typeSelect.value = copiedType || detectType(copiedData);
        }

        showView("workspace");
      } else {
         throw new Error("Failed to load");
      }
    } catch (e) {
      console.warn(e);
      await handleLogout();
    }
  };

  const handleLogout = async () => {
    globalToken = null;
    await chrome.storage.local.remove("token");
    showView("auth");
  };

  // Listeners
  logoutBtn.addEventListener("click", handleLogout);

  syncWebBtn.addEventListener("click", async () => {
    syncWebBtn.textContent = "SYNCING...";
    authError.classList.add("hidden");

    try {
      const urls = [
        "http://localhost:5173/*", 
        "https://devlink-v9e2.onrender.com/*",
        "https://devlink-mauve.vercel.app/*"
      ];
      const tabs = await chrome.tabs.query({ url: urls });

      let targetTab = tabs.length > 0 ? tabs[0] : null;
      let popupWindowId = null;

      // If no web app tab is open, open a small popup window
      if (!targetTab) {
        const win = await chrome.windows.create({
          url: "http://localhost:5173/login",
          type: "popup",
          width: 450,
          height: 600,
          focused: true
        });
        targetTab = win.tabs[0];
        popupWindowId = win.id;
      }

      // Check for token immediately, or poll if it's the popup
      const checkToken = async () => {
        try {
          const results = await chrome.scripting.executeScript({
            target: { tabId: targetTab.id },
            func: () => {
              return localStorage.getItem("token");
            }
          });

          const token = results[0]?.result;

          if (token) {
            globalToken = token;
            await chrome.storage.local.set({ token: globalToken });
            
            // Close the popup window if we created one
            if (popupWindowId) {
              await chrome.windows.remove(popupWindowId);
            }
            
            await loadWorkspace();
          } else {
            // If token not found yet, keep polling every 1 second
            setTimeout(checkToken, 1000);
          }
        } catch (e) {
          // Tab might have been closed manually by the user
          authError.textContent = "Sync cancelled.";
          authError.classList.remove("hidden");
          syncWebBtn.innerHTML = `
            <svg style="width: 14px; height: 14px; background: white; border-radius: 50%; padding: 1px;" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Sync with Web App
          `;
        }
      };

      checkToken();

    } catch (e) {
      authError.textContent = e.message;
      authError.classList.remove("hidden");
    }
  });

  saveForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    if(!folderSelect.value) {
      showStatus("SELECT DIRECTORY FIRST", true);
      return;
    }

    commitBtn.textContent = "SYNCING...";
    commitBtn.disabled = true;

    try {
      const res = await fetch(`${API_URL}/items`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${globalToken}`
        },
        body: JSON.stringify({
          content: contentInput.value.trim(),
          note: noteInput.value.trim(),
          type: typeSelect.value,
          folderId: folderSelect.value
        })
      });

      const data = await res.json();
      if(data.success) {
        showStatus("PAYLOAD SECURED");
        await chrome.storage.local.set({ lastUsedFolderId: folderSelect.value });
        contentInput.value = "";
        noteInput.value = "";
        await chrome.storage.local.remove(["copiedData", "copiedType"]);
      } else {
        throw new Error(data.message || "Failed to sync");
      }
    } catch (e) {
      console.warn(e);
      showStatus("SYNC FAILURE", true);
    } finally {
      commitBtn.textContent = "COMMIT";
      commitBtn.disabled = false;
    }
  });

  // Start
  initialize();
});