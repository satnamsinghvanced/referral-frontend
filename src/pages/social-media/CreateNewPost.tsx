
"use client";

import React, { useState, useRef } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Input, Textarea, Button, Card, CardBody } from "@heroui/react"; // Import the Card component
import ErrorBoundary from "./ErrorBoundary"; // Import ErrorBoundary

interface CreateNewPostProps {
  setIsModalOpen: (isOpen: boolean) => void;
}

const CreateNewPost: React.FC<CreateNewPostProps> = ({ setIsModalOpen }) => {
  const [postContent, setPostContent] = useState<string>("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<string>("Publish Now");
  const [showScheduleMenu, setShowScheduleMenu] = useState<boolean>(false);
  const [scheduledDate, setScheduledDate] = useState<string>("");
  const [scheduledTime, setScheduledTime] = useState<string>("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestedHashtags = Array.from(
    new Set([
      "#OrthodonticCare",
      "#SmileTransformation",
      "#BracesLife",
      "#Invisalign",
      "#HealthySmile",
      "#OrthodonticsSpecialist",
      "#StraightTeeth",
      "#DentalHealth",
    ])
  );

  const platforms = [
    { name: "Facebook", icon: "📘" },
    { name: "Instagram", icon: "📸" },
    { name: "LinkedIn", icon: "💼" },
    { name: "Twitter", icon: "🐦" },
    { name: "YouTube", icon: "▶️" },
    { name: "TikTok", icon: "🎵" },
  ];

  const handlePlatformClick = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    );
  };

  const handleScheduleClick = (option: string) => {
    setSelectedSchedule(option);
    setShowScheduleMenu(false);
  };

  const handleSavePost = () => {
    const postData = {
      content: postContent,
      platforms: selectedPlatforms,
      schedule:
        selectedSchedule === "Schedule for Later" ? { date: scheduledDate, time: scheduledTime } : null,
      hashtags,
    };
    console.log("Post Data:", postData);
    setIsModalOpen(false);
  };

  const toggleHashtag = (tag: string) => {
    setHashtags((prev) => (prev.includes(tag) ? [] : [tag]));
  };

  return (
    <Modal isOpen={true} onClose={() => setIsModalOpen(false)}>
      <ModalContent className="max-w-2xl w-full mx-auto p-6 shadow-lg rounded-2xl max-h-[85vh] overflow-y-auto">
        <ModalHeader>
          <p className="text-xs text-gray-500 mt-10 mb-5">
            Create and schedule posts across your social media platforms
          </p>
          <h2 className="text-sm text-black-900 mb-2 mt-3 text-left"> {/* Added text-left to align the title to the left */}
            Create New Post
          </h2>
        </ModalHeader>

        <ModalBody>
          <ErrorBoundary>
            {/* </Card> */}
            {/* <CardBody> /*}
                {/* Post Content */}
            <h3 className="text-[12px] text-black-900 mb-2">Post content</h3>
            <div className="mb-6">
              <Textarea
                placeholder="What's on your mind? Share updates about your practice..."
                maxLength={280}
                minRows={3}
                value={postContent}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 280) {
                    setPostContent(value);
                  }
                }}
                className={`w-full rounded p-2 bg-gray-100 focus:ring-2 focus:ring-blue-500 border ${postContent.length === 0
                  ? "border-gray-100"
                  : postContent.length >= 280
                    ? "border-red-500 border-5"
                    : "border-blue-500"
                  }`}
              />
              <p className={`text-xs mt-1 ${postContent.length >= 280 ? "text-red-500" : "text-gray-400"}`}>
                {postContent.length}/280 characters
              </p>
              {postContent.length >= 280 && (
                <p className="text-red-500 text-xs mt-1">You cannot write more than 280 characters.</p>
              )}
            </div>

            {/* Platforms */}
            <h3 className="text-[12px] text-black-900 mb-3">Select Platforms</h3>
            <div className="grid grid-cols-3 gap-4 mb-6 w-full min-h-[150px]">
              {platforms.map((platform) => (
                <button
                  key={platform.name}
                  onClick={() => handlePlatformClick(platform.name)}
                  className={`flex flex-col items-center justify-center border rounded-lg py-2 text-xs font-medium transition duration-200 ${selectedPlatforms.includes(platform.name)
                    ? "bg-blue-500 text-white border-blue-500 shadow-md"
                    : "bg-white text-gray-600 border-sky-100 hover:bg-blue-100 hover:text-blue-500"
                    }`}
                >
                  <span className="text-xl mb-1">{platform.icon}</span>
                  <span className="text-xs">{platform.name}</span>
                </button>
              ))}
            </div>

            {/* Publishing Schedule */}
            <h3 className="text-[12px] text-gray-800 mb-2">Publishing Schedule</h3>
            <button
              className={`w-full rounded text-[12px] text-black text-left pl-3 flex justify-between items-center ${selectedSchedule ? "border-2 border-gray-50 bg-gray-50 py-1" : "border border-gray-300 bg-gray-200 py-2"
                }`}
              onClick={() => setShowScheduleMenu(!showScheduleMenu)}
            >
              {selectedSchedule}
            </button>
            {showScheduleMenu && (
              <div className="bg-white border text-[12px] rounded shadow-md mt-1 w-full">
                <button
                  className="w-full text-left px-3 py-2 hover:bg-orange-300"
                  onClick={() => handleScheduleClick("Publish Now")}
                >
                  Publish Now
                </button>
                <button
                  className="w-full text-left px-3 py-2 hover:bg-gray-50"
                  onClick={() => handleScheduleClick("Schedule for Later")}
                >
                  Schedule for Later
                </button>
              </div>
            )}
            {selectedSchedule === "Schedule for Later" && (
              <div className="flex gap-4 mt-3">
                <input
                  type="date"
                  className="w-1/2 border border-gray-300 rounded px-2 py-1 text-xs text-gray-700"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                />
                <input
                  type="time"
                  className="w-1/2 border border-gray-300 rounded px-3 py-2 text-gray-700"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                />
              </div>
            )}
            {/* Media Upload */}
            <div className="mt-4">
              <h3 className="text-black text-xs mb-2">Media</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500 hover:bg-gray-50 cursor-pointer w-full max-w-2xl mx-auto mb-6">
                <div className="flex justify-center items-center gap-3 mb-2">
                  {/* Download */}
                  <a
                    href="/path-to-your-file/sample-file.jpg"
                    download
                    className="flex items-center hover:scale-110 transition-transform"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                      />
                    </svg>
                  </a>

                  {/* Video */}
                  <a
                    href="/path-to-your-video/sample-video.mp4"
                    download
                    className="flex items-center hover:scale-110 transition-transform"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10l4.553 2.276a1 1 0 010 1.448L15 16V10zM5 6h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z"
                      />
                    </svg>
                  </a>

                  {/* Page */}
                  <a
                    href="/path-to-your-document/sample-file.pdf"
                    download
                    className="flex items-center hover:scale-110 transition-transform"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 2a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V8l-6-6H7z"
                      />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 2v6h6" />
                    </svg>
                  </a>
                </div>
                <p className="text-xs text-black">Drop files here or click to upload</p>

                <p className="text-xs mt-1 text-gray-400">
                  Images: JPEG, PNG, GIF, WEBP • Videos: MP4, MOV, AVI • Documents:
                  PDF, DOCX • Max 10MB each
                </p>
              </div>
            </div>

            {/* Hashtags Input */}
            <div className="mt-6">
              <h3 className="text-xs font-medium text-black-900 mb-3">Hashtags</h3>
              <div className="flex gap-2 mb-4">
                <Input
                  ref={inputRef}
                  placeholder="# Add hashtags (press enter or comma to add)"
                  className="text-[10px]"
                  onKeyDown={(e) => {
                    if (["Enter", ",", "Tab"].includes(e.key)) {
                      e.preventDefault();
                      const newTag = (e.target as HTMLInputElement).value.trim();
                      if (newTag) {
                        setHashtags([newTag]); //  Replace previous tag with new one
                      }
                      (e.target as HTMLInputElement).value = "";
                    }
                  }}
                />
                <Button
                  variant="bordered"
                  className="border-gray-50 text-gray-400 bg-gray-50 hover:bg-gray-50"
                  onClick={() => {
                    const newTag = inputRef.current?.value.trim();
                    if (newTag) {
                      setHashtags([newTag]); // Replace previous tag with new one
                    }
                    if (inputRef.current) inputRef.current.value = "";
                  }}
                >
                  Add
                </Button>
              </div>
            </div>
            {/* Suggested Hashtags */}
            <div className="mt-5">
              <h3 className="text-[11px] text-gray-500 font-light mb-3">
                Suggested Hashtags:
              </h3>

              {/* Selected Hashtags Display */}
              {hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {hashtags.map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center gap-1 text-[11px] px-3 py-1 rounded-full border transition-all duration-200 bg-sky-100 text-sky-700 border-sky-200"
                    >
                      {tag}
                      <button
                        onClick={() => toggleHashtag(tag)}
                        className="ml-1 font-bold text-sky-600 hover:text-sky-800"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Suggested Hashtags Buttons */}
              <div className="flex gap-2 flex-wrap mb-4">
                {suggestedHashtags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleHashtag(tag)}
                    className={`text-[11px] px-3 py-1 rounded-md border border-sky-100 transition-all duration-200 ${hashtags.includes(tag)
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-black hover:bg-sky-50"
                      }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* ✅ Preview Section */}
              {hashtags.length > 0 && (
                <div className="mt-10 relative">
                  <h4 className="absolute -top-5 left-3 bg-white text-black text-xs font-semibold px-1">
                    Preview
                  </h4>

                  <div className="p-4 border border-sky-200 rounded-lg bg-gray-50">
                    <p className="text-[10px] text-gray-700 flex flex-wrap gap-1">
                      {hashtags.map((tag) => (
                        <span key={tag} className="text-blue-600">
                          {tag}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/*</CardBody> */}
            {/* </Card> */}
          </ErrorBoundary>
        </ModalBody>

        <ModalFooter>


          {/* Cancel & Publish Buttons */}
          <div className="flex justify-between mt-6 gap-x-4"> {/* Added gap-x-4 */}
            <Button
              variant="bordered"
              className="text-[12px] text-black-900 px-4 py-2 border-sky-50 hover:bg-orange-200"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              className="text-[13px] px-7 py-2 text-white hover:text-white bg-sky-300"
              onClick={handleSavePost}
            >
              Schedule Post
            </Button>
          </div>

        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateNewPost;
