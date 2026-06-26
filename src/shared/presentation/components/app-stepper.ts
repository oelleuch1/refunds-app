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
  @property()
  steps: AppStepperItem[] = [];

  @property()
  currentStep: number = 0;

  isStepDone(stepIndex: number): boolean {
    return stepIndex < this.currentStep;
  }

  handleStepClick(stepIndex: number): void {
    if (this.isStepDone(stepIndex)) {
      this.currentStep = stepIndex;
    }
  }

  protected render() {
    return html` <div>
      ${this.steps.map(
        (step, index) => html`
          <div @click=${this.handleStepClick(index)}>
            <div>${step.title} - ${step.info}</div>

            ${this.isStepDone(index)
              ? html`<app-icon .icon=${Check} />`
              : html`<div>${index + 1}</div>`}
          </div>
        `,
      )}
    </div>`;
  }
}
