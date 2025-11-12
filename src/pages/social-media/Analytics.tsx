const Analytics = () => {
  return (
    <div className="flex flex-col items-center">
      {/* 🧠 ANALYTICS CONTENT */}
      {/* Top Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {/* Total Reach */}
        <div className="bg-white rounded-xl shadow p-8 w-90 h-33 border border-gray-50 hover:border-sky-200 transition-colors relative">
          <div className="flex justify-between items-start">
            <p className="text-xs font-extralight text-black text-left relative -top-4 mt-1">
              Total Reach
            </p>
          </div>
          <h2 className="text-3xl font-bold text-brand text-sky-600 mt-2">
            3,056
          </h2>
          <p className="text-xs font-extralight text-gray-600 mt-1">All time</p>
        </div>

        {/* Total Impressions */}
        <div className="bg-white rounded-xl shadow p-8 w-90 h-33 border border-gray-50 hover:border-sky-200 transition-colors relative">
          <div className="flex justify-between items-start">
            <p className="text-xs font-extralight text-black text-left relative -top-4 mt-1">
              Total Impressions
            </p>
          </div>
          <h2 className="text-3xl font-bold text-brand text-sky-600 mt-2">
            5,460
          </h2>
          <p className="text-xs font-extralight text-gray-600 mt-1">All time</p>
        </div>

        {/* Avg. CTR */}
        <div className="bg-white rounded-xl shadow p-8 w-90 h-33 border border-gray-50 hover:border-sky-200 transition-colors relative">
          <div className="flex justify-between items-start">
            <p className="text-xs font-extralight text-black text-left relative -top-4 mt-1">
              Avg. CTR
            </p>
          </div>
          <h2 className="text-3xl font-bold text-brand text-sky-600 mt-2">
            4.1%
          </h2>
          <p className="text-xs font-extralight text-gray-600 mt-1">
            Average rate
          </p>
        </div>

        {/* Total Engagement */}
        <div className="bg-white rounded-xl shadow p-8 w-90 h-33 border border-gray-50 hover:border-sky-200 transition-colors relative">
          <div className="flex justify-between items-start">
            <p className="text-xs font-extralight text-black text-left relative -top-4 mt-1">
              Total Engagement
            </p>
          </div>
          <h2 className="text-3xl font-bold text-brand text-sky-600 mt-2">
            160
          </h2>
          <p className="text-xs font-extralight text-gray-600 mt-1">
            All interactions
          </p>
        </div>
      </div>

      {/* Platform Breakdown */}
      <div className="bg-white rounded-xl shadow p-6 w-full max-w-10xl h-[400px] overflow-auto">
        <h3 className="text-sm text-extralight text-gray-700 mb-6">
          Platform Performance Breakdown
        </h3>
        <div className="space-y-6">
          {/* Facebook */}
          <div className="bg-white rounded-xl shadow p-6 border border-gray-50 transition-colors">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div className="flex items-center gap-3">
                <div className="inline-block w-4 h-4 font-sans bg-blue-600 rounded-sm relative -top-4"></div>
                <span className="text-[13px] text-black relative -top-4">
                  Facebook
                </span>
              </div>
              <div className="text-sm text-gray-600 mt-2 sm:mt-0 flex flex-wrap gap-54  relative -bottom-4 items-end">
                <div className="flex flex-col items-center">
                  <span className="text-[12px] text-sky-400">107</span>
                  <span className="text-[11px]">Likes</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[12px] text-sky-400">30</span>
                  <span className="text-[11px]">Comments</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[12px] text-sky-400">23</span>
                  <span className="text-[11px]">Shares</span>
                </div>
                <div className="flex flex-col items-center -translate-x-1">
                  <span className="text-[12px] text-sky-400">546</span>
                  <span className="text-[11px]">Views</span>
                </div>
                <div className="flex flex-col items-center -translate-y-9 -translate-x-1">
                  <span className="text-[12px] text-black px-2 py-0.5 rounded-md border border-gray-100">
                    3 posts
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Instagram */}
          <div className="bg-white rounded-xl shadow p-6 border border-gray-50 transition-colors">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div className="flex items-center gap-3">
                <div className="inline-block w-4 h-4 font-sans bg-pink-600 rounded-sm relative -top-4"></div>
                <span className="text-[13px] text-black relative -top-4">
                  Instagram
                </span>
              </div>
              <div className="text-sm text-gray-600 mt-2 sm:mt-0 flex flex-wrap gap-54 relative -bottom-4 items-end">
                <div className="flex flex-col items-center">
                  <span className="text-[12px] text-sky-400">87</span>
                  <span className="text-[11px]">Likes</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[12px] text-sky-400">20</span>
                  <span className="text-[11px]">Comments</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[12px] text-sky-400">15</span>
                  <span className="text-[11px]">Shares</span>
                </div>
                <div className="flex flex-col items-center -translate-x-1">
                  <span className="text-[12px] text-sky-400">490</span>
                  <span className="text-[11px]">Views</span>
                </div>
                <div className="flex flex-col items-center -translate-y-9 -translate-x-1">
                  <span className="text-[12px] text-black px-2 py-0.5 rounded-md border border-gray-100">
                    2 posts
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* LinkedIn */}
          <div className="bg-white rounded-xl shadow p-6 border border-gray-50 transition-colors">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div className="flex items-center gap-3">
                <div className="inline-block w-4 h-4 font-sans bg-blue-800 rounded-sm relative -top-4"></div>
                <span className="text-[13px] text-black relative -top-4">
                  LinkedIn
                </span>
              </div>
              <div className="text-sm text-gray-600 mt-2 sm:mt-0 flex flex-wrap gap-54  relative -bottom-4 items-end">
                <div className="flex flex-col items-center">
                  <span className="text-[12px] text-sky-400">124</span>
                  <span className="text-[11px]">Likes</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[12px] text-sky-400">48</span>
                  <span className="text-[11px]">Comments</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[12px] text-sky-400">35</span>
                  <span className="text-[11px]">Shares</span>
                </div>
                <div className="flex flex-col items-center -translate-x-1">
                  <span className="text-[12px] text-sky-400">1,200</span>
                  <span className="text-[11px]">Views</span>
                </div>
                <div className="flex flex-col items-center -translate-y-9 -translate-x-1">
                  <span className="text-[12px] text-black px-2 py-0.5 rounded-md border border-gray-100">
                    2 posts
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
