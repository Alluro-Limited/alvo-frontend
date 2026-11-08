import type {NodesService} from "@/types/nodes-types";
import {httpNodesService} from "./http-nodes-service";

/** Nodes Service service against the real API. */
export const nodesService: NodesService = httpNodesService;
