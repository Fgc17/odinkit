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

  const nearDistance = 1;

  const isCurrent = (index: number) => index === currentPageIndex;

  const isFirstPage = (index: number) => index === 0;

  const isLastPage = (index: number) => index === pageCount - 1;

  const isNearCurrent = (index: number) =>
    index >= currentPageIndex - nearDistance &&
    index <= currentPageIndex + nearDistance;

  const shouldShow = (index: number) =>
    isCurrent(index) ||
    isFirstPage(index) ||
    isLastPage(index) ||
    isNearCurrent(index);

  const shouldShowGapBefore = (index: number) =>
    index === currentPageIndex - nearDistance &&
    currentPageIndex > nearDistance;

  const shouldShowGapAfter = (index: number) =>
    index === pageCount - (nearDistance + 1) &&
    currentPageIndex < pageCount - (nearDistance + 1) &&
    currentPageIndex < pageCount - 1;

  return {
    currentPageIndex,
    pageCount,
    walk,
    dryWalk,
    isCurrent,
    isFirstPage,
    isLastPage,
    isNearCurrent,
    shouldShow,
    shouldShowGapBefore,
    shouldShowGapAfter,
  };
}
