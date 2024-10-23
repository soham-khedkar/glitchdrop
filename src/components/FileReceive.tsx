import React, { useState } from 'react';
import { Download, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { decryptFile } from '../lib/encryption';

const FileReceive = () => {
  const [transferId, setTransferId] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const downloadFile = async () => {
    try {
      setDownloading(true);

      // Get transfer metadata
      const { data: transfer } = await supabase
        .from('transfers')
        .select('*')
        .eq('id', transferId)
        .single();

      if (!transfer) throw new Error('Transfer not found');

      const chunks: ArrayBuffer[] = [];
      
      for (let i = 0; i < transfer.chunks; i++) {
        const { data } = await supabase.storage
          .from('file-transfers')
          .download(`${transferId}/${i}`);

        if (!data) throw new Error(`Failed to download chunk ${i}`);

        const decryptedChunk = decryptFile(await data.text(), transfer.key);
        chunks.push(decryptedChunk);
        
        setProgress((i + 1) / transfer.chunks * 100);
      }

      // Combine chunks and download
      const blob = new Blob(chunks, { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = transfer.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download file. Please try again.');
    } finally {
      setDownloading(false);
      setProgress(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Receive File</h1>
        <p className="text-gray-600">Enter the transfer ID to download your file</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            value={transferId}
            onChange={(e) => setTransferId(e.target.value)}
            placeholder="Enter transfer ID"
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={downloadFile}
            disabled={downloading || !transferId}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>

        {downloading && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Download progress</span>
              <span className="text-sm font-medium text-gray-700">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 rounded-full h-2 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="mt-6 flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <Lock className="w-5 h-5 text-gray-500 mt-0.5" />
          <div>
            <h3 className="font-medium text-gray-800">End-to-End Encryption</h3>
            <p className="text-sm text-gray-600">
              Your files are encrypted before upload and decrypted after download.
              The encryption key is never stored on our servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileReceive;