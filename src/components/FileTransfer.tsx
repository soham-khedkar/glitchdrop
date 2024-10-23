import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Shield, Share2, AlertCircle } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { encryptFile, generateKey } from "../lib/encryption";
import { supabase } from "../lib/supabase";

const CHUNK_SIZE = 1024 * 1024; // 1MB chunks

const FileTransfer = () => {
  const [transferId, setTransferId] = useState<string>("");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string>("");

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      setError("");
      const file = acceptedFiles[0];
      const key = generateKey();
      const transferId = uuidv4();
      setTransferId(transferId);

      const chunks = Math.ceil(file.size / CHUNK_SIZE);

      for (let i = 0; i < chunks; i++) {
        const chunk = file.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
        const buffer = await chunk.arrayBuffer();
        const encryptedChunk = encryptFile(buffer, key);

        const { error: uploadError } = await supabase.storage
          .from("file-transfers")
          .upload(`${transferId}/${i}`, encryptedChunk);

        if (uploadError) {
          throw new Error(
            `Failed to upload chunk ${i}: ${uploadError.message}`
          );
        }

        setProgress(((i + 1) / chunks) * 100);
      }

      const { error: metadataError } = await supabase.from("transfers").insert({
        id: transferId,
        filename: file.name,
        size: file.size,
        chunks,
        key,
        sender_id: supabase.auth.getUser()?.id,
        created_at: new Date().toISOString(),
      });

      if (metadataError) {
        throw new Error(
          `Failed to save transfer metadata: ${metadataError.message}`
        );
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      setProgress(0);
      setTransferId("");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 100 * 1024 * 1024, // 100MB max
    multiple: false,
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">SecureShare</h1>
        <p className="text-white">
          End-to-end encrypted file transfer with resumable uploads
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div className="text-red-700">{error}</div>
        </div>
      )}

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
          ${
            isDragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-blue-400"
          }`}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-lg text-white">
          {isDragActive
            ? "Drop your files here"
            : "Drag & drop files here, or click to select"}
        </p>
        <p className="text-sm text-white mt-2">Maximum file size: 100MB</p>
      </div>

      {progress > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white">
              Upload progress
            </span>
            <span className="text-sm font-medium text-white">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 rounded-full h-2 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {transferId && (
        <div className="mt-8 p-6 bg-green-50 rounded-lg">
          <div className="flex items-center mb-4">
            <Shield className="w-6 h-6 text-green-600 mr-2" />
            <h2 className="text-xl font-semibold text-green-800">
              File Ready for Transfer
            </h2>
          </div>
          <p className="text-green-700 mb-4">
            Share this transfer ID with the recipient:
          </p>
          <div className="flex items-center gap-4 ">
            <code className="flex-1 p-3 bg-white text-black rounded border border-green-200 font-mono text-sm break-all">
              {transferId}
            </code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(transferId);
                // Optional: Add a toast notification here
              }}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-black rounded-lg hover:bg-green-700"
            >
              <Share2 className="w-4 h-4" />
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileTransfer;
