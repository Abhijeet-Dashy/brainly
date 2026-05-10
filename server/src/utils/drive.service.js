import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

const VAULT_FILENAME = "Brainly_Vault.json";

export class DriveService {
  constructor(user) {
    if (!user.googleAccessToken) {
      throw new Error("User does not have Google Drive access tokens linked");
    }

    const auth = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    auth.setCredentials({
      access_token: user.googleAccessToken,
      refresh_token: user.googleRefreshToken,
    });

    this.drive = google.drive({ version: "v3", auth });
  }

  async getVaultFileId() {
    const res = await this.drive.files.list({
      q: `name='${VAULT_FILENAME}' and trashed=false`,
      fields: "files(id, name)",
      spaces: "drive",
    });

    if (res.data.files && res.data.files.length > 0) {
      return res.data.files[0].id;
    }
    return null;
  }

  async getVault() {
    let fileId = await this.getVaultFileId();

    if (!fileId) {
      // Vault does not exist, create it
      const defaultVault = { folders: [], items: [] };
      const res = await this.drive.files.create({
        requestBody: {
          name: VAULT_FILENAME,
          mimeType: "application/json",
        },
        media: {
          mimeType: "application/json",
          body: JSON.stringify(defaultVault),
        },
        fields: "id",
      });
      return defaultVault;
    }

    // Read the file contents
    const res = await this.drive.files.get({
      fileId: fileId,
      alt: "media",
    });

    return res.data;
  }

  async saveVault(vaultData) {
    let fileId = await this.getVaultFileId();

    if (!fileId) {
       const res = await this.drive.files.create({
        requestBody: {
          name: VAULT_FILENAME,
          mimeType: "application/json",
        },
        media: {
          mimeType: "application/json",
          body: JSON.stringify(vaultData),
        },
        fields: "id",
      });
      return res.data;
    }

    // Update existing file
    const res = await this.drive.files.update({
      fileId: fileId,
      media: {
        mimeType: "application/json",
        body: JSON.stringify(vaultData),
      },
    });

    return res.data;
  }
}
