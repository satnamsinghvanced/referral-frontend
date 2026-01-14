import { Pagination as HeroPagination } from "@heroui/react";
import { EVEN_PAGINATION_LIMIT } from "../../consts/consts";

const Pagination = ({
  identifier,
  limit = EVEN_PAGINATION_LIMIT,
  totalItems,
  currentPage,
  totalPages,
  handlePageChange,
}: {
  identifier: string;
  limit?: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
}) => {
  return (
    <div className="flex items-center justify-between gap-2">
      <p className="text-xs text-gray-600">
        Showing {limit * (currentPage - 1) + 1} -{" "}
        {limit * currentPage > totalItems ? totalItems : limit * currentPage} of{" "}
        {totalItems} {identifier}
      </p>
      <HeroPagination
        total={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        size="sm"
        radius="sm"
        showControls
        classNames={{
          base: "pagination flex justify-end p-0 m-0",
          wrapper: "gap-1.5",
        }}
      />
    </div>
  );
};

export default Pagination;
