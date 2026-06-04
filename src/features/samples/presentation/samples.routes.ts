import type { PathRouteConfig } from "@lit-labs/router";
import { html } from "lit";

import "@features/samples/presentation/pages/samples-page";

export const SAMPLES_PATH = "/samples";

export const samplesRoutes: readonly PathRouteConfig[] = [
  {
    path: SAMPLES_PATH,
    render: () => html`<app-samples-page></app-samples-page>`,
  },
];
