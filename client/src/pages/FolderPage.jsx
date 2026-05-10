import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ItemCard from "../components/ItemCard";
import Items from "../components/Items";
import { useAuthStore } from "../store/authStore";
import NewFolderModal from "../components/NewFolderModal";
import NewItemModal from "../components/NewItemModal";
import Loader from "../components/Loader";

export default function FolderPage() {
  const { folderId } = useParams();
  const authFetch = useAuthStore((state) => state.authFetch);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Folders for sidebar
  const [folders, setFolders] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
  };

  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);
        // Fetch folders for sidebar
        const fRes = await authFetch("/api/folders");
        const fData = await fRes.json();
        if (fData.success) {
          setFolders(fData.data);
        }

        // Fetch items for current folder
        if (folderId) {
          const params = new URLSearchParams({ folderId });
          if (debouncedSearch) params.append("search", debouncedSearch);

          const iRes = await authFetch(`/api/items?${params.toString()}`);
          const iData = await iRes.json();
          if (iData.success) {
            setItems(iData.data);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, [folderId, authFetch, debouncedSearch]);

  const handleAddItem = () => {
    setIsNewItemModalOpen(true);
  };

  const toggleFavorite = async (e, item) => {
    e.stopPropagation();
    try {
      const res = await authFetch(`/api/items/${item._id}`, {
        method: "PATCH",
        body: JSON.stringify({ isFavorite: !item.isFavorite }),
      });
      if (res.ok) {
        setItems(items.map(i => i._id === item._id ? { ...i, isFavorite: !item.isFavorite } : i));
      }
    } catch(err) {
      console.error(err);
    }
  };

  const activeFolder = folders.find((f) => f._id === folderId);

  return (
    <div className="bg-[#e5e5e5] dark:bg-[#1a1a1a] font-inter text-black dark:text-white min-h-screen relative flex selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors">
      {/* Global Halftone Overlay */}
      <div className="absolute inset-0 halftone-bg opacity-30 dark:opacity-10 pointer-events-none mix-blend-multiply dark:mix-blend-screen z-0"></div>

      {/* SideNavBar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 p-4 gap-4 h-screen w-64 bg-[#f5f5f5] dark:bg-[#0a0a0a] border-r-2 border-black dark:border-white z-40 transition-colors">
        <div className="flex items-center gap-3 mt-2 px-2">
          <div className="w-10 h-10 border-2 border-black dark:border-white bg-[#f5f5f5] dark:bg-[#0a0a0a] shadow-[3px_3px_0_0_rgba(0,0,0,1)] dark:shadow-[3px_3px_0_0_rgba(255,255,255,1)] flex items-center justify-center text-black dark:text-white">
            <span className="material-symbols-outlined text-2xl">
              grid_view
            </span>
          </div>
          <div>
            <Link to="/">
              <h1 className="text-xl font-black text-black dark:text-white tracking-tighter uppercase mb-0.5">
                Brainly
              </h1>
            </Link>
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
              {user?.username || "Workspace"}
            </p>
          </div>
        </div>

        <nav className="flex-1 mt-3 flex flex-col gap-1.5 overflow-y-auto px-1">
          <Link
            className="flex items-center gap-2.5 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-[#0a0a0a] hover:bg-black/5 dark:hover:bg-white hover:border-black dark:hover:border-white border-2 border-transparent px-3 py-2 transition-colors"
            to="/dashboard"
          >
            <span className="material-symbols-outlined text-[18px]">
              grid_view
            </span>
            <span className="text-[11px] font-black uppercase tracking-widest">
              Dashboard
            </span>
          </Link>

          <div className="h-3 border-l-2 border-black dark:border-white ml-5 my-1 opacity-20"></div>

          {folders.map((f) => {
            const isActive = f._id === folderId;
            return (
              <Link
                key={f._id}
                className={`flex items-center gap-2.5 px-3 py-2 border-2 transition-colors ${
                  isActive
                    ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-[3px_3px_0_0_rgba(0,0,0,1)] dark:shadow-[3px_3px_0_0_rgba(255,255,255,1)]"
                    : "text-gray-600 dark:text-gray-400 border-transparent hover:text-black dark:hover:text-[#0a0a0a] hover:bg-black/5 dark:hover:bg-white hover:border-black dark:hover:border-white"
                }`}
                to={`/folder/${f._id}`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isActive ? "folder_open" : "folder"}
                </span>
                <span className="text-[11px] font-black uppercase tracking-widest truncate">
                  {f.name}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-2 py-3 border-t-2 border-black dark:border-white">
          <button
            onClick={() => setIsNewFolderModalOpen(true)}
            className="w-full py-2 bg-[#e5e5e5] dark:bg-[#1a1a1a] border-2 border-black dark:border-white text-black dark:text-white font-black text-[10px] uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all shadow-[3px_3px_0_0_rgba(0,0,0,1)] dark:shadow-[3px_3px_0_0_rgba(255,255,255,1)] hover:shadow-none hover:translate-y-0.5"
          >
            CREATE FOLDER
          </button>

          <div className="flex justify-between items-center mt-2 px-1">
            <button
              className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white p-1.5 flex items-center gap-1.5 transition-colors uppercase text-[9px] font-black tracking-widest"
              title="Settings"
            >
              <span className="material-symbols-outlined text-sm">
                settings
              </span>{" "}
              Set
            </button>
            <button
              className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-1.5 flex items-center gap-1.5 transition-colors uppercase text-[9px] font-black tracking-widest"
              title="Trash"
            >
              <span className="material-symbols-outlined text-sm">delete</span>{" "}
              Purge
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="md:ml-64 min-h-screen relative flex flex-col w-full z-10">
        {/* TopNavBar */}
        <header className="fixed top-0 left-0 right-0 md:left-64 z-40 h-14 flex justify-between items-center px-6 border-b-2 border-black dark:border-white bg-[#f5f5f5] dark:bg-[#0a0a0a] transition-colors">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative w-full max-w-[280px]">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg">
                search
              </span>
              <input
                className="w-full bg-[#e5e5e5] dark:bg-[#1a1a1a] border-2 border-black dark:border-white pl-9 pr-3 py-1.5 text-xs font-bold text-black dark:text-white focus:bg-white dark:focus:bg-black focus:shadow-[3px_3px_0_0_rgba(0,0,0,1)] dark:focus:shadow-[3px_3px_0_0_rgba(255,255,255,1)] placeholder:text-gray-500 outline-none transition-all uppercase tracking-widest"
                placeholder="Index query..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 ml-3">
            <button
              onClick={toggleDarkMode}
              className="p-1.5 border-2 border-transparent hover:border-black dark:hover:border-white rounded-none transition-all text-black dark:text-white flex items-center justify-center"
              title="Toggle Dark Mode"
            >
              <span className="material-symbols-outlined text-[18px] font-bold">
                dark_mode
              </span>
            </button>
            <div className="h-4 w-[2px] bg-black dark:bg-white opacity-20 mx-0.5"></div>
            <button
              onClick={logout}
              className="p-1.5 border-2 border-transparent hover:border-red-600 dark:hover:border-red-500 hover:text-red-600 dark:hover:text-red-500 transition-all flex items-center text-black dark:text-white"
              title="Logout"
            >
              <span className="material-symbols-outlined text-[18px] font-bold">
                logout
              </span>
            </button>
            <div className="flex items-center gap-2 bg-[#e5e5e5] dark:bg-[#1a1a1a] border-2 border-black dark:border-white px-2 py-1 shadow-[2px_2px_0_0_rgba(0,0,0,1)] dark:shadow-[2px_2px_0_0_rgba(255,255,255,1)]">
              <div className="text-right hidden sm:block px-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-black dark:text-white leading-none">
                  {user?.username || "User"}
                </p>
              </div>
              <div className="w-5 h-5 bg-black dark:bg-white text-white dark:text-black font-black flex items-center justify-center uppercase text-[10px]">
                {user?.username?.[0] || "U"}
              </div>
            </div>
          </div>
        </header>

        {/* Content Canvas */}
        <section className="pt-24 px-6 pb-12 flex-1 max-w-6xl mx-auto w-full relative z-10">
          {/* Folder Header & Action Bar */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <nav className="flex items-center gap-2 text-[9px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                <Link
                  to="/dashboard"
                  className="hover:text-black dark:hover:text-white underline decoration-2 underline-offset-2"
                >
                  FDIR
                </Link>
                <span className="material-symbols-outlined text-xs font-bold">
                  chevron_right
                </span>
                <span className="text-black dark:text-white">
                  {activeFolder?.name || "Folder"}
                </span>
              </nav>
              <h2 className="text-3xl md:text-4xl font-black text-black dark:text-white tracking-tighter uppercase mb-3 leading-none">
                {activeFolder?.name || "Folder Content"}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 font-bold max-w-xl uppercase tracking-widest text-[10px] border-l-[2px] border-black dark:border-white pl-3">
                Structured repository designated for encapsulated nodes and
                active snippet retrieval.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Controls */}
              <div className="flex bg-[#f5f5f5] dark:bg-[#0a0a0a] border-2 border-black dark:border-white shadow-[3px_3px_0_0_rgba(0,0,0,1)] dark:shadow-[3px_3px_0_0_rgba(255,255,255,1)] overflow-hidden">
                <button className="px-2 py-1.5 bg-black dark:bg-white text-white dark:text-black border-r-2 border-black dark:border-white">
                  <span className="material-symbols-outlined font-bold text-lg">
                    grid_view
                  </span>
                </button>
                <button className="px-2 py-1.5 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-black/10 transition-colors">
                  <span className="material-symbols-outlined font-bold text-lg">
                    format_list_bulleted
                  </span>
                </button>
              </div>

              <button
                onClick={handleAddItem}
                className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-[#f5f5f5] dark:text-black font-black uppercase tracking-widest border-2 border-black dark:border-white shadow-[4px_4px_0_0_rgba(107,114,128,0.5)] dark:shadow-[4px_4px_0_0_rgba(107,114,128,0.5)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_rgba(107,114,128,0.8)] active:shadow-none active:translate-y-0 transition-all text-xs"
              >
                <span className="material-symbols-outlined font-bold text-base">
                  add
                </span>
                LOG ITEM
              </button>
            </div>
          </div>

          {/* Grid of Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-start">
            {loading ? (
              <div className="col-span-3 py-16">
                <Loader size="lg" text="Syncing blocks..." />
              </div>
            ) : items.length === 0 ? (
              <div className="col-span-3 text-center border-2 border-dashed border-gray-400 dark:border-gray-600 p-10 bg-white/50 dark:bg-black/50">
                <p className="text-sm font-black uppercase tracking-widest text-gray-500 dark:text-gray-500 mb-4">
                  Sector clear. Ready for commit.
                </p>
                <button
                  onClick={handleAddItem}
                  className="px-5 py-2.5 bg-[#e5e5e5] dark:bg-[#1a1a1a] border-2 border-black dark:border-white text-black dark:text-white font-black text-xs uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                >
                  INITIALIZE
                </button>
              </div>
            ) : (
              items.map((item, idx) => (
                <ItemCard
                  key={item._id}
                  icon={
                    item.type === "link"
                      ? "link"
                      : item.type === "image"
                        ? "image"
                        : item.type === "code"
                          ? "code"
                          : "description"
                  }
                  color={
                    idx % 3 === 0
                      ? "primary"
                      : idx % 3 === 1
                        ? "secondary"
                        : "tertiary"
                  }
                  title={item.content}
                  description={item.note || ""}
                  tags={item.tags || []}
                  isFavorite={item.isFavorite}
                  onToggleFavorite={(e) => toggleFavorite(e, item)}
                  imageSrc={item.type === "image" ? item.sourceUrl : null}
                  onClick={() => setSelectedItem(item)}
                />
              ))
            )}
          </div>
        </section>
      </main>

      {/* Mobile Navigation Shell */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-[#f5f5f5] dark:bg-[#0a0a0a] border-2 border-black dark:border-white flex justify-around items-center py-3 shadow-[6px_6px_0_0_rgba(0,0,0,1)] dark:shadow-[6px_6px_0_0_rgba(255,255,255,1)] z-50 transition-colors">
        <Link
          className="text-gray-500 hover:text-black dark:hover:text-white flex flex-col items-center gap-0.5 transition-colors"
          to="/dashboard"
        >
          <span
            className="material-symbols-outlined text-[20px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            grid_view
          </span>
          <span className="text-[9px] font-black uppercase tracking-widest">
            Home
          </span>
        </Link>
        <div className="relative -top-6 ml-auto mr-auto">
          <button
            onClick={handleAddItem}
            className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-white rounded-none shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] flex items-center justify-center transform transition-transform active:translate-y-0.5 active:shadow-none"
          >
            <span className="material-symbols-outlined font-bold text-2xl">
              add
            </span>
          </button>
        </div>
        <button
          onClick={logout}
          className="text-gray-500 hover:text-red-500 flex flex-col items-center gap-0.5 transition-colors"
        >
          <span className="material-symbols-outlined font-bold text-[20px]">
            logout
          </span>
          <span className="text-[9px] font-black uppercase tracking-widest">
            Exit
          </span>
        </button>
      </nav>

      <NewFolderModal
        isOpen={isNewFolderModalOpen}
        onClose={() => setIsNewFolderModalOpen(false)}
        onFolderCreated={(folder) => setFolders([...folders, folder])}
      />
      <NewItemModal
        isOpen={isNewItemModalOpen}
        onClose={() => setIsNewItemModalOpen(false)}
        folderId={folderId}
        onItemCreated={(item) => setItems([item, ...items])}
      />

      {/* Render Items Modal if an item is selected */}
      <Items
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        item={selectedItem}
        onItemDeleted={(id) => {
          setItems(items.filter((i) => i._id !== id));
          setSelectedItem(null);
        }}
        authFetch={authFetch}
      />
    </div>
  );
}
