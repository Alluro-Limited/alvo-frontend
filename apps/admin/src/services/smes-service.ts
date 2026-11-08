import type {SmesService} from "@/types/smes-types";
import {httpSmesService} from "./http-smes-service";

/** Live where the API covers it — list/detail reads throw until list endpoints land. */
export const smesService: SmesService = httpSmesService;
