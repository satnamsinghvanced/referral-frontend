import React from "react";

const Platforms = () => {
  return (
    <div className="grid grid-cols-3 gap-10 mb-8">
          {/* Platform 1 */}
          <div className="bg-white h-[200px] px-4 py-5 w-125 rounded-xl shadow border border-gray-50 hover:border-sky-200 transition-colors relative">

            <h3 className="text-sm font-extralight text-gray-800 mb-7 flex items-center gap-2">
              <span className="inline-block w-5 h-5 font-sans bg-blue-600 rounded-sm"></span>
              Facebook
            </h3>

            <span className="text-xs font-extralight text-green-900 bg-green-100 px-2 py-0.5 rounded-md absolute right-4 top-4">
              connected
            </span>

            <div className="text-xs font-extralight text-gray-600 mt-2">Followers</div>
            <div className="text-xs text-black ml-110 relative -top-5">12,345</div>

            <div className="text-xs font-extralight text-gray-600 mt-2">Engagement Rate</div>
            <div className="text-xs text-black ml-110 relative -top-5">5.2%</div>

            {/* Manage Button */}
            <div className="flex justify-center mt-3">
              <button className="flex items-center justify-center gap-2 text-xs px-4 py-2 bg-white text-black rounded-md hover:bg-yellow-200 transition-colors shadow h-8 w-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 10c4.418 0 8-1.79 8-4V8c0-2.21-3.582-4-8-4S4 5.79 4 8v6c0 2.21 3.582 4 8 4z" />
                </svg>
                Manage
              </button>
            </div>
          </div>



          {/* Platform 2 */}
          <div className="bg-white h-[200px] px-4 py-5 w-125 rounded-xl shadow border border-gray-50 hover:border-sky-200 transition-colors relative">

            <h3 className="text-sm font-extralight text-gray-800 mb-7 flex items-center gap-2">
              <span className="inline-block w-5 h-5 font-sans bg-pink-600 rounded-sm"></span>
              Instagram
            </h3>

            <span className="text-xs font-extralight text-green-900 bg-green-100 px-2 py-0.5 rounded-md absolute right-4 top-4">
              connected
            </span>

            <div className="text-xs font-extralight text-gray-600 mt-2">Followers</div>
            <div className="text-xs text-black ml-110 relative -top-5">987</div>

            <div className="text-xs font-extralight text-gray-600 mt-2">Engagement Rate</div>
            <div className="text-xs text-black ml-110 relative -top-5">6.1%</div>

            {/* Manage Button */}
            <div className="flex justify-center mt-3">
              <button className="flex items-center justify-center gap-2 text-xs px-4 py-2 bg-white text-black rounded-md hover:bg-yellow-200 transition-colors shadow h-8 w-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 10c4.418 0 8-1.79 8-4V8c0-2.21-3.582-4-8-4S4 5.79 4 8v6c0 2.21 3.582 4 8 4z" />
                </svg>
                Manage
              </button>
            </div>
          </div>



          {/* Platform 3 */}
          <div className="bg-white h-[200px] px-4 py-5 w-125 rounded-xl shadow border border-gray-50 hover:border-sky-200 transition-colors relative">

            <h3 className="text-sm font-extralight text-gray-800 mb-7 flex items-center gap-2">
              <span className="inline-block w-5 h-5 font-sans bg-blue-600 rounded-sm"></span>
              Linkedln
            </h3>

            <span className="text-xs font-extralight text-green-900 bg-green-100 px-2 py-0.5 rounded-md absolute right-4 top-4">
              connected
            </span>

            <div className="text-xs font-extralight text-gray-600 mt-2">Followers</div>
            <div className="text-xs text-black ml-113 relative -top-5">626</div>

            <div className="text-xs font-extralight text-gray-600 mt-2">Engagement Rate</div>
            <div className="text-xs text-black ml-110 relative -top-5">3.8%</div>

            {/* Manage Button */}
            <div className="flex justify-center mt-3">
              <button className="flex items-center justify-center gap-2 text-xs px-4 py-2 bg-white text-black rounded-md hover:bg-yellow-200 transition-colors shadow h-8 w-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 10c4.418 0 8-1.79 8-4V8c0-2.21-3.582-4-8-4S4 5.79 4 8v6c0 2.21 3.582 4 8 4z" />
                </svg>
                Manage
              </button>
            </div>
          </div>

          {/* Platform 4 */}
          <div className="bg-white h-[200px] px-4 py-5 w-125 rounded-xl shadow border border-gray-50 hover:border-sky-200 transition-colors relative">

            <h3 className="text-sm font-extralight text-gray-800 mb-7 flex items-center gap-2">
              <span className="inline-block w-5 h-5 font-sans bg-sky-400 rounded-sm"></span>
              Twitter
            </h3>

            <span className="text-[11px] font-extralight text-sky-900 bg-sky-100 px-2 py-0.5 rounded-md absolute right-4 top-4">
              Not connected
            </span>

            <div className="text-xs font-extralight text-gray-600 mt-2">Followers</div>
            <div className="text-xs text-black ml-113 relative -top-5">0</div>

            <div className="text-xs font-extralight text-gray-600 mt-2">Engagement Rate</div>
            <div className="text-xs text-black ml-110 relative -top-5">0%</div>

            {/* Manage Button */}
            <div className="flex justify-center mt-3">
              <button className="flex items-center justify-center gap-2 text-[11px] px-4 py-2 bg-sky-400 text-white rounded-md hover:bg-sky-300 transition-colors shadow h-8 w-100">
                Connect Account
              </button>
            </div>
          </div>
          {/* Platform 5 */}
          <div className="bg-white h-[200px] px-4 py-5 w-125 rounded-xl shadow border border-gray-50 hover:border-sky-200 transition-colors relative">

            <h3 className="text-sm font-extralight text-gray-800 mb-7 flex items-center gap-2">
              <span className="inline-block w-5 h-5 font-sans bg-red-700 rounded-sm"></span>
              You Tube
            </h3>

            <span className="text-[11px] font-extralight text-sky-900 bg-sky-100 px-2 py-0.5 rounded-md absolute right-4 top-4">
              Not Connected
            </span>

            <div className="text-xs font-extralight text-gray-600 mt-2">Followers</div>
            <div className="text-xs text-black ml-113 relative -top-5">0</div>

            <div className="text-xs font-extralight text-gray-600 mt-2">Engagement</div>
            <div className="text-xs text-black ml-110 relative -top-5">0%</div>

            {/* Manage Button */}
            <div className="flex justify-center mt-3">
              <button className="flex items-center justify-center gap-2 text-xs px-4 py-2 bg-sky-400 text-white rounded-md hover:bg-sky-300 transition-colors shadow h-8 w-100">
                Connect Account
              </button>
            </div>
          </div>

          {/* Platform 6 - Styled like top cards */}
          <div className="bg-white h-[200px] px-4 py-5 w-125 rounded-xl shadow border border-gray-50 hover:border-sky-200 transition-colors relative">
            <h3 className="text-sm font-extralight text-gray-800 mb-7 flex items-center gap-2">
              <span className="inline-block w-5 h-5 font-sans bg-black rounded-sm"></span>
              Tik Tok
            </h3>
            <span className="text-[11px] font-extralight text-sky-900 bg-sky-100 px-2 py-0.5 rounded-md absolute right-4 top-4">
              Not Connected
            </span>
            <div className="text-xs font-extralight text-gray-600 mt-2">Followers</div>
            <div className="text-xs text-black ml-113 relative -top-5">0</div>
            <div className="text-xs font-extralight text-gray-600 mt-2">Engagement</div>
            <div className="text-xs text-black ml-110 relative -top-5">0%</div>
            <div className="flex justify-center mt-3">
              <button className="flex items-center justify-center gap-2 text-xs px-4 py-2 bg-sky-400 text-white rounded-md hover:bg-sky-300 transition-colors shadow h-8 w-100">
                Connect Account
              </button>
            </div>
          </div>
        </div>
  );
};

export default Platforms;
