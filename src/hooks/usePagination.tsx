// client
"use client";

import { useEffect } from "react";
import { usePaginationUtils } from "./usePaginationUtils";
import { useSteps } from "./useSteps";

export function usePagination({
  startPageCount,
  startPage: startPage = 0,
  onWalk,
}: {
  startPageCount: number;
  startPage?: number;
  options?: any;
  onWalk?: (page: number) => void;
}) {
  const {
    currentStep: currentPageIndex,
    stepCount: pageCount,
    walk,
    dryWalk,
    setStepCount,
    setCurrentStep,
  } = useSteps({
    stepCount: startPageCount,
    currentStep: startPage,
  });

  const paginationUtils = usePaginationUtils({
    pageCount,
    currentPageIndex,
  });

  useEffect(() => {
    if (onWalk) {
      onWalk(currentPageIndex);
    }
  }, [currentPageIndex]);

  return {
    currentPageIndex,
    pageCount,
    walk,
    dryWalk,
    setPageCount: setStepCount,
    setCurrentPage: setCurrentStep,
    ...paginationUtils,
  };
}
