import { LitElement, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

export type TimelineItemStatus =
  | "default"
  | "success"
  | "warning"
  | "error"
  | "current";

export type TimelineDateFormat = "short" | "medium" | "long" | "full";

const DATE_FORMAT_OPTIONS: Record<
  TimelineDateFormat,
  Intl.DateTimeFormatOptions
> = {
  short: { month: "numeric", day: "numeric", year: "2-digit" },
  medium: { month: "short", day: "numeric", year: "numeric" },
  long: { month: "long", day: "numeric", year: "numeric" },
  full: {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  },
};

export function formatTimelineDate(
  date: Date,
  format: TimelineDateFormat = "medium",
): string {
  return new Intl.DateTimeFormat("en-US", DATE_FORMAT_OPTIONS[format]).format(
    date,
  );
}

/** Data shape consumed by bb-timeline and bb-timeline-item */
export type TimelineItem = {
  title: string;
  status?: TimelineItemStatus;
  date?: Date;
  dateFormat?: TimelineDateFormat;
  body?: string;
};

@customElement("bb-timeline-item")
export class BbTimelineItem extends LitElement {
  @property({ type: String })
  title = "";

  @property({ attribute: false })
  date?: TimelineItem["date"];

  @property({ type: String })
  dateFormat: TimelineDateFormat = "medium";

  @property({ type: String })
  body = "";

  @property({ type: String, reflect: true })
  status: TimelineItemStatus = "default";

  private get renderDate(): string {
    if (!this.date) {
      return "";
    }

    return formatTimelineDate(this.date, this.dateFormat);
  }

  render() {
    return html`
      <span class="marker"> ${this.status === "current" ? "◉" : "●"} </span>

      <h4>${this.title}</h4>

      ${this.renderDate ? html`<time>${this.renderDate}</time>` : nothing}
      ${this.body ? html`<p>${this.body}</p>` : nothing}
    `;
  }
}
