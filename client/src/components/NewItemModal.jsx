import React, { useState } from "react";
import Modal from "./Modal";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

export default function NewItemModal({
  isOpen,
  onClose,
  folderId,
  onItemCreated,
}) {
  const [content, setContent] = useState("");
  const [note, setNote] = useState("");
  const [type, setType] = useState("text");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const authFetch = useAuthStore((state) => state.authFetch);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("Item content is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await authFetch("/api/items", {
        method: "POST",
        body: JSON.stringify({
          content: content.trim(),
          note: note.trim(),
          type,
          folderId,
        }),
      });
      const data = await response.json();

      if (data.success) {
        toast.success(`Item created successfully!`);
        onItemCreated(data.data);
        setContent("");
        setNote("");
        setType("text");
        onClose();
      } else {
        toast.error(data.message || "Failed to create item");
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error. Failed to create item.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Initialize Item">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-[9px] font-black text-black dark:text-white uppercase tracking-widest border-b-2 border-black dark:border-white pb-1">
            Resource Type
          </label>
          <div className="flex border-2 border-black dark:border-white shadow-[2px_2px_0_0_rgba(0,0,0,1)] dark:shadow-[2px_2px_0_0_rgba(255,255,255,1)]">
            {["text", "link", "image", "code"].map((t, index, arr) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest transition-colors ${index !== arr.length - 1 ? "border-r-2 border-black dark:border-white" : ""} ${
                  type === t
                    ? "bg-black dark:bg-white text-white dark:text-black hover:bg-black"
                    : "bg-[#f5f5f5] dark:bg-[#0a0a0a] text-gray-500 hover:text-black dark:hover:text-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-[9px] font-black text-black dark:text-white uppercase tracking-widest border-b-2 border-black dark:border-white pb-1">
            Data Source / Content
          </label>
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSubmitting}
            className="w-full bg-[#e0e0e0] dark:bg-[#111111] border-2 border-black dark:border-white px-3 py-2.5 text-xs font-bold text-black dark:text-white placeholder:text-gray-500 focus:bg-[#f5f5f5] dark:focus:bg-[#0a0a0a] focus:shadow-[3px_3px_0_0_rgba(0,0,0,1)] dark:focus:shadow-[3px_3px_0_0_rgba(255,255,255,1)] transition-all outline-none"
            placeholder={
              type === "link"
                ? "HTTPS://..."
                : type === "image"
                  ? "IMAGE URL..."
                  : type === "code"
                    ? "PASTE CODE SNIPPET..."
                    : "ENTER TEXT BLOCK..."
            }
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-[9px] font-black text-black dark:text-white uppercase tracking-widest border-b-2 border-black dark:border-white pb-1">
            Internal Note (Optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={isSubmitting}
            rows={3}
            className="w-full bg-[#f5f5f5] dark:bg-[#0a0a0a] border-2 border-black dark:border-white px-3 py-2.5 text-xs font-bold text-black dark:text-white placeholder:text-gray-500 focus:shadow-[3px_3px_0_0_rgba(0,0,0,1)] dark:focus:shadow-[3px_3px_0_0_rgba(255,255,255,1)] transition-all outline-none resize-none"
            placeholder="ADD DETAILS OR CONTEXT..."
          />
        </div>

        <div className="flex gap-3 justify-end pt-3 border-t-2 border-gray-300 dark:border-gray-700 mt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 border-2 border-black dark:border-white text-black dark:text-white text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
          >
            Abort
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="flex items-center gap-2 px-5 py-2 border-2 border-black dark:border-white bg-black dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-widest shadow-[3px_3px_0_0_rgba(0,0,0,1)] dark:shadow-[3px_3px_0_0_rgba(255,255,255,1)] hover:shadow-[5px_5px_0_0_rgba(0,0,0,1)] dark:hover:shadow-[5px_5px_0_0_rgba(255,255,255,1)] active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-50"
          >
            {isSubmitting ? "Syncing..." : "Commit"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
