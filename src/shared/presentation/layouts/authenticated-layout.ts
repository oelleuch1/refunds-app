import { Bell } from 'lucide'
import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { tailwindStyles } from '@styles/tailwind-styles'

import '@shared/presentation/components/app-icon'
import '@shared/presentation/components/left-sidebar'

@customElement('authenticated-layout')
export class AuthenticatedLayout extends LitElement {
  static styles = [tailwindStyles]

  @property()
  currentPath = window.location.pathname

  render() {
    return html`
      <div class="grid min-h-screen grid-cols-[260px_minmax(0,1fr)] max-[980px]:grid-cols-1 text-[#eef2ff] bg-[radial-gradient(circle_at_top_left,rgba(117,79,255,0.24),transparent_26%),linear-gradient(180deg,#0d1220_0%,#0a0f1a_100%)]">
        <left-sidebar class="block h-full min-h-screen self-stretch max-[980px]:min-h-0" .currentPath=${this.currentPath}></left-sidebar>

        <div class="grid grid-rows-[auto_minmax(0,1fr)] min-w-0">
          <header class="flex items-center justify-between gap-5 min-h-[72px] px-[22px] border-b border-white/5 bg-[#0a0f1a]/80 backdrop-blur-xl">
            <div class="text-white/80 text-[0.92rem] font-semibold tracking-[0.02em]">Operations workspace</div>
            <div class="flex items-center gap-3">
              <button class="relative inline-grid place-items-center w-[34px] h-[34px] border border-white/10 rounded-xl bg-white/5 text-[#f5f6ff]" type="button" aria-label="Notifications">
                <app-icon .icon=${Bell} .size=${16}></app-icon>
                <span class="absolute top-[-4px] right-[-4px] inline-grid place-items-center w-4 h-4 rounded-full bg-[#ff4e63] text-white text-[0.62rem] font-bold">3</span>
              </button>
            </div>
          </header>

          <main class="min-w-0 p-[26px_22px_32px]">
            <slot></slot>
          </main>
        </div>
      </div>
    `
  }
}
