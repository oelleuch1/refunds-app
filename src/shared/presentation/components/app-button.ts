import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { type IconNode } from "lucide";

import { tailwindStyles } from "@styles/tailwind-styles";
import "@shared/presentation/components/app-icon";

export type AppButtonVariant = "primary" | "outline" | "ghost";

@customElement("app-button")
export class AppButton extends LitElement {
  static styles = [tailwindStyles];

  @property({ type: String })
  variant: AppButtonVariant = "primary";

  @property({ type: String })
  type: "button" | "submit" = "button";

  @property({ type: Boolean })
  disabled = false;

  @property({ attribute: false })
  icon: IconNode | null = null;

  @property({ attribute: false })
  trailingIcon: IconNode | null = null;

  private variantClasses(): string {
    switch (this.variant) {
      case "outline":
        return "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground";
      case "ghost":
        return "hover:bg-accent hover:text-accent-foreground";
      case "primary":
      default:
        return "bg-gradient-violet text-white shadow-glow hover:opacity-90";
    }
  }

  protected render() {
    const base =
      "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 gap-2 active:scale-95";

    return html`
      <button
        type=${this.type}
        ?disabled=${this.disabled}
        class="${base} ${this.variantClasses()}"
      >
        ${this.icon
          ? html`<app-icon .icon=${this.icon} .size=${16}></app-icon>`
          : ""}
        <slot></slot>
        ${this.trailingIcon
          ? html`<app-icon .icon=${this.trailingIcon} .size=${16}></app-icon>`
          : ""}
      </button>
    `;
  }
}
