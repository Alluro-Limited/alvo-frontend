import type {UsersService} from "@/types/users-types";
import {httpUsersService} from "./http-users-service";

/** Users Service service against the real API. */
export const usersService: UsersService = httpUsersService;
