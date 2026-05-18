import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'

import { AppRouter } from '@app/app.router'
import { USE_CASES } from '@app/dependencies'
import { LOGIN_PATH } from '@features/auth/presentation/auth.routes'
import { tailwindStyles } from '@styles/tailwind-styles'

type QueueItem = {
  customer: string
  orderId: string
  status: string
  amount: string
}

const queueItems: QueueItem[] = [
  { customer: 'Sophie Laurent', orderId: 'ORD-44821', status: 'Review return request', amount: 'EUR 247.00' },
  { customer: 'Maya Chen', orderId: 'ORD-44783', status: 'Awaiting inspection approval', amount: 'EUR 89.00' },
  { customer: 'Jonas Weber', orderId: 'ORD-44755', status: 'Refund exception review', amount: 'EUR 326.40' },
]

@customElement('app-dashboard-page')
export class AppDashboardPage extends LitElement {
  static styles = [tailwindStyles]

  private readonly signOutUseCase = USE_CASES.auth.signOut

  @state()
  private isSigningOut = false

  render() {
    return html`
      <section class="grid gap-[22px] min-w-0 text-text-primary">
        <header class="flex justify-between gap-6 items-start max-[780px]:flex-col">
          <div>
            <p class="mb-[10px] text-brand-light text-[0.82rem] font-bold tracking-[0.08em] uppercase">Operations dashboard</p>
            <h1 class="text-[clamp(2rem,4vw,2.9rem)] leading-[1.02] tracking-[-0.05em] font-bold">Returns, approvals, and exceptions in one workspace.</h1>
            <p class="mt-[10px] max-w-[62ch] text-text-secondary leading-[1.65]">
              Monitor pending actions, review customer orders, and move the queue without leaving the main operations surface.
            </p>
          </div>

          <div class="flex gap-3 flex-wrap justify-end max-[780px]:justify-start">
            <button class="min-h-[44px] px-4 rounded-xl font-bold cursor-pointer border border-white/10 bg-white/5 text-text-primary hover:bg-white/10" type="button" ?disabled=${this.isSigningOut} @click=${this.handleSignOut}>
              ${this.isSigningOut ? 'Signing out...' : 'Sign out'}
            </button>
            <button class="min-h-[44px] px-4 rounded-xl font-bold cursor-pointer border-0 bg-brand-gradient text-white shadow-brand hover:opacity-90" type="button">New Return</button>
          </div>
        </header>

        <section class="grid grid-cols-4 gap-[14px] max-[1200px]:grid-cols-2 max-[780px]:grid-cols-1" aria-label="Operations metrics">
          <article class="p-[18px_18px_16px] border border-blue-200/5 rounded-2xl bg-panel-gradient shadow-[0_18px_50px_rgba(0,0,0,0.22)]">
            <div class="text-[#7b88ab] text-[0.76rem] font-bold tracking-[0.08em] uppercase">Open returns</div>
            <div class="mt-[10px] text-[1.55rem] font-bold tracking-[-0.03em]">24</div>
            <div class="mt-2 text-[#90a0c8] text-[0.92rem]">4 require manual approval</div>
          </article>
          <article class="p-[18px_18px_16px] border border-blue-200/5 rounded-2xl bg-panel-gradient shadow-[0_18px_50px_rgba(0,0,0,0.22)]">
            <div class="text-[#7b88ab] text-[0.76rem] font-bold tracking-[0.08em] uppercase">Pending inspections</div>
            <div class="mt-[10px] text-[1.55rem] font-bold tracking-[-0.03em]">9</div>
            <div class="mt-2 text-[#90a0c8] text-[0.92rem]">2 escalated in the last hour</div>
          </article>
          <article class="p-[18px_18px_16px] border border-blue-200/5 rounded-2xl bg-panel-gradient shadow-[0_18px_50px_rgba(0,0,0,0.22)]">
            <div class="text-[#7b88ab] text-[0.76rem] font-bold tracking-[0.08em] uppercase">Refund approved</div>
            <div class="mt-[10px] text-[1.55rem] font-bold tracking-[-0.03em]">EUR 3.4k</div>
            <div class="mt-2 text-[#90a0c8] text-[0.92rem]">Today across 18 orders</div>
          </article>
          <article class="p-[18px_18px_16px] border border-blue-200/5 rounded-2xl bg-panel-gradient shadow-[0_18px_50px_rgba(0,0,0,0.22)]">
            <div class="text-[#7b88ab] text-[0.76rem] font-bold tracking-[0.08em] uppercase">Average turnaround</div>
            <div class="mt-[10px] text-[1.55rem] font-bold tracking-[-0.03em]">6h 12m</div>
            <div class="mt-2 text-[#90a0c8] text-[0.92rem]">Down 14% week over week</div>
          </article>
        </section>

        <section class="border border-blue-200/5 rounded-2xl bg-panel-gradient shadow-[0_18px_50px_rgba(0,0,0,0.22)] overflow-hidden max-[780px]:overflow-x-auto" aria-labelledby="queue-title">
          <div class="flex items-center justify-between gap-4 p-[18px_20px] border-b border-white/5">
            <div>
              <div id="queue-title" class="text-base font-bold">Priority queue</div>
              <div class="text-text-muted text-[0.9rem]">Orders that need attention before automatic processing can continue.</div>
            </div>
          </div>

          <table class="w-full border-collapse max-[780px]:min-w-[720px]">
            <thead>
              <tr>
                <th class="p-[16px_20px] text-left text-[#7280a2] text-[0.75rem] font-bold tracking-[0.08em] uppercase">Customer</th>
                <th class="p-[16px_20px] text-left text-[#7280a2] text-[0.75rem] font-bold tracking-[0.08em] uppercase">Order</th>
                <th class="p-[16px_20px] text-left text-[#7280a2] text-[0.75rem] font-bold tracking-[0.08em] uppercase">Status</th>
                <th class="p-[16px_20px] text-left text-[#7280a2] text-[0.75rem] font-bold tracking-[0.08em] uppercase">Amount</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              ${queueItems.map((item) => html`
                <tr>
                  <td class="p-[16px_20px] text-text-primary text-[0.96rem]">${item.customer}</td>
                  <td class="p-[16px_20px] text-text-muted text-[0.96rem]">${item.orderId}</td>
                  <td class="p-[16px_20px] text-success font-semibold text-[0.96rem]">${item.status}</td>
                  <td class="p-[16px_20px] text-text-primary text-[0.96rem]">${item.amount}</td>
                </tr>
              `)}
            </tbody>
          </table>
        </section>
      </section>
    `
  }

  private async handleSignOut() {
    this.isSigningOut = true

    try {
      await this.signOutUseCase.execute()
      await AppRouter.navigate(LOGIN_PATH)
    } finally {
      this.isSigningOut = false
    }
  }
}
