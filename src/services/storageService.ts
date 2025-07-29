import Backendless from 'backendless';

// Upload file to Backendless Files storage under the specified folder
export const uploadFileToStorage = async (
  folderName: string,
  file: File
) => {
  try {
    // The third argument "true" means "overwrite" is allowed, change to false if you want no overwrite
    const uploadedFile = await Backendless.Files.upload(file, folderName, true);
    return uploadedFile; // contains info like name, url, size, etc.
  } catch (error) {
    console.error('Backendless upload error:', error);
    throw error;
  }
};

// Get public URL for a file in Backendless Files storage
export const getPublicUrl = (folderName: string, fileName: string): string => {
  // Construct the public URL manually based on Backendless server URL pattern
  // Make sure backendless.serverURL is set in your Backendless config
  const baseUrl = Backendless.serverURL || 'https://api.backendless.com'; // fallback if not set
  return `${baseUrl}/api/files/${folderName}/${fileName}`;
};
