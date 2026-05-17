import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { OAuth2Client } from "google-auth-library";

export const googleAuth = asyncHandler(async (req, res) => {
  const { code, redirect_uri } = req.body;

  if (!code) {
    throw new ApiError(400, "Authorization code is required");
  }

  // Ensure these match your actual client setup. The redirect_uri must match what the frontend sends (usually 'postmessage' for useGoogleLogin)
  const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri || 'postmessage'
  );

  let tokens;
  try {
    const { tokens: t } = await client.getToken(code);
    tokens = t;
  } catch (err) {
    throw new ApiError(401, "Failed to exchange authorization code for tokens: " + err.message);
  }

  client.setCredentials(tokens);

  let userInfo;
  try {
    // Fetch user info from Google using the access token
    const response = await client.request({ url: 'https://www.googleapis.com/oauth2/v3/userinfo' });
    userInfo = response.data;
  } catch (err) {
    throw new ApiError(401, "Failed to fetch user info with tokens");
  }

  const { sub: googleId, email, name, picture } = userInfo;

  // Check if user already exists by googleId or email
  let user = await User.findOne({ $or: [{ googleId }, { email }] });

  if (user) {
    // Link googleId if missing
    if (!user.googleId) {
      user.googleId = googleId;
    }
    // Update Google tokens
    user.googleAccessToken = tokens.access_token;
    if (tokens.refresh_token) {
      user.googleRefreshToken = tokens.refresh_token;
    }
    await user.save({ validateBeforeSave: false });
  } else {
    // Create a new user with a unique username derived from email
    const baseUsername = email.split("@")[0].replace(/[^a-z0-9_]/gi, "_").toLowerCase();
    let username = baseUsername;
    let counter = 1;
    while (await User.findOne({ username })) {
      username = `${baseUsername}_${counter}`;
      counter++;
    }

    user = await User.create({
      username,
      email,
      googleId,
      googleAccessToken: tokens.access_token,
      googleRefreshToken: tokens.refresh_token,
    });
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(
    new ApiResponse(200, {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      accessToken,
      refreshToken,
    }, "Google authentication successful")
  );
});