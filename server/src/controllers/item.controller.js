import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { DriveService } from "../utils/drive.service.js";
import crypto from "crypto";

export const createItem = asyncHandler(async (req, res) => {
  const { content, type, folderId, note, tags, sourceUrl } = req.body;

  if (!content || !type || !folderId) {
    throw new ApiError(400, "Missing required fields");
  }

  const driveService = new DriveService(req.user);
  const vault = await driveService.getVault();

  if (!vault.folders) vault.folders = [];
  const folderExists = vault.folders.some((f) => f._id === folderId);

  if (!folderExists) {
    throw new ApiError(404, "Folder not found");
  }

  let activeTags = tags || [];
  const textContent = `${content} ${note || ""}`.toLowerCase();
  const keywordMap = {
    react: "react", css: "css", html: "html",
    javascript: "js", js: "js", typescript: "ts", ts: "ts",
    python: "python", java: "java", cpp: "cpp", sql: "sql",
    node: "nodejs", express: "express", mongodb: "mongodb",
    api: "api", rest: "api", graphql: "graphql",
    dsa: "dsa", leetcode: "dsa", algo: "dsa", algorithm: "dsa",
    frontend: "frontend", backend: "backend", design: "design",
    ui: "ui", ux: "ux", docker: "docker", aws: "aws", git: "git"
  };

  Object.entries(keywordMap).forEach(([keyword, tag]) => {
    if (textContent.includes(keyword) && !activeTags.includes(tag)) {
      activeTags.push(tag);
    }
  });

  const newItem = {
    _id: crypto.randomUUID(),
    folderId,
    content,
    type,
    note,
    tags: activeTags,
    sourceUrl,
    isFavorite: false,
    createdAt: new Date().toISOString(),
  };

  if (!vault.items) vault.items = [];
  vault.items.push(newItem);

  await driveService.saveVault(vault);

  return res.status(201).json(new ApiResponse(201, newItem, "Item saved"));
});

export const getItems = asyncHandler(async (req, res) => {
  const { folderId, search, favorites } = req.query;

  const driveService = new DriveService(req.user);
  const vault = await driveService.getVault();

  let items = vault.items || [];

  if (folderId) {
    items = items.filter((i) => i.folderId === folderId);
  }
  
  if (favorites === 'true') {
    items = items.filter((i) => i.isFavorite === true);
  }

  if (search) {
    const s = search.toLowerCase();
    items = items.filter((i) => {
      return (
        (i.content && i.content.toLowerCase().includes(s)) ||
        (i.note && i.note.toLowerCase().includes(s)) ||
        (i.tags && i.tags.some((t) => t.toLowerCase().includes(s)))
      );
    });
  }

  items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return res.status(200).json(new ApiResponse(200, items));
});

export const deleteItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;

  const driveService = new DriveService(req.user);
  const vault = await driveService.getVault();

  if (!vault.items) vault.items = [];
  
  const initialLength = vault.items.length;
  vault.items = vault.items.filter((i) => i._id !== itemId);

  if (vault.items.length === initialLength) {
    throw new ApiError(404, "Item not found");
  }

  await driveService.saveVault(vault);

  return res.status(200).json(new ApiResponse(200, {}, "Item deleted"));
});

export const updateItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const { content, note, tags, folderId, sourceUrl, isFavorite } = req.body;

  const driveService = new DriveService(req.user);
  const vault = await driveService.getVault();

  if (!vault.items) vault.items = [];
  
  const itemIndex = vault.items.findIndex((i) => i._id === itemId);
  if (itemIndex === -1) {
    throw new ApiError(404, "Item not found");
  }

  if (folderId) {
    if (!vault.folders) vault.folders = [];
    const folderExists = vault.folders.some((f) => f._id === folderId);
    if (!folderExists) {
      throw new ApiError(404, "New folder not found");
    }
    vault.items[itemIndex].folderId = folderId;
  }

  if (content !== undefined) vault.items[itemIndex].content = content;
  if (note !== undefined) vault.items[itemIndex].note = note;
  if (tags !== undefined) vault.items[itemIndex].tags = tags;
  if (sourceUrl !== undefined) vault.items[itemIndex].sourceUrl = sourceUrl;
  if (isFavorite !== undefined) vault.items[itemIndex].isFavorite = isFavorite;

  await driveService.saveVault(vault);

  return res.status(200).json(new ApiResponse(200, vault.items[itemIndex], "Item updated"));
});
