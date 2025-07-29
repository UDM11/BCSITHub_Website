import React, { useState, useRef, useEffect } from 'react';
import { Loader2, UploadCloud, XCircle } from 'lucide-react';
import Backendless from 'backendless';

interface AvatarUploadProps {
  uid: string;
  currentAvatarUrl?: string;
  onUploadComplete: (url: string) => void;
  maxFileSizeMB?: number;
  acceptedFormats?: string;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  uid,
  currentAvatarUrl,
  onUploadComplete,
  maxFileSizeMB = 1, // max 1MB file size by default
  acceptedFormats = 'image/png,image/jpeg,image/jpg',
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const validateFile = (file: File) => {
    if (!acceptedFormats.split(',').includes(file.type)) {
      return `Invalid file format. Allowed: ${acceptedFormats.replace(/image\//g, '')}`;
    }
    if (file.size > maxFileSizeMB * 1024 * 1024) {
      return `File size exceeds ${maxFileSizeMB}MB limit.`;
    }
    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const validationError = validateFile(file);

    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setError(null);
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;

    const file = e.dataTransfer.files[0];
    const validationError = validateFile(file);

    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const uploadFile = async (file: File): Promise<string> => {
    setUploading(true);
    setUploadProgress(0);

    const backendlessPath = `avatars/${uid}/${file.name}`;

    try {
      const uploadResult = await Backendless.Files.upload(
        file,
        backendlessPath,
        true,
        (progress) => {
          setUploadProgress(Math.round(progress * 100));
        }
      );

      setUploading(false);
      setUploadProgress(100);

      return uploadResult.fileURL;
    } catch (error: any) {
      setUploading(false);
      setUploadProgress(0);
      throw new Error(error.message || 'Upload failed');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('No file selected to upload.');
      return;
    }
    setError(null);
    try {
      const uploadedUrl = await uploadFile(selectedFile);
      onUploadComplete(uploadedUrl);
      setSelectedFile(null);
    } catch (err: any) {
      setError(err.message || 'Upload failed, please try again.');
      setUploading(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setError(null);
    setPreviewUrl(null);
  };

  return (
    <div className="w-48 mx-auto">
      <label
        htmlFor="avatar-upload"
        className="cursor-pointer block mb-4 text-center"
        aria-label="Upload profile avatar"
      >
        <div
          className="w-48 h-48 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative bg-gray-100 hover:border-blue-500 transition"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              fileInputRef.current?.click();
            }
          }}
          role="button"
          aria-describedby="avatar-upload-hint"
        >
          {!previewUrl && !currentAvatarUrl && (
            <UploadCloud className="w-12 h-12 text-gray-400" />
          )}
          {(previewUrl || currentAvatarUrl) && (
            <img
              src={previewUrl || currentAvatarUrl}
              alt="Avatar preview"
              className="object-cover w-full h-full rounded-full"
            />
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-full">
              <Loader2 className="animate-spin w-8 h-8 text-white" />
            </div>
          )}
          {selectedFile && !uploading && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear selected avatar"
              className="absolute top-2 right-2 bg-white rounded-full p-1 hover:bg-red-100"
            >
              <XCircle className="w-5 h-5 text-red-600" />
            </button>
          )}
        </div>
        <p
          id="avatar-upload-hint"
          className="mt-2 text-sm text-center text-gray-500 select-none"
        >
          Click or drag & drop to upload (PNG, JPG up to {maxFileSizeMB}MB)
        </p>
      </label>

      <input
        type="file"
        id="avatar-upload"
        accept={acceptedFormats}
        className="hidden"
        onChange={handleFileChange}
        ref={fileInputRef}
        disabled={uploading}
      />

      {error && <p className="text-red-600 text-sm mt-2 text-center">{error}</p>}

      {selectedFile && !uploading && (
        <button
          onClick={handleUpload}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
          type="button"
        >
          Upload
        </button>
      )}

      {uploading && (
        <div className="w-full mt-2 bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default AvatarUpload;
