import ImageKit from "imagekit";
import { config } from "../config/config.js";

const imagekit = new ImageKit({
  publicKey: config.IMAGEKIT_PUBLIC_KEY,
  privateKey: config.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: config.IMAGEKIT_URL_ENDPOINT,
});

/**
 * Upload a file buffer to ImageKit using the `imagekit` v6 SDK.
 * Credentials verified working via listFiles test.
 */
export async function uploadFile({ buffer, fileName, folder = "snitch" }) {
  const sizeInMB = (buffer.length / (1024 * 1024)).toFixed(2);
  console.log(`[ImageKit] Uploading: ${fileName} (${sizeInMB} MB) → publicKey: ${config.IMAGEKIT_PUBLIC_KEY?.slice(0, 12)}...`);

  const result = await imagekit.upload({
    file: buffer,
    fileName: fileName,
    folder: folder,
    useUniqueFileName: true,
  });

  console.log(`[ImageKit] ✓ Success: ${result.url}`);
  return { url: result.url, alt: fileName };
}
