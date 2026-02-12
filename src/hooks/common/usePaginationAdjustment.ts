import { useEffect } from "react";

interface UsePaginationAdjustmentProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export const usePaginationAdjustment = ({
  totalPages,
  currentPage,
  onPageChange,
  isLoading = false,
}: UsePaginationAdjustmentProps) => {
  useEffect(() => {
    if (isLoading) return;

    if (totalPages > 0 && currentPage > totalPages) {
      onPageChange(totalPages);
    } else if (totalPages === 0 && currentPage !== 1) {
      onPageChange(1);
    }
  }, [totalPages, currentPage, onPageChange, isLoading]);
};
