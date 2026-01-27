import { Button, Checkbox } from "@heroui/react";
import { LuDownload, LuTrash2 } from "react-icons/lu";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { Media } from "../../types/media";

const MediaItem = ({
  media,
  onDelete,
  onView,
  onDownload,
  onSelect,
  selectedMedia,
}: {
  media: Media;
  onDelete: (id: string) => void;
  onView: (media: Media) => void;
  onDownload: (path: string, name: string) => void;
  onSelect: (isSelected: boolean, mediaId: string) => void;
  selectedMedia: string[];
}) => {
  const isVideo = media.type.startsWith("video/");

  return (
    <div
      key={media._id}
      className="relative border border-foreground/10 rounded-lg overflow-hidden group bg-content1"
    >
      <div className="w-full h-32 flex items-center justify-center bg-gray-100 dark:bg-default-100/50 overflow-hidden">
        {isVideo ? (
          <video
            src={media.path}
            controls={false}
            muted
            className="w-full h-full object-cover"
            title={media.name}
          />
        ) : (
          <img
            src={media.path}
            alt={media.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="p-2">
        <p className="text-xs font-medium truncate mb-0.5 text-foreground">
          {media.name}
        </p>
        <div className="space-x-1">
          {media?.tags?.map((tag: string) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full text-[10px] font-medium px-2 py-0.5 border border-foreground/10 text-foreground/60"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="absolute top-2 left-2 z-10">
        <Checkbox
          size="md"
          radius="sm"
          isSelected={selectedMedia?.includes(media._id)}
          onValueChange={(isSelected) => onSelect(isSelected, media._id)}
          classNames={{ icon: "m-0", wrapper: "m-0 hover:bg-transparent" }}
          className="p-0 m-0"
        />
      </div>
      <div className="absolute inset-0 md:bg-black/30 flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-opacity">
        <div className="flex space-x-1.5">
          <Button
            size="sm"
            radius="sm"
            variant="solid"
            color="primary"
            isIconOnly
            onPress={() => onView(media)}
            className="p-0 size-7 min-w-0"
            title="View Media"
          >
            <MdOutlineRemoveRedEye fontSize={14} />
          </Button>

          <Button
            size="sm"
            radius="sm"
            variant="solid"
            color="primary"
            isIconOnly
            onPress={() => onDownload(media.path, media.name)}
            className="p-0 size-7 min-w-0"
            title="Download Media"
          >
            <LuDownload fontSize={14} />
          </Button>

          <Button
            size="sm"
            radius="sm"
            variant="solid"
            color="danger"
            isIconOnly
            onPress={() => onDelete(media._id)}
            className="p-0 size-7 min-w-0"
            title="Delete Media"
          >
            <LuTrash2 fontSize={14} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MediaItem;
