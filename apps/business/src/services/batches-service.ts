import type {BatchesService} from "@/types/batch-types";
import {httpBatchesService} from "./http-batches-service";

/** Batches against the real API. */
export const batchesService: BatchesService = httpBatchesService;
