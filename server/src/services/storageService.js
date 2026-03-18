import { supabaseAdmin } from '../config/supabase.js';

/**
 * Upload a file to Supabase Storage
 * @param {string} bucket - The name of the storage bucket
 * @param {string} path - The folder path within the bucket
 * @param {Buffer} fileBuffer - The file content
 * @param {string} contentType - The MIME type of the file
 */
export const uploadFile = async (bucket, path, fileBuffer, contentType) => {
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(path, fileBuffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data: publicUrlData } = supabaseAdmin.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
};
