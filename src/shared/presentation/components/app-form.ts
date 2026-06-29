import { tailwindStyles } from "@styles/tailwind-styles";
import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

export type FormFieldLine = FormField[];

export type FormFieldType =
  | "text"
  | "select"
  | "textarea"
  | "checkbox"
  | "radio";

export type FormField = {
  name: string;
  label: string;
  value?: unknown;
  type: FormFieldType;
  attrs?: Record<string, unknown>;
  rules: FormFieldRule[];
};

export type FormFieldRule = {
  type: "required" | "email" | "minLength" | "maxLength" | "pattern";
  value?: unknown;
  message: string;
};

@customElement("app-form")
export class AppForm extends LitElement {
  static styles = [tailwindStyles];

  @property({ type: Array })
  public fields: FormFieldLine[] = [];

  private renderInput(field: FormField) {
    switch (field.type) {
      case "text":
        return html`<input
          type="text"
          id=${field.name}
          name=${field.name}
          value=${field.value ?? ""}
          required=${field.rules.some((r) => r.type === "required")}
          email=${field.rules.some((r) => r.type === "email")}
          minlength=${field.rules.find((r) => r.type === "minLength")?.value ??
          ""}
          maxlength=${field.rules.find((r) => r.type === "maxLength")?.value ??
          ""}
          pattern=${field.rules.find((r) => r.type === "pattern")?.value ?? ""}
          class="w-full bg-surface-card border border-white/5 rounded-xl py-3.5 px-4 text-text-primary placeholder:text-text-dim/50 focus:outline-none focus:border-brand-light/30 focus:bg-surface-card/60 transition-all"
        />`;
      case "select":
        return html`<select
          id=${field.name}
          name=${field.name}
          ...${field.attrs}
          class="w-full bg-surface-card border border-white/5 rounded-xl py-3.5 px-4 text-text-primary placeholder:text-text-dim/50 focus:outline-none focus:border-brand-light/30 focus:bg-surface-card/60 transition-all"
        >
          ...${(field.attrs?.options as any[] | undefined)?.map(
            (option) =>
              html`<option value=${option.value}>${option.label}</option>`,
          )}
        </select>`;
      case "textarea":
        return html`<textarea
          id=${field.name}
          name=${field.name}
          ...${field.attrs}
          class="w-full bg-surface-card border border-white/5 rounded-xl py-3.5 px-4 text-text-primary placeholder:text-text-dim/50 focus:outline-none focus:border-brand-light/30 focus:bg-surface-card/60 transition-all"
        ></textarea>`;
    }
  }

  protected render() {
    return html`
      <form class="flex flex-col gap-6">
        ${this.fields.map(
          (line) => html`
            <div class="flex flex-col gap-4 md:flex-row">
              ${line.map(
                (field) => html`
                  <div class="flex flex-col gap-1 flex-1">
                    <label
                      for=${field.name}
                      class="text-sm font-medium text-text-primary"
                      >${field.label}
                    </label>
                    ${this.renderInput(field)}
                  </div>
                `,
              )}
            </div>
          `,
        )}
      </form>
    `;
  }
}
