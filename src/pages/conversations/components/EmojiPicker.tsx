import { useState, useMemo } from "react";
import { Input } from "@heroui/react";
import { HiOutlineSearch } from "react-icons/hi";

interface EmojiData {
  emoji: string;
  name: string;
  category: string;
}

const CATEGORIES = [
  { key: "all", label: "All", icon: "✨" },
  { key: "smileys", label: "Smileys", icon: "😀" },
  { key: "gestures", label: "Gestures", icon: "👋" },
  { key: "hearts", label: "Symbols", icon: "❤️" },
  { key: "nature", label: "Nature", icon: "🐱" },
  { key: "food", label: "Food", icon: "🍔" },
];

const EMOJIS: EmojiData[] = [
  // Smileys & Emotion
  { emoji: "😀", name: "grinning face smile happy", category: "smileys" },
  { emoji: "😃", name: "grinning face with big eyes smile happy", category: "smileys" },
  { emoji: "😄", name: "grinning face with smiling eyes happy", category: "smileys" },
  { emoji: "😁", name: "beaming face with smiling eyes grin happy", category: "smileys" },
  { emoji: "😆", name: "grinning squinting face happy", category: "smileys" },
  { emoji: "😅", name: "grinning face with sweat exercise", category: "smileys" },
  { emoji: "😂", name: "face with tears of joy laugh funny", category: "smileys" },
  { emoji: "🤣", name: "rolling on the floor laughing funny", category: "smileys" },
  { emoji: "😊", name: "smiling face with smiling eyes blush", category: "smileys" },
  { emoji: "😇", name: "smiling face with halo angel innocent", category: "smileys" },
  { emoji: "🙂", name: "slightly smiling face", category: "smileys" },
  { emoji: "🙃", name: "upside-down face silly", category: "smileys" },
  { emoji: "😉", name: "winking face wink", category: "smileys" },
  { emoji: "😌", name: "relieved face peace calm", category: "smileys" },
  { emoji: "😍", name: "smiling face with heart-eyes love like", category: "smileys" },
  { emoji: "🥰", name: "smiling face with hearts love crush", category: "smileys" },
  { emoji: "😘", name: "face blowing a kiss love kiss", category: "smileys" },
  { emoji: "😋", name: "face savoring food delicious yum", category: "smileys" },
  { emoji: "😛", name: "face with tongue silly", category: "smileys" },
  { emoji: "😜", name: "winking face with tongue silly", category: "smileys" },
  { emoji: "🤪", name: "zany face crazy silly", category: "smileys" },
  { emoji: "😎", name: "smiling face with sunglasses cool sunglasses", category: "smileys" },
  { emoji: "🥳", name: "partying face party celebrate", category: "smileys" },
  { emoji: "😏", name: "smirking face smirk sly", category: "smileys" },
  { emoji: "😒", name: "unamused face bored meh", category: "smileys" },
  { emoji: "😔", name: "pensive face sad sorrow", category: "smileys" },
  { emoji: "😟", name: "worried face worry sad", category: "smileys" },
  { emoji: "🥱", name: "yawning face tired sleep", category: "smileys" },
  { emoji: "😴", name: "sleeping face sleep tired snore", category: "smileys" },
  { emoji: "😢", name: "crying face cry sad tear", category: "smileys" },
  { emoji: "😭", name: "loudly crying face cry sad tears sob", category: "smileys" },
  { emoji: "😡", name: "enraged face angry mad", category: "smileys" },
  { emoji: "😠", name: "angry face mad annoyed", category: "smileys" },
  { emoji: "🤫", name: "shushing face quiet shh", category: "smileys" },
  { emoji: "🤔", name: "thinking face think question", category: "smileys" },
  { emoji: "😱", name: "face screaming in fear shock surprise", category: "smileys" },
  { emoji: "😳", name: "flushed face blush embarrassed", category: "smileys" },
  { emoji: "🥺", name: "pleading face beg puppy eyes", category: "smileys" },
  { emoji: "🤤", name: "drooling face hungry delicious", category: "smileys" },

  // Hands & Gestures
  { emoji: "👋", name: "waving hand wave hello bye", category: "gestures" },
  { emoji: "🤚", name: "raised back of hand", category: "gestures" },
  { emoji: "✋", name: "raised hand stop highfive", category: "gestures" },
  { emoji: "🖖", name: "vulcan salute spock", category: "gestures" },
  { emoji: "👌", name: "ok hand okay", category: "gestures" },
  { emoji: "✌️", name: "victory hand peace two", category: "gestures" },
  { emoji: "🤞", name: "crossed fingers luck", category: "gestures" },
  { emoji: "🤟", name: "love-you gesture", category: "gestures" },
  { emoji: "🤘", name: "sign of the horns rockon", category: "gestures" },
  { emoji: "🤙", name: "call me hand phone", category: "gestures" },
  { emoji: "👈", name: "backhand index pointing left", category: "gestures" },
  { emoji: "👉", name: "backhand index pointing right", category: "gestures" },
  { emoji: "👆", name: "backhand index pointing up", category: "gestures" },
  { emoji: "👇", name: "backhand index pointing down", category: "gestures" },
  { emoji: "👍", name: "thumbs up like yes approve", category: "gestures" },
  { emoji: "👎", name: "thumbs down dislike no", category: "gestures" },
  { emoji: "👊", name: "oncoming fist punch", category: "gestures" },
  { emoji: "✊", name: "raised fist power strength", category: "gestures" },
  { emoji: "👏", name: "clapping hands clap applaud", category: "gestures" },
  { emoji: "🙌", name: "raising hands celebrate party", category: "gestures" },
  { emoji: "👐", name: "open hands", category: "gestures" },
  { emoji: "🤝", name: "handshake agree deal partner", category: "gestures" },
  { emoji: "🙏", name: "folded hands pray thank please", category: "gestures" },
  { emoji: "💪", name: "flexed biceps strong muscle", category: "gestures" },

  // Hearts & Symbols
  { emoji: "❤️", name: "red heart love", category: "hearts" },
  { emoji: "🧡", name: "orange heart love", category: "hearts" },
  { emoji: "💛", name: "yellow heart love", category: "hearts" },
  { emoji: "💚", name: "green heart love", category: "hearts" },
  { emoji: "💙", name: "blue heart love", category: "hearts" },
  { emoji: "💜", name: "purple heart love", category: "hearts" },
  { emoji: "🖤", name: "black heart love", category: "hearts" },
  { emoji: "🤍", name: "white heart love", category: "hearts" },
  { emoji: "🤎", name: "brown heart love", category: "hearts" },
  { emoji: "💔", name: "broken heart sad split", category: "hearts" },
  { emoji: "❣️", name: "heart exclamation", category: "hearts" },
  { emoji: "💕", name: "two hearts love", category: "hearts" },
  { emoji: "💞", name: "revolving hearts love", category: "hearts" },
  { emoji: "💓", name: "beating heart love", category: "hearts" },
  { emoji: "💗", name: "growing heart love", category: "hearts" },
  { emoji: "💖", name: "sparkling heart love", category: "hearts" },
  { emoji: "💘", name: "heart with arrow love cupids", category: "hearts" },
  { emoji: "💝", name: "heart with ribbon gift love", category: "hearts" },
  { emoji: "✨", name: "sparkles shiny star", category: "hearts" },
  { emoji: "🔥", name: "fire hot spark match burn", category: "hearts" },
  { emoji: "🌟", name: "glowing star shine", category: "hearts" },
  { emoji: "🎉", name: "party popper celebrate", category: "hearts" },
  { emoji: "💯", name: "hundred points perfect score 100", category: "hearts" },

  // Animals & Nature
  { emoji: "🐶", name: "dog face puppy bark pet", category: "nature" },
  { emoji: "🐱", name: "cat face kitty meow pet", category: "nature" },
  { emoji: "🐭", name: "mouse face", category: "nature" },
  { emoji: "🐹", name: "hamster face pet", category: "nature" },
  { emoji: "🐰", name: "rabbit face bunny pet", category: "nature" },
  { emoji: "🦊", name: "fox face", category: "nature" },
  { emoji: "🐻", name: "bear face", category: "nature" },
  { emoji: "🐼", name: "panda face", category: "nature" },
  { emoji: "🐨", name: "koala face", category: "nature" },
  { emoji: "🐯", name: "tiger face", category: "nature" },
  { emoji: "🦁", name: "lion face", category: "nature" },
  { emoji: "🐮", name: "cow face", category: "nature" },
  { emoji: "🐷", name: "pig face", category: "nature" },
  { emoji: "🐸", name: "frog face", category: "nature" },
  { emoji: "🐵", name: "monkey face", category: "nature" },
  { emoji: "🐔", name: "chicken", category: "nature" },
  { emoji: "🐧", name: "penguin", category: "nature" },
  { emoji: "🦆", name: "duck", category: "nature" },
  { emoji: "🦅", name: "eagle bird", category: "nature" },
  { emoji: "🦉", name: "owl bird", category: "nature" },
  { emoji: "🐝", name: "honeybee bug insect", category: "nature" },
  { emoji: "🦋", name: "butterfly insect wings", category: "nature" },
  { emoji: "🐢", name: "turtle reptile shell", category: "nature" },
  { emoji: "🐍", name: "snake reptile", category: "nature" },
  { emoji: "🐙", name: "octopus sea", category: "nature" },
  { emoji: "🐠", name: "tropical fish sea ocean", category: "nature" },
  { emoji: "🐬", name: "dolphin ocean", category: "nature" },
  { emoji: "🌳", name: "deciduous tree forest green", category: "nature" },
  { emoji: "🌵", name: "cactus desert plant", category: "nature" },
  { emoji: "🌸", name: "cherry blossom flower spring", category: "nature" },
  { emoji: "🌹", name: "rose flower love red", category: "nature" },
  { emoji: "🌻", name: "sunflower yellow flower", category: "nature" },
  { emoji: "🍀", name: "four leaf clover luck green", category: "nature" },
  { emoji: "☀️", name: "sun weather hot summer day", category: "nature" },
  { emoji: "☁️", name: "cloud weather sky", category: "nature" },
  { emoji: "🌧️", name: "cloud with rain weather wet storm", category: "nature" },
  { emoji: "❄️", name: "snowflake weather winter cold", category: "nature" },

  // Food & Drink
  { emoji: "🍏", name: "green apple fruit food", category: "food" },
  { emoji: "🍎", name: "red apple fruit food", category: "food" },
  { emoji: "🍊", name: "tangerine orange fruit food", category: "food" },
  { emoji: "🍌", name: "banana fruit food", category: "food" },
  { emoji: "🍉", name: "watermelon fruit food summer", category: "food" },
  { emoji: "🍇", name: "grapes fruit food", category: "food" },
  { emoji: "🍓", name: "strawberry fruit food dessert red", category: "food" },
  { emoji: "🍒", name: "cherries fruit food", category: "food" },
  { emoji: "🍑", name: "peach fruit food", category: "food" },
  { emoji: "🍍", name: "pineapple fruit food", category: "food" },
  { emoji: "🥥", name: "coconut fruit food", category: "food" },
  { emoji: "🥝", name: "kiwi fruit food", category: "food" },
  { emoji: "🍅", name: "tomato vegetable food", category: "food" },
  { emoji: "🥑", name: "avocado vegetable green healthy", category: "food" },
  { emoji: "🥦", name: "broccoli green vegetable", category: "food" },
  { emoji: "🥕", name: "carrot vegetable food orange", category: "food" },
  { emoji: "🌽", name: "ear of corn vegetable food yellow", category: "food" },
  { emoji: "🍕", name: "pizza food slice cheese", category: "food" },
  { emoji: "🍔", name: "hamburger food burger beef sandwich", category: "food" },
  { emoji: "🍟", name: "french fries food chips potato", category: "food" },
  { emoji: "🌭", name: "hot dog food sausage bread", category: "food" },
  { emoji: "🌮", name: "taco food Mexican wrap", category: "food" },
  { emoji: "🍣", name: "sushi food Japan fish rice", category: "food" },
  { emoji: "🍿", name: "popcorn food movie snack", category: "food" },
  { emoji: "🍩", name: "donut food sweet dessert", category: "food" },
  { emoji: "🍪", name: "cookie food sweet chocolate snack", category: "food" },
  { emoji: "🎂", name: "birthday cake food sweet celebrate party", category: "food" },
  { emoji: "🍫", name: "chocolate bar food sweet candy", category: "food" },
  { emoji: "🥤", name: "cup with straw drink soda softdrink", category: "food" },
  { emoji: "☕️", name: "hot beverage coffee tea cup mug drink", category: "food" },
  { emoji: "🍺", name: "beer mug drink alcohol pub bar", category: "food" },
  { emoji: "🍷", name: "wine glass drink alcohol bar red", category: "food" }
];

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

export default function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredEmojis = useMemo(() => {
    return EMOJIS.filter((emoji) => {
      const matchesCategory =
        activeCategory === "all" || emoji.category === activeCategory;
      const matchesSearch =
        !search || emoji.name.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  return (
    <div className="w-[300px] bg-white dark:bg-content1 rounded-xl shadow-xl border border-foreground/10 flex flex-col overflow-hidden text-foreground">
      {/* Search Header */}
      <div className="p-2 border-b border-foreground/5 bg-gray-50/50 dark:bg-black/10">
        <Input
          placeholder="Search emojis..."
          aria-label="Search emojis"
          startContent={<HiOutlineSearch className="text-gray-400 dark:text-foreground/40" />}
          variant="flat"
          size="sm"
          value={search}
          onValueChange={setSearch}
          className="w-full"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex border-b border-foreground/5 bg-gray-50/30 dark:bg-black/5 overflow-x-auto select-none no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            title={cat.label}
            className={`flex-1 py-2 text-center text-sm transition-all relative min-w-[44px] hover:bg-gray-100 dark:hover:bg-white/5 ${
              activeCategory === cat.key ? "text-primary" : "text-gray-500 dark:text-foreground/50"
            }`}
          >
            <span className="text-base">{cat.icon}</span>
            {activeCategory === cat.key && (
              <span className="absolute bottom-0 left-1 right-1 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Emojis Grid Area */}
      <div className="h-[250px] overflow-y-auto p-3 grid grid-cols-7 gap-1 select-none">
        {filteredEmojis.length > 0 ? (
          filteredEmojis.map((emojiObj, idx) => (
            <button
              key={`${emojiObj.emoji}-${idx}`}
              onClick={() => onEmojiSelect(emojiObj.emoji)}
              className="aspect-square flex items-center justify-center text-xl rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 active:scale-95 transition-all"
              title={emojiObj.name}
            >
              {emojiObj.emoji}
            </button>
          ))
        ) : (
          <div className="col-span-7 flex flex-col items-center justify-center h-full py-8 text-gray-400 dark:text-foreground/30">
            <span className="text-2xl mb-1">🔍</span>
            <span className="text-xs">No emojis found</span>
          </div>
        )}
      </div>
    </div>
  );
}
