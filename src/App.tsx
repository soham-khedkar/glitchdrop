import React, { useState } from 'react';
import { Send, Download } from 'lucide-react';
import FileTransfer from './components/FileTransfer';
import FileReceive from './components/FileReceive';

function App() {
  const [mode, setMode] = useState<'send' | 'receive'>('send');

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setMode('send')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                ${mode === 'send' 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Send className="w-4 h-4" />
              Send Files
            </button>
            <button
              onClick={() => setMode('receive')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                ${mode === 'receive' 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Download className="w-4 h-4" />
              Receive Files
            </button>
          </div>
        </div>
      </nav>

      <main className="py-8">
        {mode === 'send' ? <FileTransfer /> : <FileReceive />}
      </main>
    </div>
  );
}

export default App;