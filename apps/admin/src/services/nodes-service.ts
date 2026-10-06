import type {NodesService} from "@/types/nodes-types";
import {httpNodesService} from "./http-nodes-service";
import {mockNodesService} from "./mocks/mock-nodes-service";

/** Same mock/HTTP split as the other services: no `VITE_API_URL` means the local mock serves nodes. */
export const nodesService: NodesService = import.meta.env.VITE_API_URL ? httpNodesService : mockNodesService;
