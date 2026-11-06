import type {AssignmentsService} from "@/types/assignment-types";
import {httpAssignmentsService} from "./http-assignments-service";
import {mockAssignmentsService} from "./mocks/mock-assignments-service";

/** Review flags ride v1/admin/flags; dispatch-specific methods throw until endpoints land. */
export const assignmentsService: AssignmentsService = import.meta.env.VITE_API_URL ? httpAssignmentsService : mockAssignmentsService;
