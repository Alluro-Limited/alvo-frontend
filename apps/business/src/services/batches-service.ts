import type {BatchesService} from "@/types/batch-types";
import {httpBatchesService} from "./http-batches-service";
import {mockBatchesService} from "./mocks/mock-batches-service";

/**
 * Picks the batches service: the mock while `VITE_API_URL` is unset, HTTP otherwise.
 * The mock serves the Figma demo account data and an empty list for anyone else.
 */
export const batchesService: BatchesService = import.meta.env.VITE_API_URL ? httpBatchesService : mockBatchesService;
