import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { ArrowRight, CircleAlert, Lock, Mail } from 'lucide'

import { USE_CASES } from '@app/dependencies'
import { AppRouter } from '@app/app.router'

import { DASHBOARD_PATH } from '@features/dashboard/presentation/dashboard.routes'
import { FORGOT_PASSWORD_PATH, REGISTER_PATH } from '@features/auth/presentation/auth.routes'
import { tailwindStyles } from '@styles/tailwind-styles'

import '@shared/presentation/components/app-icon'

@customElement('auth-login-page')
export class AuthLoginPage extends LitElement {
  static styles = [tailwindStyles]

  @state()
  errorMessage = ''

  @state()
  private isSubmitting = false

  private readonly signInUseCase = USE_CASES.auth.signIn

  @state()
  private email = ''

  @state()
  private password = ''

  render() {
    return html`
      <section class="w-full max-w-[420px] mx-auto text-[#eef1ff]">
        <div class="grid gap-3 mb-7">
          <p class="text-[#7b89ac] text-[0.9rem] leading-[1.4]">Welcome back</p>
          <h2 class="text-[clamp(2.1rem,2.8vw,2.55rem)] leading-[1.08] font-bold tracking-[-0.04em] text-[#f7f8ff]">Sign in to your account</h2>
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
                name="email"
                autocomplete="email"
                .value=${this.email}
                ?disabled=${this.isSubmitting}
                @input=${this.handleEmailInput}
              />
            </span>
          </label>

          <label class="grid gap-2 text-[0.88rem] font-semibold text-[#edf1ff]">
            <span class="flex items-center justify-between gap-3">
              <span>Password</span>
              <button class="p-0 border-0 bg-transparent text-[#b88cff] font-semibold cursor-pointer hover:text-[#d4b0ff] text-[0.9rem] justify-self-end transition-colors" type="button" @click=${this.openForgotPassword}>
                Forgot password?
              </button>
            </span>
            <span class="flex items-center gap-[10px] min-h-[48px] px-[14px] border border-white/10 rounded-xl bg-white/5 text-[#8e9cbe] focus-within:border-brand/80 focus-within:ring-4 focus-within:ring-brand/10 transition-all">
              <app-icon .icon=${Lock} .size=${16}></app-icon>
              <input
                class="flex-1 min-w-0 border-0 bg-transparent text-[#f4f6ff] focus:outline-none disabled:opacity-60"
                type="password"
                name="password"
                autocomplete="current-password"
                .value=${this.password}
                ?disabled=${this.isSubmitting}
                @input=${this.handlePasswordInput}
              />
            </span>
          </label>

          <button class="flex items-center justify-center gap-[10px] min-h-[52px] px-[18px] border border-[#f1b6ff]/15 rounded-[14px] bg-[linear-gradient(135deg,#8e5cff_0%,#d777f0_100%)] text-white font-extrabold tracking-[-0.01em] cursor-pointer shadow-[0_20px_44px_rgba(156,92,255,0.34)] transition-all hover:translate-y-[-1px] hover:brightness-110 hover:shadow-[0_24px_52px_rgba(156,92,255,0.42)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:brightness-100" type="submit" ?disabled=${this.isSubmitting}>
            <span>${this.isSubmitting ? 'Signing in...' : 'Sign in'}</span>
            <app-icon .icon=${ArrowRight} .size=${16}></app-icon>
          </button>
          
          <div class="grid gap-[14px] mt-[6px] text-[#9aa6ba] text-[0.95rem]">
            <div class="text-center">
              <span>New here? </span>
              <button class="p-0 border-0 bg-transparent text-[#f5ecff] font-extrabold cursor-pointer hover:text-[#d6abff] transition-colors" type="button" @click=${this.openRegister}>Create an account</button>
            </div>
            <div class="text-[#7c89a9] text-[0.9rem] text-center">Internal access only.</div>
          </div>
        </form>
      </section>
    `
  }

  private handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault()

    this.isSubmitting = true
    this.errorMessage = ''

    try {
      await this.signInUseCase.execute({
        email: this.email.trim(),
        password: this.password,
      })
      await AppRouter.navigate(DASHBOARD_PATH)
    } catch (error) {
      this.errorMessage =
        error instanceof Error ? error.message : 'Unexpected authentication error.'
    } finally {
      this.isSubmitting = false
    }
  }

  private openForgotPassword(): void {
    void AppRouter.navigate(FORGOT_PASSWORD_PATH)
  }

  private openRegister(): void {
    void AppRouter.navigate(REGISTER_PATH)
  }

  private handleEmailInput(event: Event): void {
    this.email = (event.target as HTMLInputElement).value
  }

  private handlePasswordInput(event: Event): void {
    this.password = (event.target as HTMLInputElement).value
  }
}
