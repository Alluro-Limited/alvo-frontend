import type {SmesService} from "@/types/smes-types";
import {httpSmesService} from "./http-smes-service";
import {mockSmesService} from "./mocks/mock-smes-service";

/** Live where the API covers it — list/detail reads throw until list endpoints land. */
export const smesService: SmesService = import.meta.env.VITE_API_URL ? httpSmesService : mockSmesService;
