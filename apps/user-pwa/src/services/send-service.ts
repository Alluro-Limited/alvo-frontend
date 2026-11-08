import {httpSendService} from "./http-send-service";
import type {SendService} from "@/types/send-types";

/** Apps/User Pwa/Src/Services/Send Service service against the real API. */
export const sendService: SendService = httpSendService;
