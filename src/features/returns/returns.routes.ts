import type { RouteConfig } from "@lit-labs/router";
import { html } from "lit";

import "@features/returns/pages/returns-new-page";

export const RETURNS_PATH = "/returns";

export const returnsRoutes: RouteConfig[] = [
  {
    // path: `${RETURNS_PATH}/new/:id/:status`,
    // AppRouter.navigate(/returns/new/123/active) => params = { id: 123, status: active }
    // params: { id, status }

    path: `${RETURNS_PATH}/new/:id`,
    render: (params) =>
      html`<returns-new-page .orderId=${params.id}></returns-new-page>`,
  },
];
