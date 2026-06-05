import { LitElement, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

import { formatAsDate } from "@features/samples/utils/date";

export type TimelineItem = {
  title: string;
  date?: string | Date;
  body?: string;
};

@customElement("bb-timeline")
export class BbTimeline extends LitElement {
  @property({ type: String })
  heading = "";

  @property({ attribute: false })
  items: TimelineItem[] = [];

  private renderTimelineItem(item: TimelineItem) {
    return html`
      <li>
        <h4>${item.title}</h4>

        ${item.date ? html` <time>${formatAsDate(item.date)}</time> ` : nothing}
        ${item.body ? html`<p>${item.body}</p>` : nothing}
      </li>
    `;
  }

  render() {
    return html`
      ${this.heading ? html`<h3>${this.heading}</h3>` : nothing}

      <ol>
        ${this.items.map((item) => this.renderTimelineItem(item))}
      </ol>

      <slot></slot>
    `;
  }
}
