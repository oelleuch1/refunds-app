import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { ArrowLeft, CircleAlert, Mail } from 'lucide'

import { AppRouter } from '@app/app.router'
import { LOGIN_PATH } from '@features/auth/presentation/auth.routes'
import { tailwindStyles } from '@styles/tailwind-styles'

import '@shared/presentation/components/app-icon'

@customElement('auth-forgot-password-page')
export class AuthForgotPasswordPage extends LitElement {
  static styles = [tailwindStyles]

  @state()
  errorMessage = ''

  @state()
  private email = ''

  render() {
    return html`
      <section class="w-full max-w-[420px] mx-auto text-[#eef1ff]">
        <div class="grid gap-3 mb-7">
          <p class="text-[#7b89ac] text-[0.9rem] leading-[1.4]">Password recovery</p>
          <h2 class="text-[clamp(2.1rem,2.8vw,2.55rem)] leading-[1.08] font-bold tracking-[-0.04em] text-[#f7f8ff]">Reset your access</h2>
          <p class="text-[#8593b7] leading-[1.5] text-base">Enter your work email and we’ll route the reset request through the returns operations flow.</p>
        </div>

        <form @submit=${this.handleSubmit} class="grid gap-4">
          ${this.errorMessage ? html`
            <div class="flex items-center gap-[10px] p-[12px_14px] rounded-xl bg-[rgba(255,98,98,0.10)] border border-[rgba(255,98,98,0.22)] text-[#ffd0d0] text-[0.9rem]">
              <app-icon .icon=${CircleAlert} .size=${16}></app-icon>
              <span>${this.errorMessage}</span>
            </div>
          ` : null}
          <label class="grid gap-2 text-[0.88rem] font-semibold text-[#edf1ff]">
            Email address
            <span class="flex items-center gap-[10px] min-h-[48px] px-[14px] border border-white/10 rounded-xl bg-white/5 text-[#8e9cbe] focus-within:border-brand/80 focus-within:ring-4 focus-within:ring-brand/10 transition-all">
              <app-icon .icon=${Mail} .size=${16}></app-icon>
              <input
                class="flex-1 min-w-0 border-0 bg-transparent text-[#f4f6ff] focus:outline-none disabled:opacity-60"
                type="email"
                .value=${this.email}
                @input=${this.handleEmailInput}
                required
              />
            </span>
          </label>

          <div class="p-[14px_16px] border border-white/10 rounded-xl bg-white/5 text-[#8593b7] text-[0.92rem] leading-[1.55]">
            Password reset use cases are not implemented yet. This page reserves the
            presentation boundary now so the flow can be added without reworking the shell.
          </div>

          <button class="min-h-[52px] px-[18px] border border-[#f1b6ff]/15 rounded-[14px] bg-[linear-gradient(135deg,#8e5cff_0%,#d777f0_100%)] text-white font-extrabold tracking-[-0.01em] cursor-pointer shadow-[0_20px_44px_rgba(156,92,255,0.34)] transition-all hover:translate-y-[-1px] hover:brightness-110 hover:shadow-[0_24px_52px_rgba(156,92,255,0.42)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:brightness-100" type="submit">Send reset link</button>
          <button class="inline-flex items-center gap-2 p-0 border-0 bg-transparent text-[#f5ecff] font-extrabold cursor-pointer hover:text-[#d6abff] transition-colors justify-self-start" type="button" @click=${this.openLogin}>
            <app-icon .icon=${ArrowLeft} .size=${16}></app-icon>
            Back to sign in
          </button>
        </form>
      </section>
    `
  }

  private handleSubmit(event: SubmitEvent): void {
    event.preventDefault()
    this.errorMessage = 'This flow is not implemented yet.'
  }

  private openLogin(): void {
    void AppRouter.navigate(LOGIN_PATH)
  }

  private handleEmailInput(event: Event): void {
    this.email = (event.target as HTMLInputElement).value
  }
}
