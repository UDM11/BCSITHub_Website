import { supabase } from '../lib/supabase';

export const uploadFileToStorage = async (
  bucket: string,
  filePath: string,
  file: File
) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw error;
  return data;
};

export const getPublicUrl = (bucket: string, filePath: string): string => {
  const { publicUrl } = supabase.storage.from(bucket).getPublicUrl(filePath).data;
  return publicUrl;
};
