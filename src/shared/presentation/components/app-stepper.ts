import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Check } from "lucide";

import "@shared/presentation/components/app-icon";

export interface AppStepperItem {
  title: string;
  info: string;
}

@customElement("app-stepper")
export class AppStepper extends LitElement {
  @property({ type: Array })
  steps: AppStepperItem[] = [];

  @property({ type: Number })
  currentStep: number = 0;

  isStepDone(stepIndex: number): boolean {
    return stepIndex < this.currentStep;
  }

  isStepActive(stepIndex: number): boolean {
    return stepIndex === this.currentStep;
  }

  handleStepClick(stepIndex: number): void {
    if (this.isStepDone(stepIndex)) {
      this.currentStep = stepIndex;
      this.dispatchEvent(
        new CustomEvent("step-change", {
          detail: { step: stepIndex },
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  private circleClasses(index: number): string {
    const base =
      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-all";

    // Active step: colored circle with its index, glowing + ringed (the emphasized one).
    if (this.isStepActive(index)) {
      return `${base} bg-brand-gradient text-white shadow-brand ring-4 ring-brand/30`;
    }

    // Done step: flat colored circle with a Lucide Check, clickable to go back.
    if (this.isStepDone(index)) {
      return `${base} bg-brand-gradient text-white cursor-pointer`;
    }

    // Future step: muted circle with its index, not colored.
    return `${base} bg-surface-card text-text-dim border border-white/10`;
  }

  protected render() {
    return html`
      <div class="flex items-center justify-between gap-2 overflow-x-auto">
        ${this.steps.map(
          (step, index) => html`
            <div class="flex flex-1 items-center gap-3 min-w-fit">
              <button
                type="button"
                @click=${() => this.handleStepClick(index)}
                class=${this.circleClasses(index)}
              >
                ${this.isStepDone(index)
                  ? html`<app-icon .icon=${Check} .size=${18}></app-icon>`
                  : html`${index + 1}`}
              </button>

              <div class="hidden flex-col md:flex min-w-fit">
                <span
                  class="text-sm font-medium ${this.isStepActive(index) ||
                  this.isStepDone(index)
                    ? "text-text-primary"
                    : "text-text-dim"}"
                  >${step.title}</span
                >
                <span class="text-xs text-text-dim">${step.info}</span>
              </div>
            </div>
          `,
        )}
      </div>
    `;
  }
}

// 1. Create the returns model and add url /returns/new for the return form
// 2. Improve the stepper up and create the returns page
// 3. Steps by step creation and data validation
