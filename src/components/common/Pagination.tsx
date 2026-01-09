import { Pagination as HeroPagination } from "@heroui/react";

const Pagination = ({
  identifier,
  items,
  totalItems,
  currentPage,
  totalPages,
  handlePageChange,
}: {
  identifier: string;
  items: any;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
}) => {
  return (
    <div className="flex items-center justify-between gap-2">
      <p className="text-xs text-gray-600">
        Showing {items.length * (currentPage - 1) + 1} -{" "}
        {items.length * currentPage} of {totalItems} {identifier}
      </p>
      <HeroPagination
        total={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        size="sm"
        radius="sm"
        showControls
        classNames={{
          base: "pagination flex justify-end py-3",
          wrapper: "gap-1.5",
        }}
      />
    </div>
  );
};

export default Pagination;
