import type {SmesService} from "@/types/smes-types";
import {httpSmesService} from "./http-smes-service";
import {mockSmesService} from "./mocks/mock-smes-service";

/** Same mock/HTTP split as the other services: no `VITE_API_URL` means the local mock serves SMEs. */
export const smesService: SmesService = import.meta.env.VITE_API_URL ? httpSmesService : mockSmesService;
