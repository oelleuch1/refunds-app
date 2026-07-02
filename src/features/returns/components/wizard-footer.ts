import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ChevronLeft, ChevronRight } from "lucide";

import { tailwindStyles } from "@styles/tailwind-styles";
import "@shared/presentation/components/app-button";

/**
 * Dumb wizard navigation footer: props in, intent events out.
 * Emits `back` and `continue` — the orchestrator decides what "continue" means
 * (advance vs. submit on the last step).
 */
@customElement("wizard-footer")
export class WizardFooter extends LitElement {
  static styles = [tailwindStyles];

  @property({ type: Boolean })
  isFirst = false;

  @property({ type: Boolean })
  isLast = false;

  @property({ type: Boolean })
  canContinue = false;

  @property({ type: Boolean })
  loading = false;

  private emit(name: "back" | "continue"): void {
    this.dispatchEvent(new CustomEvent(name, { bubbles: true, composed: true }));
  }

  protected render() {
    return html`
      <div
        class="mt-8 flex items-center justify-between border-t border-border/60 pt-5"
      >
        <app-button
          variant="outline"
          .icon=${ChevronLeft}
          ?disabled=${this.isFirst || this.loading}
          @click=${() => this.emit("back")}
        >
          Back
        </app-button>

        <app-button
          variant="primary"
          .trailingIcon=${this.isLast ? null : ChevronRight}
          ?disabled=${!this.canContinue || this.loading}
          @click=${() => this.emit("continue")}
        >
          ${this.isLast ? "Submit" : "Continue"}
        </app-button>
      </div>
    `;
  }
}
