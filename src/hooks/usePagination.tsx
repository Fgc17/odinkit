import { usePaginationUtils } from "./usePaginationUtils";
import { useSteps } from "./useSteps";

export function usePagination({
  pageCount: pageCount,
  startPage: startPage = 0,
}: {
  pageCount: number;
  startPage?: number;
  options?: any;
}) {
  const {
    currentStep: currentPageIndex,
    walk,
    dryWalk,
  } = useSteps({
    stepCount: pageCount,
    currentStep: startPage,
  });

  const paginationUtils = usePaginationUtils({
    pageCount,
    currentPageIndex,
  });

  return {
    currentPageIndex,
    pageCount,
    walk,
    dryWalk,
    ...paginationUtils,
  };
}
