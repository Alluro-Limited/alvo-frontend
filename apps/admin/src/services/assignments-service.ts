import type {AssignmentsService} from "@/types/assignment-types";
import {httpAssignmentsService} from "./http-assignments-service";
import {mockAssignmentsService} from "./mocks/mock-assignments-service";

/** Same mock/HTTP split as the other services: no `VITE_API_URL` means the local mock serves assignments. */
export const assignmentsService: AssignmentsService = import.meta.env.VITE_API_URL ? httpAssignmentsService : mockAssignmentsService;
