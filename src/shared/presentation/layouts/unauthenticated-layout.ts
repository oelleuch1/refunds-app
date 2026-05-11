import { BadgeCheck, RefreshCcw, ShieldCheck, Zap } from 'lucide'
import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'

import { tailwindStyles } from '@styles/tailwind-styles'

import '@shared/presentation/components/app-icon'

const features = [
  { icon: ShieldCheck, label: 'Role-based access control' },
  { icon: BadgeCheck, label: 'Full audit trail on every action' },
  { icon: Zap, label: 'Real-time approval workflows' },
]

@customElement('unauthenticated-layout')
export class UnauthenticatedLayout extends LitElement {
  static styles = [tailwindStyles]

  render() {
    return html`
      <div class="grid min-h-screen grid-cols-[minmax(360px,1.04fr)_minmax(420px,1fr)] max-[1080px]:grid-cols-1 bg-[#080d18] text-[#eef1ff]">
        <section class="relative overflow-hidden grid grid-rows-[auto_1fr_auto] p-[34px_36px_38px] bg-[radial-gradient(circle_at_18%_6%,rgba(255,255,255,0.08),transparent_18%),radial-gradient(circle_at_86%_32%,rgba(255,255,255,0.06),transparent_11%),radial-gradient(circle_at_8%_92%,rgba(255,255,255,0.06),transparent_15%),linear-gradient(180deg,#32166f_0%,#2b125c_100%)] border-r border-white/5 max-[1080px]:min-h-[320px] after:content-[''] after:absolute after:border after:border-white/5 after:rounded-full after:pointer-events-none after:right-7 after:top-[118px] after:w-[214px] after:h-[214px] before:content-[''] before:absolute before:border before:border-white/5 before:rounded-full before:pointer-events-none before:top-[-86px] before:left-[-70px] before:w-[260px] before:h-[260px]">
          <div class="flex items-center gap-3 text-[1.12rem] font-bold tracking-[-0.02em]">
            <span class="inline-grid place-items-center w-[30px] h-[30px] rounded-full bg-[linear-gradient(135deg,#bc7dff_0%,#8d60ff_100%)] shadow-[0_14px_30px_rgba(140,96,255,0.3)]">
              <app-icon .icon=${RefreshCcw} .size=${16}></app-icon>
            </span>
            <span>ReturnOps</span>
          </div>

          <div class="self-center max-w-[420px] p-[24px_0_20px]">
            <h1 class="text-[clamp(2.2rem,3.8vw,3.35rem)] leading-[1.02] tracking-[-0.06em] font-bold">Returns & refunds operations portal</h1>
            <p class="mt-[18px] text-white/70 text-base leading-[1.7]">Manage return requests, approvals, warehouse inspections, and refund workflows, all in one place.</p>
          </div>

          <div class="grid gap-[14px] max-w-[330px] pt-[26px] border-t border-white/5">
            ${features.map((feature) => html`
              <div class="flex items-center gap-3 text-white/80 text-[0.95rem]">
                <span class="inline-grid place-items-center w-7 h-7 rounded-[10px] bg-white/5 text-[#ddcaff]">
                  <app-icon .icon=${feature.icon} .size=${15}></app-icon>
                </span>
                <span>${feature.label}</span>
              </div>
            `)}
            <div class="mt-2 text-white/30 text-[0.78rem]">© 2026 ReturnOps - Internal use only</div>
          </div>
        </section>

        <section class="grid place-items-center p-[32px_24px] bg-[linear-gradient(180deg,#090f19_0%,#080d18_100%)]">
          <div class="w-full max-w-[520px]">
            <slot></slot>
          </div>
        </section>
      </div>
    `
  }
}
