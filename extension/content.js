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

   // Brutalist CSS isolated to Shadow DOM
   const style = document.createElement("style");
   style.textContent = `
      * { box-sizing: border-box; font-family: 'Inter', system-ui, sans-serif; margin: 0; padding: 0; }
      .toast-container {
          width: 300px;
          background: #f5f5f5;
          border: 4px solid #000;
          box-shadow: 6px 6px 0 0 rgba(0,0,0,1);
          color: #000;
          display: flex;
          flex-direction: column;
          animation: slideIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }
      @keyframes slideIn {
          from { transform: translateX(120%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
      }
      .halftone {
          position: absolute; top:0; left:0; right:0; bottom:0; z-index: 0; pointer-events: none; opacity: 0.15;
          background-image: radial-gradient(circle, #000 1.5px, transparent 1.5px);
          background-size: 8px 8px;
      }
      .toast-header {
          position: relative; z-index: 10;
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 12px;
          background: #e5e5e5;
          border-bottom: 3px solid #000;
      }
      .brand-group { display: flex; align-items: center; gap: 8px; }
      .logo {
          width: 22px; height: 22px;
          border: 2px solid #000; background: #fff;
          display: flex; align-items: center; justify-content: center;
          font-size: 9px; font-weight: 900; box-shadow: 2px 2px 0 0 #000;
      }
      .title { font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; line-height: 1; }
      
      .save-btn {
          border: 2px solid #000; background: #000; color: #fff;
          padding: 6px 10px; font-size: 9px; font-weight: 900; text-transform: uppercase;
          cursor: pointer; box-shadow: 2px 2px 0 0 #000; transition: all 0.1s;
      }
      .save-btn:hover { background: #fff; color: #000; }
      .save-btn:active { box-shadow: none; transform: translateY(2px); }
      .save-btn:disabled { opacity: 0.7; pointer-events: none; }
      
      .toast-body { 
          position: relative; z-index: 10;
          padding: 16px; display: flex; flex-direction: column; gap: 10px; 
      }
      .hidden { display: none !important; }
      
      .label-text { font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 2px solid #000; padding-bottom: 2px;}
      
      .select-row { display: flex; gap: 6px; align-items: stretch; }
      .select-row select { flex: 1; }
      
      select {
          border: 2px solid #000; padding: 8px 10px;
          background: #fff; font-size: 10px; font-weight: bold; text-transform: uppercase;
          outline: none; cursor: pointer; transition: 0.2s;
      }
      select:focus { box-shadow: 3px 3px 0 0 #000; }

      .add-dir-btn {
          border: 2px solid #000; background: #fff; color: #000;
          padding: 0 8px; font-size: 14px; font-weight: 900; cursor: pointer;
          transition: all 0.1s; display: flex; align-items: center; justify-content: center;
          min-width: 32px;
      }
      .add-dir-btn:hover { background: #000; color: #fff; }
      .add-dir-btn:active { box-shadow: none; transform: translateY(1px); }
      
      .new-dir-row {
          display: flex; gap: 6px; align-items: stretch;
      }
      .new-dir-input {
          flex: 1; border: 2px solid #000; padding: 6px 8px;
          background: #fff; font-size: 10px; font-weight: bold; text-transform: uppercase;
          outline: none; font-family: inherit;
      }
      .new-dir-input:focus { box-shadow: 3px 3px 0 0 #000; }
      .new-dir-input::placeholder { color: #999; }
      .new-dir-create-btn {
          border: 2px solid #000; background: #000; color: #fff;
          padding: 6px 10px; font-size: 9px; font-weight: 900; text-transform: uppercase;
          cursor: pointer; transition: all 0.1s; white-space: nowrap;
      }
      .new-dir-create-btn:hover { background: #fff; color: #000; }
      .new-dir-create-btn:active { transform: translateY(1px); }
      .new-dir-create-btn:disabled { opacity: 0.7; pointer-events: none; }
      
      .commit-btn {
          width: 100%; padding: 10px; border: 2px solid #000; background: #000; color: #fff;
          font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em;
          cursor: pointer; box-shadow: 4px 4px 0 0 #000; transition: 0.1s;
      }
      .commit-btn:hover { box-shadow: 6px 6px 0 0 #000; transform: translateY(-1px); }
      .commit-btn:active { box-shadow: none; transform: translateY(2px); }
      .commit-btn:disabled { opacity: 0.7; pointer-events: none; }
   `;

   const container = document.createElement("div");
   container.className = "toast-container";
   
   container.innerHTML = `
      <div class="halftone"></div>
      <div class="toast-header" id="toastHeader">
         <div class="brand-group">
            <div class="logo">DL</div>
            <span class="title">CONSOLE</span>
         </div>
         <button class="save-btn" id="initialSaveBtn">CAPTURE</button>
      </div>
      <div class="toast-body hidden" id="toastBody">
         <span class="label-text">Select Destination</span>
         <div class="select-row">
            <select id="folderSelect">
               <option value="" disabled selected>Ping Brainly...</option>
            </select>
            <button class="add-dir-btn" id="addDirBtn" title="Create new directory">+</button>
         </div>
         <div class="new-dir-row hidden" id="newDirRow">
            <input class="new-dir-input" id="newDirInput" type="text" placeholder="DIR NAME..." maxlength="30" />
            <button class="new-dir-create-btn" id="newDirCreateBtn">INIT</button>
         </div>
         <button class="commit-btn" id="commitBtn">Commit Block</button>
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