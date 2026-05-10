import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import NewFolderModal from "../components/NewFolderModal";
import Loader from "../components/Loader";
import ItemCard from "../components/ItemCard";
import Items from "../components/Items";

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const authFetch = useAuthStore((state) => state.authFetch);
  const logout = useAuthStore((state) => state.logout);
  const [folders, setFolders] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (debouncedSearch) params.append("search", debouncedSearch);
        if (filter === "favorites") params.append("favorites", "true");

        const [fRes, iRes] = await Promise.all([
          authFetch("/api/folders"),
          authFetch(`/api/items?${params.toString()}`),
        ]);
        const fData = await fRes.json();
        const iData = await iRes.json();
        if (fData.success) {
          setFolders(fData.data);
        }
        if (iData.success) {
          setItems(iData.data);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [authFetch, debouncedSearch, filter]);

  const handleNewFolder = () => {
    setIsNewFolderModalOpen(true);
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

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="bg-[#e5e5e5] dark:bg-[#1a1a1a] font-inter text-black dark:text-white antialiased overflow-hidden flex h-screen w-full transition-colors relative selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      {/* Global Halftone Overlay */}
      <div className="absolute inset-0 halftone-bg opacity-30 dark:opacity-10 pointer-events-none mix-blend-multiply dark:mix-blend-screen z-0"></div>

      {/* SideNavBar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 p-4 gap-4 h-screen w-64 bg-[#f5f5f5] dark:bg-[#0a0a0a] border-r-2 border-black dark:border-white z-40 transition-colors">
        {/* Header Section */}
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
              Workspace
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 flex flex-col gap-1.5 mt-4 overflow-y-auto px-1">
          <button
            onClick={() => setFilter("all")}
            className={`text-left px-3 py-2 flex items-center gap-2.5 transition-colors border-2 ${
              filter === "all" ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-[3px_3px_0_0_rgba(0,0,0,1)] dark:shadow-[3px_3px_0_0_rgba(255,255,255,1)]" : "text-gray-600 dark:text-gray-400 border-transparent hover:text-black dark:hover:text-[#0a0a0a] hover:bg-black/5 dark:hover:bg-white"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              grid_view
            </span>
            <span className="text-[11px] font-black uppercase tracking-widest">
              Dashboard
            </span>
          </button>

          <button
            onClick={() => setFilter("favorites")}
            className={`text-left px-3 py-2 flex items-center gap-2.5 transition-colors border-2 ${
              filter === "favorites" ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-[3px_3px_0_0_rgba(0,0,0,1)] dark:shadow-[3px_3px_0_0_rgba(255,255,255,1)]" : "text-gray-600 dark:text-gray-400 border-transparent hover:text-black dark:hover:text-[#0a0a0a] hover:bg-black/5 dark:hover:bg-white"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              star
            </span>
            <span className="text-[11px] font-black uppercase tracking-widest">
              Favorites
            </span>
          </button>
          
          <button
            onClick={() => setFilter("recent")}
            className={`text-left px-3 py-2 flex items-center gap-2.5 transition-colors border-2 ${
              filter === "recent" ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-[3px_3px_0_0_rgba(0,0,0,1)] dark:shadow-[3px_3px_0_0_rgba(255,255,255,1)]" : "text-gray-600 dark:text-gray-400 border-transparent hover:text-black dark:hover:text-[#0a0a0a] hover:bg-black/5 dark:hover:bg-white"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              history
            </span>
            <span className="text-[11px] font-black uppercase tracking-widest">
              Recent
            </span>
          </button>

          <div className="h-3 border-l-2 border-black dark:border-white ml-5 my-1 opacity-20"></div>

          {loading ? (
            <div className="py-2">
              <Loader size="sm" text="Initializing..." />
            </div>
          ) : (
            folders.map((folder) => (
              <Link
                key={folder._id}
                className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-[#0a0a0a] hover:bg-black/5 dark:hover:bg-white hover:border-black dark:hover:border-white border-2 border-transparent px-3 py-2 flex items-center gap-2.5 transition-colors"
                to={`/folder/${folder._id}`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  folder
                </span>
                <span className="text-[11px] font-black uppercase tracking-widest truncate">
                  {folder.name}
                </span>
              </Link>
            ))
          )}
        </nav>

        <div className="mt-auto flex flex-col gap-2 py-3 border-t-2 border-black dark:border-white">
          <button
            onClick={handleNewFolder}
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

      <main className="flex-1 md:ml-64 flex flex-col h-screen overflow-y-auto relative z-10">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 md:left-64 z-40 h-14 flex justify-between items-center px-4 sm:px-6 border-b-2 border-black dark:border-white bg-[#f5f5f5] dark:bg-[#0a0a0a] transition-colors">
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

        <section className="flex-1 flex flex-col px-6 pt-24 pb-12 w-full max-w-6xl mx-auto relative z-10">
          {items.length > 0 ? (
            <div className="w-full">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-3xl md:text-4xl font-black text-black dark:text-white tracking-tighter uppercase mb-1">
                    Console.
                  </h2>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-400">
                    SYSTEM DASHBOARD & UNIVERSAL INDEX
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-start">
                {(filter === 'recent' ? items.slice(0, 10) : items).map((item, idx) => {
                  const folder = folders.find((f) => f._id === item.folderId);
                  return (
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
                      tags={
                        folder
                          ? [folder.name, ...(item.tags || [])]
                          : item.tags || []
                      }
                      isFavorite={item.isFavorite}
                      onToggleFavorite={(e) => toggleFavorite(e, item)}
                      imageSrc={item.type === "image" ? item.sourceUrl : null}
                      onClick={() => setSelectedItem(item)}
                    />
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="max-w-xl w-full text-center space-y-8 my-auto mx-auto bg-[#f5f5f5] dark:bg-[#0a0a0a] border-2 border-black dark:border-white p-10 shadow-[8px_8px_0_0_rgba(0,0,0,1)] dark:shadow-[8px_8px_0_0_rgba(255,255,255,1)]">
              <div className="space-y-4">
                <h2 className="text-4xl form-black text-black dark:text-white tracking-tighter uppercase leading-[0.9]">
                  VOID DETECTED.
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-xs font-bold uppercase tracking-widest mx-auto leading-relaxed">
                  Vault is currently empty. Initialize your library by
                  constructing a folder grouping.
                </p>
              </div>

              <div className="flex justify-center pt-2">
                <button
                  onClick={handleNewFolder}
                  className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-black text-xs uppercase tracking-widest border-2 border-black dark:border-white flex items-center gap-2 shadow-[4px_4px_0_0_rgba(107,114,128,0.5)] hover:shadow-[6px_6px_0_0_rgba(107,114,128,0.5)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all"
                >
                  <span className="material-symbols-outlined font-bold text-xl">
                    create_new_folder
                  </span>
                  INITIALIZE
                </button>
              </div>

              <div className="pt-8 grid grid-cols-3 gap-6 text-left border-t-2 border-black dark:border-white">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-black dark:text-white mb-1.5 underline decoration-2 underline-offset-2">
                    Integrity
                  </p>
                  <p className="text-[10px] font-bold text-gray-500">
                    Encrypted nodes standing by.
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-black dark:text-white mb-1.5 underline decoration-2 underline-offset-2">
                    Sync
                  </p>
                  <p className="text-[10px] font-bold text-gray-500">
                    Link nodes disconnected.
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-black dark:text-white mb-1.5 underline decoration-2 underline-offset-2">
                    Status
                  </p>
                  <p className="text-[10px] font-bold text-gray-500 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-black dark:bg-white animate-pulse"></span>
                    Core active.
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Mobile Navigation Shell */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-[#f5f5f5] dark:bg-[#0a0a0a] border-2 border-black dark:border-white flex justify-around items-center py-3 shadow-[6px_6px_0_0_rgba(0,0,0,1)] dark:shadow-[6px_6px_0_0_rgba(255,255,255,1)] z-50">
        <Link
          className="text-black dark:text-white flex flex-col items-center gap-0.5"
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
            onClick={handleNewFolder}
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

      {/* Modals */}
      <NewFolderModal
        isOpen={isNewFolderModalOpen}
        onClose={() => setIsNewFolderModalOpen(false)}
        onFolderCreated={(folder) => setFolders([...folders, folder])}
      />
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
