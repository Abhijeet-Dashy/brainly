import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { DriveService } from "../utils/drive.service.js";
import crypto from "crypto";

export const createFolder = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    throw new ApiError(400, "Folder name required");
  }

  const driveService = new DriveService(req.user);
  const vault = await driveService.getVault();

  const newFolder = {
    _id: crypto.randomUUID(),
    name,
    createdAt: new Date().toISOString(),
  };

  if (!vault.folders) vault.folders = [];
  vault.folders.push(newFolder);

  await driveService.saveVault(vault);

  return res.status(201).json(new ApiResponse(201, newFolder, "Folder created"));
});

export const getFolders = asyncHandler(async (req, res) => {
  const driveService = new DriveService(req.user);
  const vault = await driveService.getVault();

  let folders = vault.folders || [];
  folders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return res.status(200).json(new ApiResponse(200, folders));
});

export const deleteFolder = asyncHandler(async (req, res) => {
  const { folderId } = req.params;

  const driveService = new DriveService(req.user);
  const vault = await driveService.getVault();

  if (!vault.folders) vault.folders = [];
  
  const initialLength = vault.folders.length;
  vault.folders = vault.folders.filter((f) => f._id !== folderId);

  if (vault.folders.length === initialLength) {
    throw new ApiError(404, "Folder not found");
  }

  // Also delete associated items
  if (vault.items) {
    vault.items = vault.items.filter((i) => i.folderId !== folderId);
  }

  await driveService.saveVault(vault);

  return res.status(200).json(new ApiResponse(200, {}, "Folder deleted"));
});
