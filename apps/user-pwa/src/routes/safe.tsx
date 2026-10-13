import {createFileRoute} from "@tanstack/react-router";
import {SafePage} from "@/pages/safe";

export const Route = createFileRoute("/safe")({component: SafePage});
