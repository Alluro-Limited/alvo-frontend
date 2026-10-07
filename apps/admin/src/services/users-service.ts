import type {UsersService} from "@/types/users-types";
import {httpUsersService} from "./http-users-service";
import {mockUsersService} from "./mocks/mock-users-service";

/** Same mock/HTTP split as the other services: no `VITE_API_URL` means the local mock serves users. */
export const usersService: UsersService = import.meta.env.VITE_API_URL ? httpUsersService : mockUsersService;
