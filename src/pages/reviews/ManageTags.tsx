import { Button, Chip, Progress, useDisclosure } from "@heroui/react";
import { useState } from "react";
import {
  FiCheck,
  FiCopy,
  FiSmartphone,
  FiTrash2,
  FiWifi,
} from "react-icons/fi";
import { LuNfc, LuQrCode, LuTrash2 } from "react-icons/lu";
import CreateTagModal from "./modal/CreateTagModal";
import { AiOutlinePlus } from "react-icons/ai";

interface TagData {
  id: string;
  type: "nfc" | "qr";
  name: string;
  location: string;
  status: "active" | "inactive";
  taps: number;
  reviews: number;
  conversionRate: number;
  url: string;
  created: string;
  lastUsed: string;
  displayId: string;
}

const INITIAL_TAGS: TagData[] = [
  {
    id: "1",
    type: "nfc",
    name: "Front Desk Card",
    location: "Downtown Office",
    status: "active",
    taps: 142,
    reviews: 89,
    conversionRate: 62.7,
    url: "https://practiceroi.com/review/nfc-001",
    created: "1/1/2024",
    lastUsed: "1/20/2024",
    displayId: "NFC-001",
  },
  {
    id: "2",
    type: "nfc",
    name: "Waiting Room Card",
    location: "Downtown Office",
    status: "active",
    taps: 87,
    reviews: 52,
    conversionRate: 59.8,
    url: "https://practiceroi.com/review/nfc-002",
    created: "1/10/2024",
    lastUsed: "1/19/2024",
    displayId: "NFC-002",
  },
  {
    id: "3",
    type: "nfc",
    name: "Checkout Counter",
    location: "Westside Clinic",
    status: "active",
    taps: 98,
    reviews: 71,
    conversionRate: 72.4,
    url: "https://practiceroi.com/review/nfc-003",
    created: "1/5/2024",
    lastUsed: "1/20/2024",
    displayId: "NFC-003",
  },
];

const ManageTags = () => {
  const [tags, setTags] = useState<TagData[]>(INITIAL_TAGS);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleCreateTag = (data: any) => {
    const newTag: TagData = {
      id: Math.random().toString(36).substr(2, 9),
      type: data.type,
      name: data.name,
      location: data.locations.length > 0 ? "Multiple Locations" : "Unknown", // Simplified for demo
      status: "active",
      taps: 0,
      reviews: 0,
      conversionRate: 0,
      url: `https://practiceroi.com/review/${data.type}-${Math.random()
        .toString(36)
        .substr(2, 4)}`,
      created: new Date().toLocaleDateString(),
      lastUsed: "-",
      displayId: `${data.type.toUpperCase()}-${Math.floor(
        Math.random() * 1000
      )}`,
    };
    setTags([...tags, newTag]);
  };

  const handleDelete = (id: string) => {
    setTags(tags.filter((t) => t.id !== id));
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h3 className="text-base">NFC Tags & QR Codes</h3>
          <p className="text-xs text-gray-600">
            Create and manage review collection tags for your practice locations
          </p>
        </div>
        <Button
          size="sm"
          radius="sm"
          variant="solid"
          color="primary"
          onPress={onOpen}
          startContent={<AiOutlinePlus className="text-[15px]" />}
        >
          Create New Tag/QR
        </Button>
      </div>

      {/* Tags Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {tags.map((tag) => (
          <div className="bg-white rounded-xl border border-primary/15 p-4 flex flex-col gap-5">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="flex gap-2">
                <div className={`mt-1`}>
                  {tag.type === "nfc" ? (
                    <LuNfc className="text-blue-500 text-xl" />
                  ) : (
                    <LuQrCode className="text-blue-500 text-xl" />
                  )}
                </div>

                <div className="space-y-0.5">
                  <h4 className="font-medium">{tag.name}</h4>
                  <p className="text-xs text-gray-500">{tag.location}</p>
                </div>
              </div>
              <Chip
                size="sm"
                radius="sm"
                variant="solid"
                color="success"
                className="bg-emerald-100 text-emerald-800 text-[11px] h-5"
              >
                {tag.status}
              </Chip>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-sky-50 rounded-lg p-3 text-center space-y-0.5">
                <div className="text-xl font-bold text-sky-600">{tag.taps}</div>
                <div className="text-xs text-gray-500 font-medium">Taps</div>
              </div>
              <div className="bg-emerald-50 rounded-lg p-3 text-center space-y-0.5">
                <div className="text-xl font-bold text-emerald-600">
                  {tag.reviews}
                </div>
                <div className="text-xs text-gray-500 font-medium">Reviews</div>
              </div>
            </div>

            {/* Conversion Rate */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium text-gray-500">
                <span>Conversion Rate</span>
                <span className="text-gray-900">{tag.conversionRate}%</span>
              </div>
              <Progress
                aria-label="Conversion rate"
                value={tag.conversionRate}
                size="sm"
                color="primary"
                classNames={{ track: "bg-gray-100 h-2" }}
              />
            </div>

            {/* URL */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-2.5 flex items-end justify-between">
              <div className="space-y-0.5">
                <div className="text-[11px] text-gray-500">Review URL</div>
                <div className="text-xs text-gray-700 truncate font-medium">
                  {tag.url}
                </div>
              </div>
              <Button
                size="sm"
                radius="sm"
                variant="light"
                color={copiedId === tag.id ? "success" : "default"}
                onPress={() => handleCopy(tag.id, tag.url)}
                startContent={
                  copiedId === tag.id ? (
                    <FiCheck size={14} />
                  ) : (
                    <FiCopy size={14} />
                  )
                }
                className="min-w-auto size-8 p-0"
              />
            </div>

            {/* Metadata */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <span>Created:</span>
                <span>{tag.created}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <span>Last used:</span>
                <span>{tag.lastUsed}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <span>ID:</span>
                <span>{tag.displayId}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-auto">
              <Button
                size="sm"
                radius="sm"
                variant="ghost"
                color="default"
                className="border-small w-full"
                startContent={<FiSmartphone />}
              >
                Write to NFC
              </Button>
              <Button
                size="sm"
                radius="sm"
                variant="ghost"
                color="default"
                className="border-small min-w-[100px]"
              >
                Deactivate
              </Button>
              <Button
                size="sm"
                radius="sm"
                variant="ghost"
                color="default"
                className="border-small"
                isIconOnly
                onPress={() => handleDelete(tag.id)}
              >
                <LuTrash2 className="text-sm text-red-500" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Overall Performance */}
      <div className="border border-primary/15 bg-background p-4 rounded-xl space-y-4">
        <h4 className="flex items-center gap-2 text-sm">
          <FiSmartphone size={16} />
          Overall Performance
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsBox
            label="Total Tags"
            value={tags.length}
            bg="bg-sky-50"
            text="text-sky-600"
          />
          <StatsBox
            label="Total Interactions"
            value={327}
            bg="bg-emerald-50"
            text="text-emerald-600"
          />
          <StatsBox
            label="Total Reviews"
            value={212}
            bg="bg-orange-50"
            text="text-orange-600"
          />
          <StatsBox
            label="Avg. Conversion"
            value="65%"
            bg="bg-purple-50"
            text="text-purple-600"
          />
        </div>
      </div>

      <CreateTagModal
        isOpen={isOpen}
        onClose={onClose}
        onCreate={handleCreateTag}
      />
    </div>
  );
};

const StatsBox = ({
  label,
  value,
  bg,
  text,
}: {
  label: string;
  value: string | number;
  bg: string;
  text: string;
}) => (
  <div
    className={`${bg} rounded-xl p-4 flex flex-col items-center justify-center gap-0.5`}
  >
    <div className={`text-xl font-bold ${text}`}>{value}</div>
    <div className="text-xs text-gray-500">{label}</div>
  </div>
);

export default ManageTags;
