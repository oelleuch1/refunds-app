import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import {
  Check,
  Package,
  Headphones,
  Smartphone,
  Music,
  Minus,
  Plus,
  type IconNode,
} from "lucide";

import { tailwindStyles } from "@styles/tailwind-styles";
import "@shared/presentation/components/app-icon";
import type { ReturnItem } from "../../../stores/returns-new.store";

const ICON_BY_CATEGORY: Record<string, IconNode> = {
  audio: Headphones,
  headphones: Headphones,
  phone: Smartphone,
  accessory: Smartphone,
  digital: Music,
  music: Music,
};

@customElement("return-item-card")
export class ReturnItemCard extends LitElement {
  static styles = [tailwindStyles];

  @property({ attribute: false })
  item!: ReturnItem;

  @property({ type: Boolean })
  selected = false;

  @property({ type: Number })
  quantity = 1;

  private get icon(): IconNode {
    return ICON_BY_CATEGORY[this.item.category?.toLowerCase()] ?? Package;
  }

  private emitToggle(): void {
    this.dispatchEvent(
      new CustomEvent("toggle", {
        detail: { id: this.item.id },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private changeQuantity(delta: number): void {
    this.dispatchEvent(
      new CustomEvent("quantity-change", {
        detail: { id: this.item.id, quantity: this.quantity + delta },
        bubbles: true,
        composed: true,
      }),
    );
  }

  protected render() {
    const state = this.selected
      ? "border-primary bg-primary/10 shadow-glow"
      : "border-border bg-muted/20 hover:border-primary/40";

    return html`
      <div
        role="button"
        tabindex="0"
        aria-pressed=${this.selected}
        class="flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all cursor-pointer ${state}"
        @click=${this.emitToggle}
      >
        <div
          class="flex h-12 w-12 items-center justify-center rounded-lg bg-muted"
        >
          <app-icon .icon=${this.icon} .size=${20}></app-icon>
        </div>
        <div class="flex-1">
          <div class="font-medium">${this.item.name}</div>
          <div class="text-xs text-muted-foreground">
            ${this.item.sku} · €${this.item.unitPrice.toFixed(2)} · Qty
            ${this.item.quantity}
          </div>
        </div>

        ${this.selected ? this.renderQuantityStepper() : ""}
        ${this.selected
          ? html`<app-icon
              .icon=${Check}
              .size=${20}
              class="text-primary"
            ></app-icon>`
          : ""}
      </div>
    `;
  }

  private renderQuantityStepper() {
    const btn =
      "flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background text-foreground transition-all hover:bg-accent disabled:pointer-events-none disabled:opacity-40";

    return html`
      <div
        class="flex items-center gap-2"
        @click=${(e: Event) => e.stopPropagation()}
      >
        <button
          class=${btn}
          ?disabled=${this.quantity <= 1}
          @click=${() => this.changeQuantity(-1)}
          aria-label="Decrease quantity"
        >
          <app-icon .icon=${Minus} .size=${14}></app-icon>
        </button>
        <span class="w-6 text-center text-sm font-semibold tabular-nums"
          >${this.quantity}</span
        >
        <button
          class=${btn}
          ?disabled=${this.quantity >= this.item.quantity}
          @click=${() => this.changeQuantity(1)}
          aria-label="Increase quantity"
        >
          <app-icon .icon=${Plus} .size=${14}></app-icon>
        </button>
      </div>
    `;
  }
}
