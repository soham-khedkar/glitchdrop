import React, { useState } from "react";
import { Send, Download } from "lucide-react";
import FileTransfer from "../components/FileTransfer";
import FileReceive from "../components/FileReceive";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

function MainPage() {
  const [mode, setMode] = useState<"send" | "receive">("send");
  const { user, isAuthenticated, isLoading } = useKindeAuth();
  const { login, register } = useKindeAuth();

  if (isLoading) {
    return (
      <div
        className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
        role="status"
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Loading...
        </span>
      </div>
    );
  }

  return (
    <>
      {isAuthenticated ? (
        <div className="min-h-screen bg-[#101313] text-white">
          <nav className="bg-[#101313] shadow-sm">
            <div className="max-w-4xl mx-auto px-6 py-4">
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setMode("send")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                ${
                  mode === "send"
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                >
                  <Send className="w-4 h-4" />
                  Send Files
                </button>
                <button
                  onClick={() => setMode("receive")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                ${
                  mode === "receive"
                    ? "bg-blue-50 text-blue-700"
                    : "text-white hover:bg-black"
                }`}
                >
                  <Download className="w-4 h-4" />
                  Receive Files
                </button>
              </div>
            </div>
          </nav>

          <main className="py-8">
            {mode === "send" ? <FileTransfer /> : <FileReceive />}
          </main>
        </div>
      ) : (
        <div className="bg-[#101313] text-white w-full h-screen flex flex-col justify-center items-center gap-4">
          <h1 className="text-2xl">You Have No Acess</h1>
          <button
            onClick={() => register()}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg"
            type="button"
          >
            Sign up
          </button>
        </div>
      )}
    </>
  );
}

export default MainPage;
