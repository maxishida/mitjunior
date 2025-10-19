'use client';

import React, { useState, useRef, useCallback } from 'react';
import {
  Upload,
  X,
  FileText,
  Image,
  Video,
  Music,
  File,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove?: (index: number) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  maxFiles?: number;
  disabled?: boolean;
  uploading?: boolean;
  uploadProgress?: number;
  className?: string;
}

interface FileWithPreview {
  file: File;
  preview?: string;
  id: string;
}

const FILE_TYPE_ICONS = {
  'image/': Image,
  'video/': Video,
  'audio/': Music,
  'application/pdf': FileText,
  'text/': FileText,
  'default': File
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileIcon = (fileType: string) => {
  for (const [type, icon] of Object.entries(FILE_TYPE_ICONS)) {
    if (type === 'default') continue;
    if (fileType.startsWith(type)) return icon;
  }
  return FILE_TYPE_ICONS.default;
};

export default function AdminFileUpload({
  onFileSelect,
  onFileRemove,
  accept = "*/*",
  multiple = false,
  maxSize = 10, // 10MB default
  maxFiles = 1,
  disabled = false,
  uploading = false,
  uploadProgress = 0,
  className = ""
}: FileUploadProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `O arquivo "${file.name}" excede o tamanho máximo de ${maxSize}MB`;
    }

    // Check file type (if accept is specified and not */*)
    if (accept !== "*/*" && accept !== "*") {
      const acceptedTypes = accept.split(',').map(type => type.trim());
      const isAccepted = acceptedTypes.some(acceptedType => {
        if (acceptedType.startsWith('.')) {
          // Extension check
          return file.name.toLowerCase().endsWith(acceptedType.toLowerCase());
        } else {
          // MIME type check
          if (acceptedType.endsWith('/*')) {
            return file.type.startsWith(acceptedType.slice(0, -2));
          }
          return file.type === acceptedType;
        }
      });

      if (!isAccepted) {
        return `O arquivo "${file.name}" não é um tipo aceito. Tipos aceitos: ${accept}`;
      }
    }

    return null;
  };

  const createPreview = (file: File): Promise<string | undefined> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        resolve(undefined);
      }
    });
  };

  const processFiles = async (fileList: FileList) => {
    setError(null);
    const newFiles: FileWithPreview[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];

      // Validate file
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      // Check max files limit
      if (!multiple && files.length + newFiles.length >= maxFiles) {
        setError(`Máximo de ${maxFiles} arquivo(s) permitido(s)`);
        return;
      }

      const preview = await createPreview(file);
      newFiles.push({
        file,
        preview,
        id: Math.random().toString(36).substr(2, 9)
      });
    }

    // Check total files limit for multiple mode
    if (multiple && files.length + newFiles.length > maxFiles) {
      setError(`Máximo de ${maxFiles} arquivo(s) permitido(s)`);
      return;
    }

    const updatedFiles = multiple ? [...files, ...newFiles] : newFiles;
    setFiles(updatedFiles);

    // Call onFileSelect for each new file
    newFiles.forEach(fileWithPreview => {
      onFileSelect(fileWithPreview.file);
    });
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled || uploading) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    if (onFileRemove) {
      onFileRemove(index);
    }
  };

  const openFileDialog = () => {
    if (!disabled && !uploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
          ${dragActive
            ? 'border-[#00C896] bg-[#00C896]/5'
            : 'border-[#2D333B] hover:border-[#00C896]/50 hover:bg-[#1A1F2E]/50'
          }
          ${disabled || uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInputChange}
          disabled={disabled || uploading}
          className="hidden"
        />

        {/* Upload Icon */}
        <div className="mx-auto mb-4">
          {uploading ? (
            <div className="relative">
              <Loader2 className="w-12 h-12 text-[#00C896] animate-spin" />
              <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-[#00C896]/20 mx-auto"></div>
            </div>
          ) : (
            <Upload className="w-12 h-12 text-[#64748B] mx-auto" />
          )}
        </div>

        {/* Upload Text */}
        <div className="mb-2">
          {uploading ? (
            <p className="text-lg font-medium text-[#F8FAFC]">
              Enviando arquivo... {uploadProgress}%
            </p>
          ) : (
            <>
              <p className="text-lg font-medium text-[#F8FAFC] mb-1">
                Arraste e solte ou clique para selecionar
              </p>
              <p className="text-sm text-[#64748B]">
                {multiple ? `Até ${maxFiles} arquivos` : '1 arquivo'} • Máximo {maxSize}MB
              </p>
              {accept !== "*/*" && (
                <p className="text-xs text-[#94A3B8] mt-1">
                  Formatos aceitos: {accept}
                </p>
              )}
            </>
          )}
        </div>

        {/* Upload Progress */}
        {uploading && (
          <div className="mt-4">
            <div className="w-full bg-[#242931] rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#00C896] to-[#00A67C] transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg">
          <AlertCircle className="w-5 h-5 text-[#EF4444] flex-shrink-0" />
          <p className="text-sm text-[#EF4444]">{error}</p>
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          {files.map((fileWithPreview, index) => {
            const Icon = getFileIcon(fileWithPreview.file.type);
            return (
              <div
                key={fileWithPreview.id}
                className="flex items-center gap-4 p-4 bg-[#1A1F2E] border border-[#2D333B] rounded-lg"
              >
                {/* File Preview/Icon */}
                <div className="flex-shrink-0">
                  {fileWithPreview.preview ? (
                    <img
                      src={fileWithPreview.preview}
                      alt={fileWithPreview.file.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-[#242931] rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-[#64748B]" />
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#F8FAFC] truncate">
                    {fileWithPreview.file.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-[#64748B]">
                      {formatFileSize(fileWithPreview.file.size)}
                    </span>
                    {uploading && (
                      <div className="flex items-center gap-1">
                        <Loader2 className="w-3 h-3 text-[#00C896] animate-spin" />
                        <span className="text-xs text-[#00C896]">
                          {uploadProgress}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {uploading ? (
                    <div className="w-8 h-8" />
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                      className="p-2 hover:bg-[#242931] rounded-lg transition-colors"
                      disabled={disabled}
                    >
                      <X className="w-4 h-4 text-[#64748B]" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Video Upload Component (specialized for video files)
interface VideoUploadProps {
  onVideoSelect: (file: File) => void;
  onVideoRemove?: () => void;
  maxSize?: number; // in MB
  disabled?: boolean;
  uploading?: boolean;
  uploadProgress?: number;
  className?: string;
}

export function VideoUpload({
  onVideoSelect,
  onVideoRemove,
  maxSize = 100, // 100MB for videos
  disabled = false,
  uploading = false,
  uploadProgress = 0,
  className = ""
}: VideoUploadProps) {
  const [video, setVideo] = useState<FileWithPreview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleVideoSelect = async (file: File) => {
    setError(null);

    // Validate file type
    if (!file.type.startsWith('video/')) {
      setError('Por favor, selecione um arquivo de vídeo válido.');
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`O vídeo excede o tamanho máximo de ${maxSize}MB.`);
      return;
    }

    // Create video preview (thumbnail)
    const preview = await createVideoThumbnail(file);
    const videoWithPreview: FileWithPreview = {
      file,
      preview,
      id: Math.random().toString(36).substr(2, 9)
    };

    setVideo(videoWithPreview);
    onVideoSelect(file);
  };

  const createVideoThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.src = URL.createObjectURL(file);

      video.onloadeddata = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 320;
        canvas.height = 180;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Seek to 1 second for thumbnail
          video.currentTime = 1;

          video.onseeked = () => {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL());
            URL.revokeObjectURL(video.src);
          };
        }
      };
    });
  };

  const removeVideo = () => {
    setVideo(null);
    if (onVideoRemove) {
      onVideoRemove();
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <AdminFileUpload
        onFileSelect={handleVideoSelect}
        accept="video/*"
        multiple={false}
        maxSize={maxSize}
        disabled={disabled}
        uploading={uploading}
        uploadProgress={uploadProgress}
      />

      {/* Video Preview */}
      {video && !uploading && (
        <div className="bg-[#1A1F2E] border border-[#2D333B] rounded-xl p-4">
          <div className="flex items-start gap-4">
            {/* Video Thumbnail */}
            <div className="flex-shrink-0">
              {video.preview ? (
                <div className="relative w-32 h-20 rounded-lg overflow-hidden">
                  <img
                    src={video.preview}
                    alt={video.file.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                      <div className="w-0 h-0 border-l-8 border-l-black border-y-4 border-y-transparent ml-1" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-32 h-20 bg-[#242931] rounded-lg flex items-center justify-center">
                  <Video className="w-8 h-8 text-[#64748B]" />
                </div>
              )}
            </div>

            {/* Video Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-[#F8FAFC] mb-1">
                {video.file.name}
              </h4>
              <p className="text-sm text-[#64748B] mb-2">
                Tamanho: {(video.file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2 py-1 bg-[#00C896]/10 text-[#00C896] text-xs font-medium rounded-lg">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Vídeo pronto
                </span>
              </div>
            </div>

            {/* Remove Button */}
            <button
              onClick={removeVideo}
              disabled={disabled}
              className="p-2 hover:bg-[#242931] rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-[#64748B]" />
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg">
          <AlertCircle className="w-5 h-5 text-[#EF4444] flex-shrink-0" />
          <p className="text-sm text-[#EF4444]">{error}</p>
        </div>
      )}
    </div>
  );
}