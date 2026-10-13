import {httpSendService} from "./http-send-service";
import {mockSendService} from "./mocks/mock-send-service";
import type {SendService} from "@/types/send-types";

/** No backend yet: without `VITE_API_URL`, Send Securely data comes from the local mock. */
export const sendService: SendService = import.meta.env.VITE_API_URL ? httpSendService : mockSendService;
