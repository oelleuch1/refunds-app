import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { ArrowRight, BadgeCheck, CircleAlert, Lock, Mail, ShieldCheck, User, UserCog } from 'lucide'

import { USE_CASES } from '@app/dependencies'
import { AppRouter } from '@app/app.router'
import { UserRole } from '@features/auth/domain/value-objects/user-role'
import { DASHBOARD_PATH } from '@features/dashboard/presentation/dashboard.routes'
import { LOGIN_PATH } from '@features/auth/presentation/auth.routes'
import { tailwindStyles } from '@styles/tailwind-styles'

import '@shared/presentation/components/app-icon'

type RoleOption = {
  value: UserRole
  label: string
  description: string
  accent: string
  icon: typeof ShieldCheck
}

const roleOptions: RoleOption[] = [
  {
    value: UserRole.SupportAgent,
    label: 'Support agent',
    description: 'Handle customer requests and standard return flows.',
    accent: 'text-[#73d7ff] border-[#73d7ff]/25 bg-[#73d7ff]/10',
    icon: UserCog,
  },
  {
    value: UserRole.OperationsReviewer,
    label: 'Ops reviewer',
    description: 'Review inspections and approve low-risk refunds.',
    accent: 'text-[#58e0a1] border-[#58e0a1]/25 bg-[#58e0a1]/10',
    icon: BadgeCheck,
  },
  {
    value: UserRole.OperationsManager,
    label: 'Ops manager',
    description: 'Override exceptions and manage workspace policy.',
    accent: 'text-[#ffbf6b] border-[#ffbf6b]/25 bg-[#ffbf6b]/10',
    icon: ShieldCheck,
  },
]

@customElement('auth-register-page')
export class AuthRegisterPage extends LitElement {
  static styles = [tailwindStyles]

  @state()
  errorMessage = ''

  @state()
  private isSubmitting = false

  private readonly signUpUseCase = USE_CASES.auth.signUp

  @state()
  private fullName = ''

  @state()
  private email = ''

  @state()
  private password = ''

  @state()
  private selectedRole = UserRole.SupportAgent

  render() {
    return html`
      <section class="w-full max-w-[420px] mx-auto text-[#eef1ff]">
        <div class="grid gap-3 mb-7">
          <p class="text-[#7b89ac] text-[0.9rem] leading-[1.4]">Operator access</p>
          <h2 class="text-[clamp(2.1rem,2.8vw,2.55rem)] leading-[1.08] font-bold tracking-[-0.04em] text-[#f7f8ff]">Create your account</h2>
          <p class="text-[#8593b7] leading-[1.5] text-base">Open an internal ReturnOps workspace with the role that matches your approval level.</p>
        </div>

        <form @submit=${this.handleSubmit} class="grid gap-4">
          ${this.errorMessage ? html`
            <div class="flex items-center gap-[10px] p-[12px_14px] rounded-xl bg-[rgba(255,98,98,0.10)] border border-[rgba(255,98,98,0.22)] text-[#ffd0d0] text-[0.9rem] leading-[1.55]">
              <app-icon .icon=${CircleAlert} .size=${16}></app-icon>
              <span>${this.errorMessage}</span>
            </div>
          ` : null}
          <label class="grid gap-2 text-[0.88rem] font-semibold text-[#edf1ff]">
            Full name
            <span class="flex items-center gap-[10px] min-h-[48px] px-[14px] border border-white/10 rounded-xl bg-white/5 text-[#8e9cbe] focus-within:border-brand/80 focus-within:ring-4 focus-within:ring-brand/10 transition-all">
              <app-icon .icon=${User} .size=${16}></app-icon>
              <input
                class="flex-1 min-w-0 border-0 bg-transparent text-[#f4f6ff] focus:outline-none disabled:opacity-60"
                type="text"
                .value=${this.fullName}
                ?disabled=${this.isSubmitting}
                @input=${this.handleFullNameInput}
                required
              />
            </span>
          </label>

          <label class="grid gap-2 text-[0.88rem] font-semibold text-[#edf1ff]">
            Email address
            <span class="flex items-center gap-[10px] min-h-[48px] px-[14px] border border-white/10 rounded-xl bg-white/5 text-[#8e9cbe] focus-within:border-brand/80 focus-within:ring-4 focus-within:ring-brand/10 transition-all">
              <app-icon .icon=${Mail} .size=${16}></app-icon>
              <input
                class="flex-1 min-w-0 border-0 bg-transparent text-[#f4f6ff] focus:outline-none disabled:opacity-60"
                type="email"
                .value=${this.email}
                ?disabled=${this.isSubmitting}
                @input=${this.handleEmailInput}
                required
              />
            </span>
          </label>

          <label class="grid gap-2 text-[0.88rem] font-semibold text-[#edf1ff]">
            Password
            <span class="flex items-center gap-[10px] min-h-[48px] px-[14px] border border-white/10 rounded-xl bg-white/5 text-[#8e9cbe] focus-within:border-brand/80 focus-within:ring-4 focus-within:ring-brand/10 transition-all">
              <app-icon .icon=${Lock} .size=${16}></app-icon>
              <input
                class="flex-1 min-w-0 border-0 bg-transparent text-[#f4f6ff] focus:outline-none disabled:opacity-60"
                type="password"
                .value=${this.password}
                ?disabled=${this.isSubmitting}
                @input=${this.handlePasswordInput}
                required
              />
            </span>
          </label>

          <div class="grid gap-2 text-[0.88rem] font-semibold text-[#edf1ff]">
            Role
            <div class="grid gap-3">
              ${roleOptions.map((role) => {
                const isSelected = this.selectedRole === role.value
                return html`
                  <button
                    class=${`grid gap-1 rounded-2xl border p-[14px_16px] text-left transition-all ${
                      isSelected
                        ? 'border-[#b98cff] bg-[linear-gradient(180deg,rgba(166,107,255,0.18)_0%,rgba(84,43,133,0.24)_100%)] shadow-[0_16px_34px_rgba(126,73,232,0.18)]'
                        : 'border-white/10 bg-white/[0.03] hover:border-white/18 hover:bg-white/[0.05]'
                    }`}
                    type="button"
                    ?disabled=${this.isSubmitting}
                    @click=${() => this.selectRole(role.value)}
                  >
                    <span class="flex items-center gap-3">
                      <span class=${`inline-grid h-9 w-9 place-items-center rounded-xl border ${role.accent}`}>
                        <app-icon .icon=${role.icon} .size=${18}></app-icon>
                      </span>
                      <span class="flex-1">
                        <span class="block text-[0.96rem] font-bold text-[#f5f7ff]">${role.label}</span>
                        <span class="mt-1 block text-[0.86rem] font-medium leading-[1.5] text-[#90a0c4]">${role.description}</span>
                      </span>
                      <span class=${`mt-1 inline-block h-4 w-4 rounded-full border ${
                        isSelected ? 'border-[#d6a8ff] bg-[radial-gradient(circle,#f0d4ff_0%,#c57fff_45%,#8a57ff_100%)] shadow-[0_0_0_4px_rgba(177,114,255,0.14)]' : 'border-white/20 bg-transparent'
                      }`}></span>
                    </span>
                  </button>
                `
              })}
            </div>
          </div>

          <button class="flex items-center justify-center gap-[10px] min-h-[52px] px-[18px] border border-[#f1b6ff]/15 rounded-[14px] bg-[linear-gradient(135deg,#8e5cff_0%,#d777f0_100%)] text-white font-extrabold tracking-[-0.01em] cursor-pointer shadow-[0_20px_44px_rgba(156,92,255,0.34)] transition-all hover:translate-y-[-1px] hover:brightness-110 hover:shadow-[0_24px_52px_rgba(156,92,255,0.42)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:brightness-100" type="submit" ?disabled=${this.isSubmitting || !this.canSubmit()}>
            <span>${this.isSubmitting ? 'Creating account...' : 'Create account'}</span>
            <app-icon .icon=${ArrowRight} .size=${16}></app-icon>
          </button>

          <div class="text-[#8593b7] text-[0.92rem] leading-[1.6]">
            Ops managers can review exceptions and manage configuration. Support agents stay scoped to customer-facing workflows.
          </div>

          <button class="p-0 border-0 bg-transparent text-[#f5ecff] font-extrabold cursor-pointer hover:text-[#d6abff] transition-colors text-center" type="button" @click=${this.openLogin}>
            Back to sign in
          </button>
        </form>
      </section>
    `
  }

  private canSubmit(): boolean {
    return (
      this.fullName.trim().length > 0 &&
      this.email.trim().length > 0 &&
      this.password.trim().length > 0
    )
  }

  private handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault()

    if (!this.canSubmit()) {
      return
    }

    this.isSubmitting = true
    this.errorMessage = ''

    try {
      const session = await this.signUpUseCase.execute({
        fullName: this.fullName.trim(),
        email: this.email.trim(),
        password: this.password,
        role: this.selectedRole,
      })

      await AppRouter.navigate(session ? DASHBOARD_PATH : LOGIN_PATH)

      if (!session) {
        this.errorMessage =
          'Account created. If email confirmation is enabled, check your inbox before signing in.'
      }
    } catch (error) {
      this.errorMessage =
        error instanceof Error ? error.message : 'Unexpected authentication error.'
    } finally {
      this.isSubmitting = false
    }
  }

  private openLogin(): void {
    void AppRouter.navigate(LOGIN_PATH)
  }

  private handleFullNameInput(event: Event): void {
    this.fullName = (event.target as HTMLInputElement).value
  }

  private handleEmailInput(event: Event): void {
    this.email = (event.target as HTMLInputElement).value
  }

  private handlePasswordInput(event: Event): void {
    this.password = (event.target as HTMLInputElement).value
  }

  private selectRole(role: UserRole): void {
    this.selectedRole = role
  }
}
