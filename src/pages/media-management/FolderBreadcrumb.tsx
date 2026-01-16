import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import { FiHome } from "react-icons/fi";
import { LuFolder } from "react-icons/lu";

const FolderBreadcrumb = ({ path, onNavigate }: any) => {
  return (
    <Breadcrumbs
      size="sm"
      variant="light"
      classNames={{
        list: "gap-1",
      }}
      itemClasses={{
        item: "text-sm text-gray-700 dark:text-foreground/70 hover:text-primary dark:hover:text-primary transition-colors cursor-pointer data-[current=true]:text-gray-900 dark:data-[current=true]:text-foreground data-[current=true]:font-medium data-[current=true]:cursor-default",
        separator: "text-gray-600 dark:text-foreground/40 mx-0.5",
      }}
    >
      <BreadcrumbItem
        startContent={<FiHome className="size-4 text-primary mr-0.5" />}
        onClick={() => onNavigate(null)}
        isCurrent={path.length === 0}
      >
        Root
      </BreadcrumbItem>
      {path.map((item: any, index: number) => (
        <BreadcrumbItem
          key={item.id}
          startContent={<LuFolder className="size-4 text-primary mr-0.5" />}
          onClick={() => onNavigate(item.id)}
          isCurrent={index === path.length - 1}
        >
          {item.name}
        </BreadcrumbItem>
      ))}
    </Breadcrumbs>
  );
};

export default FolderBreadcrumb;
