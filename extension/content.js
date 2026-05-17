const API_URL = "https://devlink-v9e2.onrender.com/api";
let toastTimeout;

document.addEventListener("copy", async () => {
    // Capture selection synchronously before it gets cleared by copy action
    const selectionObj = document.getSelection();
    const selection = selectionObj ? selectionObj.toString().trim() : "";
    const rect = (selectionObj && selectionObj.rangeCount > 0) ? selectionObj.getRangeAt(0).getBoundingClientRect() : null;
    
    if (!selection) return;
    
    // Small delay to let copy complete, then show the toast
    setTimeout(async () => {
       try {
            // Check if Brainly Extension is Authenticated
           const { token, lastUsedFolderId } = await chrome.storage.local.get(["token", "lastUsedFolderId"]);

            // Stash locally in case they open popup instead
           chrome.storage.local.set({ copiedData: selection, copiedType: detectType(selection) });
           
           // Inject Floating Prompt
           showBrainlyToast(selection, token || null, lastUsedFolderId || null, rect);
       } catch(error) { 
           console.warn("Brainly Auto-Capture Error", error); 
       }
    }, 50);
});

const detectType = (text) => {
   if (text.startsWith("http://") || text.startsWith("https://")) return "link";
   if (text.includes("function") || text.includes("{") || text.includes("const ") || text.includes("let ")) return "code";
   return "text";
};

function showBrainlyToast(text, token, lastUsedFolderId, rect) {
   // Remove any existing toast
   const existing = document.getElementById("brainly-toast-host");
   if (existing) existing.remove();

   // Create Host DOM node globally
   const host = document.createElement("div");
   host.id = "brainly-toast-host";
   host.style.position = "fixed";
   host.style.zIndex = "2147483647"; // Max z-index

   if (rect) {
      let topPos = rect.bottom + 10;
      let leftPos = rect.left + (rect.width / 2) - 150;
      if (leftPos < 10) leftPos = 10;
      if (leftPos + 310 > window.innerWidth) leftPos = window.innerWidth - 310;
      if (topPos + 180 > window.innerHeight) {
         topPos = rect.top - 180;
         if (topPos < 10) topPos = 10;
      }
      host.style.top = `${topPos}px`;
      host.style.left = `${leftPos}px`;
   } else {
      host.style.bottom = "24px";
      host.style.right = "24px";
   }
   
   document.body.appendChild(host);

   // Create isolated Shadow DOM
   const shadow = host.attachShadow({ mode: "open" });

   // Minimal CSS isolated to Shadow DOM
   const style = document.createElement("style");
   style.textContent = `
      * { box-sizing: border-box; font-family: 'Inter', system-ui, sans-serif; margin: 0; padding: 0; }
      .toast-container {
          width: 100px;
          background: #fff;
          border: 2px solid #000;
          box-shadow: 2px 2px 0 0 rgba(0,0,0,0.8);
          border-radius: 4px;
          color: #000;
          display: flex;
          flex-direction: column;
          animation: slideIn 0.2s ease-out;
          overflow: hidden;
      }
      @keyframes slideIn {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
      }
      .toast-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 8px;
          background: #f9f9f9;
          border-bottom: 1px solid #eaeaea;
      }
      .brand-group { display: flex; align-items: center; gap: 6px; }
      .logo {
          width: 16px; height: 16px;
          background: #000; color: #fff; border-radius: 3px;
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 900;
      }
      .title { font-size: 11px; font-weight: 700; color: #333; }
      
      .save-btn {
          border: 1px solid #000; background: #fff; color: #000; border-radius: 3px;
          padding: 4px 8px; font-size: 10px; font-weight: 700;
          cursor: pointer; transition: all 0.1s;
      }
      .save-btn:hover { background: #000; color: #fff; }
      .save-btn:active { transform: translateY(1px); }
      .save-btn:disabled { opacity: 0.5; pointer-events: none; }
      
      .toast-body { 
          padding: 8px; display: flex; flex-direction: column; gap: 8px; 
          background: #fff;
      }
      .hidden { display: none !important; }
      
      .select-row { display: flex; gap: 4px; align-items: stretch; }
      .select-row select { flex: 1; }
      
      select {
          border: 1px solid #ccc; border-radius: 3px; padding: 6px;
          background: #fff; font-size: 11px; color: #333;
          outline: none; cursor: pointer;
      }
      select:focus { border-color: #000; }

      .icon-btn {
          border: 1px solid #ccc; background: #f5f5f5; color: #333; border-radius: 3px;
          padding: 0 6px; font-size: 14px; font-weight: bold; cursor: pointer;
          min-width: 28px; display: flex; align-items: center; justify-content: center;
      }
      .icon-btn:hover { background: #e0e0e0; border-color: #999; }
      
      .new-dir-row { display: flex; gap: 4px; align-items: stretch; }
      .new-dir-input {
          flex: 1; border: 1px solid #ccc; border-radius: 3px; padding: 6px;
          background: #fff; font-size: 11px; outline: none;
      }
      .new-dir-input:focus { border-color: #000; }
      
      .commit-btn {
          width: 100%; padding: 8px; border: none; background: #000; color: #fff; border-radius: 3px;
          font-size: 11px; font-weight: 700; cursor: pointer; transition: 0.1s;
      }
      .commit-btn:hover { background: #333; }
      .commit-btn:active { transform: translateY(1px); }
      .commit-btn:disabled { opacity: 0.5; pointer-events: none; }
   `;

   const container = document.createElement("div");
   container.className = "toast-container";
   
   container.innerHTML = `
      <div class="toast-header" id="toastHeader">
         <div class="brand-group">
            <div class="logo">B</div>
         </div>
         <button class="save-btn" id="initialSaveBtn">Capture</button>
      </div>
      <div class="toast-body hidden" id="toastBody">
         <div class="select-row">
            <select id="folderSelect">
               <option value="" disabled selected>Loading...</option>
            </select>
            <button class="icon-btn" id="addDirBtn" title="New Folder">+</button>
         </div>
         <div class="new-dir-row hidden" id="newDirRow">
            <input class="new-dir-input" id="newDirInput" type="text" placeholder="Folder Name" maxlength="30" />
            <button class="icon-btn" id="newDirCreateBtn">✓</button>
         </div>
         <button class="commit-btn" id="commitBtn">Commit</button>
      </div>
   `;

   shadow.appendChild(style);
   shadow.appendChild(container);

   // Map elements
   const body = shadow.getElementById("toastBody");
   const initialBtn = shadow.getElementById("initialSaveBtn");
   const folderSelect = shadow.getElementById("folderSelect");
   const commitBtn = shadow.getElementById("commitBtn");
   const addDirBtn = shadow.getElementById("addDirBtn");
   const newDirRow = shadow.getElementById("newDirRow");
   const newDirInput = shadow.getElementById("newDirInput");
   const newDirCreateBtn = shadow.getElementById("newDirCreateBtn");

   // Auto-dismiss the toast if they ignore it
   toastTimeout = setTimeout(() => {
       if(host) host.remove();
   }, 5000);

   // Toggle new directory input
   addDirBtn.addEventListener("click", () => {
      const isVisible = !newDirRow.classList.contains("hidden");
      if (isVisible) {
         newDirRow.classList.add("hidden");
         addDirBtn.textContent = "+";
      } else {
         newDirRow.classList.remove("hidden");
         addDirBtn.textContent = "×";
         newDirInput.focus();
      }
   });

   // Create new directory
   newDirCreateBtn.addEventListener("click", async () => {
      const name = newDirInput.value.trim();
      if (!name) return;

      newDirCreateBtn.textContent = "...";
      newDirCreateBtn.disabled = true;

      try {
         const data = await chrome.runtime.sendMessage({
            action: "CREATE_FOLDER",
            token,
            name
         });

         if (data && data.success) {
            // Add to dropdown and select it
            const opt = document.createElement("option");
            opt.value = data.data._id;
            opt.textContent = data.data.name;
            folderSelect.appendChild(opt);
            folderSelect.value = data.data._id;
            
            // Reset UI
            newDirInput.value = "";
            newDirRow.classList.add("hidden");
            addDirBtn.textContent = "+";
            newDirCreateBtn.textContent = "INIT";
            newDirCreateBtn.disabled = false;
            commitBtn.textContent = "COMMIT BLOCK";
         } else {
            throw new Error(data?.message || "Failed");
         }
      } catch(e) {
         newDirCreateBtn.textContent = "ERR";
         newDirCreateBtn.style.background = "#dc2626";
         setTimeout(() => {
            newDirCreateBtn.textContent = "INIT";
            newDirCreateBtn.style.background = "#000";
            newDirCreateBtn.disabled = false;
         }, 1500);
      }
   });

   // Enter key to submit new directory
   newDirInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
         e.preventDefault();
         newDirCreateBtn.click();
      }
   });

   // Expand interface
   initialBtn.addEventListener("click", async () => {
      clearTimeout(toastTimeout); // Stop the auto-dismiss
      
      if (!token) {
          initialBtn.textContent = "AUTH REQUIRED";
          initialBtn.style.background = "#dc2626";
          setTimeout(() => host.remove(), 2500);
          return;
      }

      body.classList.remove("hidden");
      initialBtn.textContent = "SYNCING";
      initialBtn.disabled = true;

      try {
         const data = await chrome.runtime.sendMessage({ 
             action: "GET_FOLDERS", 
             token 
         });
         
         if (data && data.success && data.data.length > 0) {
            folderSelect.innerHTML = "";
            data.data.forEach(f => {
               const opt = document.createElement("option");
               opt.value = f._id;
               opt.textContent = f.name;
               folderSelect.appendChild(opt);
            });
            
            const updateCommitBtnText = () => {
                if (folderSelect.value && folderSelect.value === lastUsedFolderId) {
                    const fname = data.data.find(f => f._id === lastUsedFolderId)?.name || "";
                    commitBtn.textContent = fname ? `QUICK SAVE: ${fname.toUpperCase().substring(0, 10)}${fname.length > 10 ? '...' : ''}` : "COMMIT BLOCK";
                } else {
                    commitBtn.textContent = "COMMIT BLOCK";
                }
            };

            if (lastUsedFolderId && data.data.some(f => f._id === lastUsedFolderId)) {
                folderSelect.value = lastUsedFolderId;
            } else {
                folderSelect.value = data.data[0]._id;
            }
            
            updateCommitBtnText();
            folderSelect.addEventListener("change", updateCommitBtnText);
            
            initialBtn.textContent = "LINKED";
         } else if (data && data.success && data.data.length === 0) {
            // No folders yet — show empty dropdown and let user create one
            folderSelect.innerHTML = '<option value="" disabled selected>NO DIRS — CREATE ONE</option>';
            initialBtn.textContent = "LINKED";
         } else {
            throw new Error();
         }
      } catch(e) {
         initialBtn.textContent = "ERR_DB";
      }
   });

   // Commit Sequence
   commitBtn.addEventListener("click", async () => {
       if(!folderSelect.value) return;
       
       commitBtn.textContent = "COMMITTING...";
       commitBtn.disabled = true;

       try {
           const data = await chrome.runtime.sendMessage({
               action: "POST_ITEM",
               token,
               payload: {
                 content: text,
                 type: detectType(text),
                 folderId: folderSelect.value
               }
           });
           
           if(data && data.success) {
               commitBtn.textContent = "DATA SECURED.";
               commitBtn.style.background = "#fff";
               commitBtn.style.color = "#000";
               
               // Save last used folder ID
               await chrome.storage.local.set({ lastUsedFolderId: folderSelect.value });
               
               // Clear the chrome storage since we used it
               await chrome.storage.local.remove(["copiedData", "copiedType"]);
               
               setTimeout(() => { if(host) host.remove(); }, 1200);
           } else { 
               throw new Error(data ? data.message : "Failed"); 
           }
       } catch(e) {
           commitBtn.textContent = "FAILED";
           commitBtn.style.background = "#dc2626";
           commitBtn.disabled = false;
       }
   });
}