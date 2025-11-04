// import ComponentContainer from "../components/common/ComponentContainer";

// const SocialMedia = () => {
//   const headingData = {
//     heading: 'Social Media Management',
//     subHeading: "Manage posts, view analytics, and engage with your audience across all platforms",
//   };

//   return (
//     <ComponentContainer headingData={headingData}>
//       Add your social media management content here
//     </ComponentContainer>
//   );
// };

// export default SocialMedia;


import React, { useState } from "react";

export default function SocialMediaDashboard() {
  const [activeTab, setActiveTab] = useState("Overview");

  const topCards = [
    { title: "Total Followers", value: "2,407", subtitle: "+124 this month", subtitleColor: "text-gray-600", icon: "👥" },
    { title: "Engagement Rate", value: "4.8%", subtitle: "+0.6% from last month", subtitleColor: "text-gray-600", icon: "💬" },
    { title: "Total Likes", value: "107", subtitle: "This month", subtitleColor: "text-gray-600", icon: "🤍" },
    { title: "Comments", value: "30", subtitle: "This month", subtitleColor: "text-gray-600", icon: "🔄" },
  ];

  const platforms = [
    { name: "Facebook", followers: "1,233", engagement: "5.2%", posts: "24" },
    { name: "Instagram", followers: "987", engagement: "6.1%", posts: "18" },
    { name: "LinkedIn", connections: "626", engagement: "3.8%", posts: "12" },
  ];

  return (
    <div className="p-8 bg-white min-h-screen flex flex-col items-center">
      {/* Header */}
      <div className="w-[1700px] h-[70px] p-8 shadow flex flex-col sm:flex-row justify-between items-center mb-10 bg-white">
        <div className="text-center sm:text-left mb-4 sm:mb-0">
          <h1 className="text-2xl font-2xl text-black ml-4 px-2 py-1 rounded">
            Social Media
          </h1>
          <p className="text-sm font-extralight text-gray-600 ml-6 mt-1 mb-7">
            Manage your social media presence and engagement.
          </p>
        </div>
        <button className="bg-sky-400 hover:bg-sky-400 text-white text-xs font-light px-5 py-2 rounded-lg shadow transition flex justify-start items-center">
          <span className="mr-1">+</span> Create Post
        </button>
      </div>

      {/* Tabs */}
    <div className="w-full py-1.5 bg-sky-50 rounded-full shadow flex justify-between mb-8 px-1.5 border border-gray-50 cursor-pointer">

        {["Overview", "Posts", "Analytics", "Platforms"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 text-center py-1 text-xs font-extralight rounded-full transition ${activeTab === tab
              ? "bg-white text-black shadow-md hover:bg-white"
              : "text-black hover:bg-gray-50"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/*  OVERVIEW TAB */}
{activeTab === "Overview" && (
  <>
    {/* Top Cards */}
    <div className="grid grid-cols-4 gap-11 mb-8">
      {topCards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow p-10 w-92 h-40 border border-gray-50 hover:border-sky-200 transition-colors relative"
        >
          <div className="flex justify-between items-start">
            <p className="text-xs font-extralight text-black text-left relative -top-4 mt-1 -mt-15">
              {card.title}
            </p>
            <span className="text-xs relative -top-4">{card.icon}</span>
          </div>
          <h2 className="text-2xl font-bold text-brand font-inter font-thin text-sky-600 mt-2">
            {card.value}
          </h2>
          <p className={`text-xs font-extralight mt-1 ${card.subtitleColor}`}>
            {card.subtitle}
          </p>
        </div>
      ))}
    </div>

    {/* Platforms */}
    <div className="grid grid-cols-3 gap-11 mb-8">
      {platforms.map((p, i) => (
        <div
          key={i}
          className="bg-white h-50 px-6 py-6 w-125 rounded-xl shadow border border-gray-50 hover:border-sky-200 transition-colors"
        >
          <h3 className="text-sm font-extralight text-gray-800 mb-3 flex items-center gap-2">
            <span
              className={`inline-block w-5 h-5 rounded-sm ${p.name === "Facebook"
                  ? "bg-blue-500"
                  : p.name === "Instagram"
                    ? "bg-pink-500"
                    : p.name === "LinkedIn"
                      ? "bg-sky-400"
                      : "bg-gray-400" // default color if not matched
                }`}
            ></span>
            {p.name}
          </h3>

          {p.followers && (
            <>
              <div className="text-xs font-extralight text-gray-500 mt-8">Followers:</div>
              <div className="text-xs text-black ml-105 relative -top-4">{p.followers}</div>
            </>
          )}

          {p.connections && (
            <>
              <div className="text-xs font-extralight text-gray-500 mt-8">Connections:</div>
              <div className="text-xs text-black ml-105 relative -top-4">{p.connections}</div>
            </>
          )}

          <div className="text-xs font-extralight text-gray-500 mt-1">Engagement:</div>
          <div className="text-xs text-black  ml-105 relative -top-4">{p.engagement}</div>

          <div className="text-xs font-extralight text-gray-500 mt-1">Posts:</div>
          <div className="text-xs text-black ml-105 relative -top-4">{p.posts}</div>
        </div>
      ))}
    </div>

    {/* Bottom Section */}
   <div className="grid grid-cols-2 w-full h-60 gap-6">

      {/* Recent Performance */}
      <div className="bg-white rounded-xl shadow p-6 border border-gray-50 hover:border-sky-200 transition-colors">
        <h3 className="text-xs text-gray-700 mb-3 flex items-center gap-2">
          <span className="text-blue-600">📊</span> Recent Performance
        </h3>
        <br />
        <div className="text-xs font-extralight text-gray-800 mt-2">Total Reach</div>
        <div className="text-sm ml-170 text-sky-400 -mt-3">12,345</div>
        <div className="text-xs font-extralight text-gray-800 mt-3">Total Impressions</div>
        <div className="text-sm ml-170 text-sky-400 -mt-3 ">23,456</div>
        <div className="text-xs font-extralight text-gray-800 mt-3">Avg. Click Rate</div>
        <div className="text-sm ml-170 text-sky-400 -mt-3">6.2%</div>
      </div>

      {/* Content Calendar */}
      <div className="bg-white rounded-xl shadow p-6 border border-gray-50 hover:border-sky-200 transition-colors">
        <h3 className="text-xs font-extralight text-gray-800 mb-3 flex items-center gap-2">
          <span className="text-sky-500">🗓️</span> Content Calendar
        </h3>
        <br />
        <div className="text-xs font-extralight text-gray-800 mt-2">Scheduled posts:</div>
        <div className="text-xs text-sky-400 ml-25 relative -top-4">1</div>
        <div className="text-xs font-extralight text-gray-800 mt-3">Draft posts:</div>
        <div className="text-xs text-sky-400 ml-17 relative -top-4">0</div>
        <div className="text-xs font-extralight text-gray-800 mt-3">Published this month:</div>
        <div className="text-xs text-sky-400 ml-31 relative -top-4">2</div>
      </div>
    </div>
  </>
)}


      {/*  POSTS TAB */}
      {activeTab === "Posts" && (
        <div className="bg-white rounded-xl shadow p-5 border border-gray-50 hover:border-sky-200 transition-colors w-full">

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-extralight text-black">Recent Posts</h2>
            <span className="text-xs font-extralight text-sky-900 bg-sky-100 px-2 py-0.5 rounded-md">
              3 total posts
            </span>
          </div>

          <div className="space-y-4">
            {/* Post 1 */}
            <div className="border border-sky-100 pt-4 pb-6 rounded-xl shadow-sm transition w-385 h-29">
              <p className="text-black text-xs mb-2 ml-3">
                Transform your smile with our advanced orthodontic treatments! Schedule your consultation today.{" "}
                #OrthodonticCare #SmileTransformation
              </p>
              <div className="flex items-center gap-3 mb-2 ml-3">
                <span className="text-[11px] px-2 py-0.5 rounded-full text-green-900 bg-green-100">● Published</span>
                <span className="text-gray-500 font-extralight text-[11px]">Published: 15/01/2024</span>
              </div>
              <div className="flex gap-2 text-[11px] text-black mb-2">
                <span className="border border-sky-100 px-2 py-0.5 rounded-xl ml-3">Facebook</span>
                <span className="border border-sky-100 px-2 py-0.5 rounded-xl">Instagram</span>
                <span className="border border-sky-100 px-2 py-0.5 rounded-xl">LinkedIn</span>
              </div>
              <div className="flex gap-3 text-gray-400 text-[11px] ml-340 relative -top-6">
                <span>🤍 45</span><span>💬 12</span><span>🔗 8</span><span>👁️ 234</span>
              </div>
            </div>

            {/* Post 2 */}
            <div className="border border-sky-100 pt-4 pb-6 rounded-xl shadow-sm transition w-385 h-29">
              <p className="text-black text-xs mb-2 ml-3">
                Did you know? Clear aligners are nearly invisible and can straighten your teeth comfortably. Learn more about our Invisalign options!
              </p>
              <div className="flex items-center gap-3 mb-2 ml-3">
                <span className="text-[11px] px-2 py-0.5 rounded-full text-green-900 bg-green-100">● Published</span>
                <span className="text-gray-500 font-extralight text-[11px]">Published: 12/01/2024</span>
              </div>
              <div className="flex gap-2 text-[11px] text-black mb-2">
                <span className="border border-sky-100 px-2 py-0.5 rounded-xl ml-3">Instagram</span>
                <span className="border border-sky-100 px-2 py-0.5 rounded-xl">Facebook</span>
              </div>
              <div className="flex gap-3 text-gray-400 text-[11px] ml-340 relative -top-6">
                <span>🤍 62</span><span>💬 18</span><span>🔗 15</span><span>👁️ 312</span>
              </div>
            </div>

            {/* Post 3 */}
            <div className="border border-sky-100 pt-4 pb-6 rounded-xl shadow-sm transition w-385 h-29">
              <p className="text-black text-xs mb-2 ml-3">
                Exciting news! Our practice now offers extended hours on weekends. Book your appointment today!
              </p>
              <div className="flex items-center gap-3 mb-2 ml-3">
                <span className="text-[11px] px-2 py-0.5 rounded-full text-blue-600 bg-blue-100">● Scheduled</span>
                <span className="text-gray-500 font-extralight text-[11px]">Scheduled: 20/01/2024</span>
              </div>
              <div className="flex gap-2 text-[11px] text-black mb-2">
                <span className="border border-sky-100 px-2 py-0.5 rounded-xl ml-3">Facebook</span>
                <span className="border border-sky-100 px-2 py-0.5 rounded-xl">LinkedIn</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/*  ANALYTICS TAB */}
      {activeTab === "Analytics" && (
        <>
          {/* Top Cards */}
          <div className="grid grid-cols-4 gap-10 mb-8">
            {/* Total Reach */}
            <div className="bg-white rounded-xl shadow p-8 w-90 h-33 border border-gray-50 hover:border-sky-200 transition-colors relative">
              <div className="flex justify-between items-start">
                <p className="text-xs font-extralight text-black text-left relative -top-4 mt-1">
                  Total Reach
                </p>
                <span className="text-xs relative -top-4"></span>
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
                <span className="text-xs relative -top-4"></span>
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
                <span className="text-xs relative -top-4"></span>
              </div>
              <h2 className="text-3xl font-bold text-brand text-sky-600 mt-2">
                4.1%
              </h2>
              <p className="text-xs font-extralight text-gray-600 mt-1">Average rate</p>
            </div>

            {/* Total Engagement */}
            <div className="bg-white rounded-xl shadow p-8 w-92 h-33 border border-gray-50 hover:border-sky-200 transition-colors relative">
              <div className="flex justify-between items-start">
                <p className="text-xs font-extralight text-black text-left relative -top-4 mt-1">
                  Total Engagement
                </p>
                <span className="text-xs relative -top-4"></span>
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
          <div className="bg-white rounded-xl shadow p-6 w-[1600px] h-[400px] overflow-auto">
            <h3 className="text-sm text-extralight text-gray-700 mb-6">
              Platform Performance Breakdown
            </h3>
            <div className="space-y-6">
              {/* Facebook */}
              <div className="bg-white rounded-xl shadow p-6 border border-gray-50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div className="flex items-center gap-3">
                    <div className="inline-block w-4 h-4 font-sans bg-blue-600 rounded-sm relative -top-4"></div>
                    <span className="text-[13px] text-black relative -top-4">Facebook</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-2 sm:mt-0 flex flex-wrap gap-46 relative -bottom-4 items-end">
                    <div className="flex flex-col items-center">
                      <span className="text-[12px] text-sky-400">107</span>
                      <span className="text-[11px]">Likes</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[12px] text-sky-400">30</span>
                      <span className="text-[11px]">Comment</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[12px] text-sky-400">23</span>
                      <span className="text-[11px]">Shares</span>
                    </div>
                    <div className="flex flex-col items-center -translate-x-1"> {/* Move Views slightly right */}
                      <span className="text-[12px] text-sky-400">546</span>
                      <span className="text-[11px]">Views</span>
                    </div>
                    <div className="flex flex-col items-center -translate-y-6 -translate-x-1"> {/* Reduce gap with Views */}
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

                    <span className="text-[13px] text-black relative -top-4">Instagram</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-2 sm:mt-0 flex flex-wrap gap-46 relative -bottom-4">
                    <div className="flex flex-col items-center">
                      <span className="text-[12px] text-sky-400">107</span>
                      <span className="text-[11px]">Likes</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[12px] text-sky-400">30</span>
                      <span className="text-[11px]">Comment</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[12px] text-sky-400">23</span>
                      <span className="text-[11px]">Shares</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[12px] text-sky-400">546</span>
                      <span className="text-[11px]">Views</span>
                    </div>
                    <div className="flex flex-col items-center -translate-y-6">
                      <span className="text-[12px]  text-black px-2 py-0.5 rounded-md border border-gray-100">
                        2 posts
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* LinkedIn */}
              <div className="bg-white rounded-xl shadow p-6 border border-gray-50  transition-colors">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div className="flex items-center gap-3">
                    <div className="inline-block w-4 h-4 font-sans bg-blue-400 rounded-sm relative -top-4"></div>

                    <span className="text-[13px]  font-normal text-black relative -top-4">LinkedIn</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-2 sm:mt-0 flex flex-wrap gap-46 relative -bottom-4">
                    <div className="flex flex-col items-center">
                      <span className="text-[12px] text-sky-400">45</span>
                      <span className="text-[11px]">Likes</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[12px] text-sky-400">12</span>
                      <span className="text-[11px]">Comment</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[12px] text-sky-400">8</span>
                      <span className="text-[11px]">Shares</span>
                    </div>
                    <div className="flex flex-col items-center -ml-2">
                      <span className="text-[12px] text-sky-400">234</span>
                      <span className="text-[11px]">Views</span>
                    </div>

                    <div className="flex flex-col items-center -translate-y-6">
                      <span className="text-[12px] text-black px-2 py-0.5 rounded-md border border-gray-100">
                        2 posts
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === "Platforms" && (
        <div className="grid grid-cols-3 gap-10 mb-8">
          {/* Platform 1 */}
          <div className="bg-white h-[200px] px-4 py-5 w-130 rounded-xl shadow border border-gray-50 hover:border-sky-200 transition-colors relative">

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
          <div className="bg-white h-[200px] px-4 py-5 w-130 rounded-xl shadow border border-gray-50 hover:border-sky-200 transition-colors relative">

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
          <div className="bg-white h-[200px] px-4 py-5 w-126 rounded-xl shadow border border-gray-50 hover:border-sky-200 transition-colors relative">

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
          <div className="bg-white h-[200px] px-4 py-5 w-130 rounded-xl shadow border border-gray-50 hover:border-sky-200 transition-colors relative">

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
          <div className="bg-white h-[200px] px-4 py-5 w-130 rounded-xl shadow border border-gray-50 hover:border-sky-200 transition-colors relative">

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
          <div className="bg-white h-[200px] px-4 py-5 w-126 rounded-xl shadow border border-gray-50 hover:border-sky-200 transition-colors relative">
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
      )}
    </div>
  );
}