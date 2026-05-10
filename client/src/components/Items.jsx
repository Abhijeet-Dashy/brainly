import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function Items({
  isOpen,
  onClose,
  item,
  authFetch,
  onItemDeleted,
}) {
  const [content, setContent] = useState("");
  const [note, setNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (item) {
      setContent(item.content || "");
      setNote(item.note || "");
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const res = await authFetch(`/api/items/${item._id}`, {
        method: "PATCH",
        body: JSON.stringify({ content, note }),
      });
      if (res.ok) {
        toast.success("Item updated successfully");
        onClose();
      } else {
        toast.error("Failed to update item");
      }
    } catch (err) {
      toast.error("Network error: failed to update");
      console.error("Save failed", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await authFetch(`/api/items/${item._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Item deleted");
        onItemDeleted(item._id);
      } else {
        toast.error("Failed to delete item");
      }
    } catch (err) {
      toast.error("Network error: failed to delete");
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8 font-inter">
      {/* Brutalist Backdrop */}
      <div
        className="absolute inset-0 bg-[#f5f5f5]/80 dark:bg-[#0a0a0a]/90 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="absolute inset-0 halftone-bg opacity-30 dark:opacity-10 pointer-events-none"></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-8xl bg-[#f5f5f5] dark:bg-[#0a0a0a] border-[3px] border-black dark:border-white shadow-[8px_8px_0_0_rgba(0,0,0,1)] dark:shadow-[8px_8px_0_0_rgba(255,255,255,1)] flex flex-col max-h-[95vh] overflow-hidden z-20">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b-[3px] border-black dark:border-white bg-[#e0e0e0] dark:bg-[#111111]">
          <div className="flex items-center gap-3">
            <div className="p-1.5 border-2 border-black dark:border-white bg-[#f5f5f5] dark:bg-[#0a0a0a] shadow-[2px_2px_0_0_rgba(0,0,0,1)] dark:shadow-[2px_2px_0_0_rgba(255,255,255,1)]">
              <span className="material-symbols-outlined text-black dark:text-white text-lg">
                {item.type === "link"
                  ? "link"
                  : item.type === "image"
                    ? "image"
                    : item.type === "code"
                      ? "code"
                      : "description"}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-black text-black dark:text-white tracking-tighter uppercase">
                {item.type.toUpperCase()} ITEM
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[9px] font-black text-gray-600 dark:text-gray-400 uppercase tracking-widest">
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString()
                    : "Unknown"}
                </span>
                <span className="w-1 h-1 bg-black dark:bg-white"></span>
                <span className="text-[9px] font-black text-gray-600 dark:text-gray-400 uppercase tracking-widest">
                  UPDATED{" "}
                  {item.updatedAt
                    ? new Date(item.updatedAt).toLocaleDateString()
                    : "Unknown"}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border-2 border-transparent hover:border-black dark:hover:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black text-black dark:text-white transition-all flex items-center justify-center focus:outline-none"
          >
            <span className="material-symbols-outlined font-bold text-[20px]">
              close
            </span>
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-6 bg-[#f5f5f5] dark:bg-[#0a0a0a]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full min-h-[55vh]">
            <section className="lg:col-span-8 flex flex-col">
              <div className="flex items-center justify-between mb-2 border-b-2 border-black dark:border-white pb-1.5">
                <span className="text-xs font-black uppercase tracking-widest text-black dark:text-white">
                  Content / Source
                </span>
                <button
                  onClick={() => navigator.clipboard.writeText(content)}
                  className="flex items-center gap-1 px-2 py-1 border-2 border-black dark:border-white text-[9px] font-black uppercase tracking-widest text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-[#f5f5f5] dark:hover:text-[#0a0a0a] transition-all focus:outline-none"
                >
                  <span className="material-symbols-outlined text-[14px]">
                    content_copy
                  </span>
                  Copy
                </button>
              </div>
              <div className="flex-1 flex flex-col bg-[#f5f5f5] dark:bg-[#0a0a0a] p-3 font-mono text-xs leading-relaxed text-black dark:text-white border-2 border-black dark:border-white shadow-[3px_3px_0_0_rgba(0,0,0,1)] dark:shadow-[3px_3px_0_0_rgba(255,255,255,1)]">
                <textarea
                  className="w-full flex-1 bg-transparent border-none focus:ring-0 resize-none outline-none min-h-[350px] font-bold py-1"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
            </section>

            {/* Sub Content Area (Right Column) */}
            <div className="lg:col-span-4 flex flex-col space-y-6">
              {/* Notes Section */}
              <div className="flex flex-col flex-1">
                <label className="block text-xs font-black uppercase tracking-widest text-black dark:text-white mb-2 border-b-2 border-black dark:border-white pb-1.5">
                  Internal Notes
                </label>
                <div className="relative group flex-1 flex flex-col bg-[#e0e0e0] dark:bg-[#111111] border-2 border-black dark:border-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)]">
                  <textarea
                    className="w-full flex-1 bg-transparent border-none focus:ring-0 p-3 text-xs font-bold leading-relaxed text-black dark:text-white min-h-[140px] placeholder:text-gray-500 dark:placeholder:text-gray-600 outline-none resize-none py-2"
                    placeholder="ADD OBSERVATIONS OR ARCHITECTURAL NOTES..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  ></textarea>
                  <div className="absolute inset-0 halftone-bg opacity-20 dark:opacity-10 pointer-events-none mix-blend-multiply dark:mix-blend-screen"></div>
                </div>
              </div>

              {/* Metadata Section */}
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-black dark:text-white mb-2 border-b-2 border-black dark:border-white pb-1.5">
                    System Info
                  </label>
                  <div className="space-y-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] uppercase font-black tracking-widest text-gray-500 dark:text-gray-500">
                        Record ID
                      </span>
                      <span className="text-[10px] font-mono font-bold text-black dark:text-white truncate bg-[#e0e0e0] dark:bg-[#1a1a1a] p-1.5 border-2 border-black dark:border-white">
                        {item._id}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] uppercase font-black tracking-widest text-gray-500 dark:text-gray-500">
                        Item Type
                      </span>
                      <span className="text-[10px] font-mono font-bold text-black dark:text-white uppercase p-1.5 border-2 border-black dark:border-white bg-[#f5f5f5] dark:bg-[#0a0a0a]">
                        {item.type}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-black dark:text-white mb-2 border-b-2 border-black dark:border-white pb-1.5">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {(item.tags || []).map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 border-2 border-black dark:border-white bg-black dark:bg-white text-white dark:text-black text-[9px] font-black uppercase tracking-widest transition-colors hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white"
                      >
                        {t.toUpperCase()}
                      </span>
                    ))}
                    {(!item.tags || item.tags.length === 0) && (
                      <span className="text-[10px] font-bold text-gray-500 dark:text-gray-500 uppercase tracking-widest">
                        No tags
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-6 py-4 bg-[#e0e0e0] dark:bg-[#111111] border-t-[3px] border-black dark:border-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 px-4 py-2 border-2 border-red-600 bg-[#f5f5f5] dark:bg-[#0a0a0a] text-red-600 text-xs font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-colors w-full sm:w-auto justify-center shadow-[3px_3px_0_0_rgba(220,38,38,1)] active:shadow-none active:translate-y-0.5 focus:outline-none"
          >
            <span className="material-symbols-outlined text-[18px]">
              delete
            </span>
            Purge
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 border-2 border-black dark:border-white text-black dark:text-white text-xs font-black uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all w-full sm:w-auto justify-center focus:outline-none"
            >
              Abort
            </button>
            <button
              disabled={isSaving}
              onClick={handleSave}
              className="px-5 py-2 border-2 border-black dark:border-white bg-black dark:bg-white text-white dark:text-black text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white transition-all shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0_0_rgba(255,255,255,1)] active:shadow-none active:translate-y-0.5 w-full sm:w-auto justify-center disabled:opacity-50 focus:outline-none"
            >
              {isSaving ? "Syncing..." : "Commit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
