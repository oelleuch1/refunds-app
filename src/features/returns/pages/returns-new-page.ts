import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ChevronRight, Loader2 } from "lucide";

import { tailwindStyles } from "@styles/tailwind-styles";

import "@shared/presentation/components/app-stepper";
import "@shared/presentation/components/app-icon";
import "../components/wizard-footer";
import "../components/steps/select-item/select-item-step";

import { returnsNewStore } from "../stores/returns-new.store";

const STEPS = [
  { title: "Select item", info: "Choose order item" },
  { title: "Reason", info: "Why returning" },
  { title: "Explanation", info: "Customer details" },
  { title: "Evidence", info: "Photos & files" },
  { title: "Refund calc", info: "Review amount" },
  { title: "Submit", info: "Confirm & send" },
];

@customElement("returns-new-page")
export class ReturnsNewPage extends LitElement {
  static styles = [tailwindStyles];

  @property({ type: String })
  orderId!: string;

  private store = returnsNewStore;

  protected async firstUpdated(): Promise<void> {
    await this.store.getOrderItems(this.orderId);
    this.requestUpdate();
  }

  private canContinue(): boolean {
    switch (this.store.state.currentStep) {
      case 0:
        return Object.keys(this.store.state.selections).length > 0;
      default:
        return false; // steps 2–6 not implemented yet
    }
  }

  private onStepChange(step: number): void {
    this.store.goToStep(step);
    this.requestUpdate();
  }

  private onBack(): void {
    this.store.goToStep(this.store.state.currentStep - 1);
    this.requestUpdate();
  }

  private onContinue(): void {
    if (this.store.state.currentStep === 5) {
      // @TODO submit and create a return request
      return;
    }
    this.store.goToStep(this.store.state.currentStep + 1);
    this.requestUpdate();
  }

  private onToggleItem(id: string): void {
    this.store.toggleItem(id);
    this.requestUpdate();
  }

  private onQuantityChange(id: string, quantity: number): void {
    this.store.setQuantity(id, quantity);
    this.requestUpdate();
  }

  private renderStepBody() {
    switch (this.store.state.currentStep) {
      case 0:
        return html`
          <select-item-step
            .items=${this.store.state.items}
            .selections=${this.store.state.selections}
            @toggle=${(e: CustomEvent) => this.onToggleItem(e.detail.id)}
            @quantity-change=${(e: CustomEvent) =>
              this.onQuantityChange(e.detail.id, e.detail.quantity)}
          ></select-item-step>
        `;
      default:
        return html`
          <div class="space-y-2">
            <h2 class="text-xl font-semibold">
              ${STEPS[this.store.state.currentStep].title}
            </h2>
            <p class="text-sm text-muted-foreground">
              This step is coming soon.
            </p>
          </div>
        `;
    }
  }

  render() {
    if (this.store.state.isLoading) {
      return html`
        <div class="flex items-center justify-center h-64">
          <app-icon
            .icon=${Loader2}
            .size=${24}
            class="animate-spin"
          ></app-icon>
        </div>
      `;
    }

    if (this.store.state.error) {
      return html`
        <div
          class="rounded-xl border border-destructive/40 bg-card p-6 text-sm text-destructive"
        >
          ${this.store.state.error}
        </div>
      `;
    }

    return html`
      <div>
        <!-- Breadcrumb + header -->
        <div class="mb-6 space-y-3">
          <div class="flex items-center gap-1.5 text-sm text-muted-foreground">
            <a
              href=${`/orders/${this.orderId}`}
              class="text-primary hover:underline"
              >${this.orderId}</a
            >
            <app-icon
              .icon=${ChevronRight}
              .size=${14}
              class="opacity-50"
            ></app-icon>
            <span class="text-foreground">Create return</span>
          </div>
          <div>
            <h1 class="text-3xl font-semibold tracking-tight">
              Create return request
            </h1>
            <p class="mt-1 text-sm text-muted-foreground">
              Multi-step workflow — Manager view
            </p>
          </div>
        </div>

        <!-- Stepper rail -->
        <div
          class="rounded-xl border border-border/60 bg-card p-6 shadow-card mb-6"
        >
          <app-stepper
            .steps=${STEPS}
            .currentStep=${this.store.state.currentStep}
            @step-change=${(e: CustomEvent) => this.onStepChange(e.detail.step)}
          ></app-stepper>
        </div>

        <!-- Active step body + navigation -->
        <div
          class="rounded-xl border border-border/60 bg-card p-6 md:p-8 shadow-card"
        >
          ${this.renderStepBody()}

          <wizard-footer
            .isFirst=${this.store.state.currentStep === 0}
            .isLast=${this.store.state.currentStep === STEPS.length - 1}
            .canContinue=${this.canContinue()}
            .loading=${this.store.state.isSubmitting}
            @back=${this.onBack}
            @continue=${this.onContinue}
          ></wizard-footer>
        </div>
      </div>
    `;
  }
}
