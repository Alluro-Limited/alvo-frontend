import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {revenueService} from "@/services/revenue-service";
import type {ChartPeriod, RevenuePeriod} from "@/types/revenue-types";

/** KPI cards + Revenue Lost breakdown — refetches when the page-level period pill changes. */
export function useRevenueOverviewQuery(period: RevenuePeriod) {
  return useQuery({
    queryKey: ["revenue", "overview", period] as const,
    queryFn: () => revenueService.getRevenueOverview({period}),
    retry: false,
  });
}

/** Stacked columns for the Revenue Trend bar chart — its own period pills. */
export function useRevenueTrendQuery(period: ChartPeriod) {
  return useQuery({
    queryKey: ["revenue", "trend", period] as const,
    queryFn: () => revenueService.getRevenueTrend({period}),
    retry: false,
    placeholderData: keepPreviousData,
  });
}

/** The area line chart — revenue plus parcel volume. */
export function useRevenueFlowQuery(period: ChartPeriod) {
  return useQuery({
    queryKey: ["revenue", "flow", period] as const,
    queryFn: () => revenueService.getRevenueFlow({period}),
    retry: false,
    placeholderData: keepPreviousData,
  });
}

/** The Revenue by Service Type donut. */
export function useServiceMixQuery(period: ChartPeriod) {
  return useQuery({
    queryKey: ["revenue", "service-mix", period] as const,
    queryFn: () => revenueService.getServiceMix({period}),
    retry: false,
    placeholderData: keepPreviousData,
  });
}

/** The Revenue by Node tab — ranked rows, paginated. */
export function useNodeRevenueQuery(page: number) {
  return useQuery({
    queryKey: ["revenue", "nodes", page] as const,
    queryFn: () => revenueService.getNodeRevenue({page}),
    retry: false,
    placeholderData: keepPreviousData,
  });
}
