import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

const styles = {
  link: "text-base font-medium text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600",
  mobileLink:
    "inline-flex py-2 text-base font-medium text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600",
  joinButton:
    "inline-flex justify-center px-4 py-3 text-base font-semibold text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-md items-center hover:bg-blue-700 focus:bg-blue-700",
};

const Navbar = () => {
  const { login, register } = useKindeAuth();
  const { user } = useKindeAuth();
  const { logout } = useKindeAuth();

  // console.log(user);

  return (
    <header className="pb-6 bg-[#101313] text-white lg:pb-0 pt-4 md:pt-0">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* lg+ */}
        <nav className="flex items-center justify-between h-16 lg:h-20">
          <div className="flex-shrink-0">
            <Link to="/" className="flex">
              <h1 className="text-2xl font-bold font-we">GlitchDrop.</h1>
            </Link>
          </div>

          {user && (
            <>
              <div className="hidden text-white mr-6 lg:flex lg:items-center lg:ml-auto lg:space-x-10">
                <Link to="/fileexchange" className="text-white">
                  File Exchange
                </Link>
              </div>
            </>
          )}

          <div className="flex gap-4">
            {user ? (
              <>
                <button
                  onClick={logout}
                  type="button"
                  className="relative inline-flex items-center justify-center p-4 px-5 py-3 overflow-hidden font-medium border border-white text-indigo-600 transition duration-300 ease-out rounded-full shadow-xl group hover:ring-1 hover:ring-purple-500"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-700"></span>
                  <span className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-pink-500 rounded-full opacity-30 group-hover:rotate-90 ease"></span>
                  <span className="relative text-white">Log Out</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => register()}
                  type="button"
                  className="relative inline-flex items-center justify-center p-4 px-5 py-3 overflow-hidden font-medium border border-white text-indigo-600 transition duration-300 ease-out rounded-full shadow-xl group hover:ring-1 hover:ring-purple-500"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-700"></span>
                  <span className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-pink-500 rounded-full opacity-30 group-hover:rotate-90 ease"></span>
                  <span className="relative text-white">Sign Up</span>
                </button>

                <button
                  onClick={() => login()}
                  type="button"
                  className="relative inline-flex items-center justify-center p-4 px-5 py-3 overflow-hidden font-medium border border-white text-indigo-600 transition duration-300 ease-out rounded-full shadow-xl group hover:ring-1 hover:ring-purple-500"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-700"></span>
                  <span className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-pink-500 rounded-full opacity-30 group-hover:rotate-90 ease"></span>
                  <span className="relative text-white">Sign In</span>
                </button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
