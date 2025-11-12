
const Posts = () => {
  return (
    <div className="flex flex-col items-center">
      {/* 🟩 OVERVIEW TAB */}

      {/* 🟨 POSTS TAB */}
      <div className="bg-white rounded-xl shadow p-5 border border-gray-50 hover:border-sky-200 transition-colors w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-sm font-extralight text-black">Recent Posts</h2>
          <span className="text-xs font-extralight text-sky-900 bg-sky-100 px-2 py-0.5 rounded-md">
            3 total posts
          </span>
        </div>

        <div className="space-y-4">
          {/* Post 1 */}
          <div className="border border-sky-100 pt-4 pb-6 rounded-xl shadow-sm transition w-357 h-29">
            <p className="text-black text-xs mb-2 ml-3">
              Transform your smile with our advanced orthodontic treatments!
              Schedule your consultation today. #OrthodonticCare
              #SmileTransformation
            </p>
            <div className="flex items-center gap-3 mb-2 ml-3">
              <span className="text-[11px] px-2 py-0.5 rounded-full text-green-900 bg-green-100">
                ● Published
              </span>
              <span className="text-gray-500 font-extralight text-[11px]">
                Published: 15/01/2024
              </span>
            </div>
            <div className="flex gap-2 text-[11px] text-black mb-2">
              <span className="border border-sky-100 px-2 py-0.5 rounded-xl ml-3">
                Facebook
              </span>
              <span className="border border-sky-100 px-2 py-0.5 rounded-xl">
                Instagram
              </span>
              <span className="border border-sky-100 px-2 py-0.5 rounded-xl">
                LinkedIn
              </span>
            </div>
            <div className="flex gap-3 text-gray-400 text-[11px] ml-320 relative -top-6">
              <span>🤍 45</span>
              <span>💬 12</span>
              <span>🔗 8</span>
              <span>👁️ 234</span>
            </div>
          </div>

          {/* Post 2 */}
          <div className="border border-sky-100 pt-4 pb-6 rounded-xl shadow-sm transition w-357 h-29">
            <p className="text-black text-xs mb-2 ml-3">
              Did you know? Clear aligners are nearly invisible and can
              straighten your teeth comfortably. Learn more about our Invisalign
              options!
            </p>
            <div className="flex items-center gap-3 mb-2 ml-3">
              <span className="text-[11px] px-2 py-0.5 rounded-full text-green-900 bg-green-100">
                ● Published
              </span>
              <span className="text-gray-500 font-extralight text-[11px]">
                Published: 12/01/2024
              </span>
            </div>
            <div className="flex gap-2 text-[11px] text-black mb-2">
              <span className="border border-sky-100 px-2 py-0.5 rounded-xl ml-3">
                Instagram
              </span>
              <span className="border border-sky-100 px-2 py-0.5 rounded-xl">
                Facebook
              </span>
            </div>
            <div className="flex gap-3 text-gray-400 text-[11px] ml-320 relative -top-6">
              <span>🤍 62</span>
              <span>💬 18</span>
              <span>🔗 15</span>
              <span>👁️ 312</span>
            </div>
          </div>

          {/* Post 3 */}
          <div className="border border-sky-100 pt-4 pb-6 rounded-xl shadow-sm transition w-357 h-29">
            <p className="text-black text-xs mb-2 ml-3">
              Exciting news! Our practice now offers extended hours on weekends.
              Book your appointment today!
            </p>
            <div className="flex items-center gap-3 mb-2 ml-3">
              <span className="text-[11px] px-2 py-0.5 rounded-full text-blue-600 bg-blue-100">
                ● Scheduled
              </span>
              <span className="text-gray-500 font-extralight text-[11px]">
                Scheduled: 20/01/2024
              </span>
            </div>
            <div className="flex gap-2 text-[11px] text-black mb-2">
              <span className="border border-sky-100 px-2 py-0.5 rounded-xl ml-3">
                Facebook
              </span>
              <span className="border border-sky-100 px-2 py-0.5 rounded-xl">
                LinkedIn
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Posts;
