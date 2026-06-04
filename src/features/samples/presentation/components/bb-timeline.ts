import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import "./bb-timeline-item";
import type { TimelineItem } from "./bb-timeline-item";

@customElement("bb-timeline")
export class BbTimeline extends LitElement {
  @property({ type: String })
  heading = "";

  @property({ attribute: false })
  items: TimelineItem[] = [];

  // get rid of item component, move it here and create a slot
  render() {
    return html`
      <section>
        ${this.heading ? html`<h3>${this.heading}</h3>` : null}

        <ol>
          ${this.items.map(
            (item) => html`
              <li>
                <bb-timeline-item
                  .title=${item.title}
                  .date=${item.date}
                  .dateFormat=${item.dateFormat ?? "medium"}
                  .status=${item.status ?? "default"}
                  .body=${item.body ?? ""}
                >
                </bb-timeline-item>
              </li>
            `,
          )}
        </ol>
      </section>
    `;
  }
}
