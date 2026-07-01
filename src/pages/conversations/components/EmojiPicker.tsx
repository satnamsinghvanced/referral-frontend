import React from "react";
import Picker, { Theme, EmojiClickData } from "emoji-picker-react";

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

export default function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  // Determine theme dynamically or check dark class
  const isDark = document.documentElement.classList.contains("dark");

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onEmojiSelect(emojiData.emoji);
  };

  return (
    <div className="shadow-xl rounded-xl overflow-hidden border border-foreground/10">
      <Picker
        onEmojiClick={handleEmojiClick}
        theme={isDark ? Theme.DARK : Theme.LIGHT}
        width={320}
        height={380}
        lazyLoadEmojis={true}
        searchPlaceHolder="Search emojis..."
        previewConfig={{ showPreview: false }}
        skinTonesDisabled={true}
      />
    </div>
  );
}
