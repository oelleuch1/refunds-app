import {
  ClipboardList,
  Gauge,
  History,
  RefreshCcw,
  Search,
  Settings,
  ShieldCheck,
  type IconNode,
} from 'lucide'
import { consume } from '@lit/context'
import { LitElement, html, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { DASHBOARD_PATH } from '@features/dashboard/presentation/dashboard.routes'
import { CUSTOMERS_PATH } from '@features/customers/presentation/customers.routes'
import { AppRouter } from '@app/app.router'
import { appStateContext, initialAppState, type AppState } from '@shared/presentation/state/app-state-context'
import { tailwindStyles } from '@styles/tailwind-styles'

import '@shared/presentation/components/app-icon'

type NavItem = {
  label: string
  path?: string
  badge?: number
  icon: IconNode
}

type NavSection = {
  label: string
  items: NavItem[]
}

const primarySections: NavSection[] = [
  {
    label: '',
    items: [
      { label: 'Dashboard', path: DASHBOARD_PATH, icon: Gauge },
      { label: 'Customer search', icon: Search, path: CUSTOMERS_PATH },
      { label: 'Orders', icon: ClipboardList },
      { label: 'Returns', badge: 4, icon: RefreshCcw },
    ],
  },
  {
    label: 'Review',
    items: [
      { label: 'Approval queue', badge: 7, icon: ShieldCheck },
      { label: 'Inspections', icon: ClipboardList },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Audit log', icon: History },
      { label: 'Settings', icon: Settings },
    ],
  },
]

@customElement('left-sidebar')
export class LeftSidebar extends LitElement {
  static styles = [tailwindStyles]

  @consume({ context: appStateContext, subscribe: true })
  @property({ attribute: false })
  appState: AppState = initialAppState

  @property()
  currentPath = window.location.pathname

  render() {
    const user = this.appState.session?.user;

    return html`
      <aside class="grid min-h-full h-full grid-rows-[auto_1fr_auto] border-r border-white/10 bg-[linear-gradient(180deg,rgba(62,27,122,0.94)_0%,rgba(43,18,91,0.98)_100%)] p-[18px_16px_14px] gap-[24px] min-w-0 max-[980px]:grid-rows-none max-[980px]:gap-[18px] max-[980px]:pb-[18px]">
        <div class="flex items-center gap-3 p-[4px_0_10px] text-[1.15rem] font-bold tracking-[-0.02em]">
          <span class="inline-grid place-items-center w-7 h-7 rounded-full text-white bg-[linear-gradient(135deg,#a86cff_0%,#6e4eff_100%)] shadow-[0_10px_24px_rgba(110,78,255,0.3)] text-[0.78rem] font-bold">R</span>
          <span>ReturnOps</span>
        </div>

        <nav aria-label="Primary navigation" class="flex flex-col justify-start gap-[28px] self-start pt-1">
          ${primarySections.map((section) => this.renderSection(section))}
        </nav>

        <div class="flex items-center gap-3 p-[10px_6px_0] border-t border-white/5 max-[980px]:pt-0 max-[980px]:border-t-0">
          <span class="inline-grid place-items-center w-7 h-7 rounded-full text-white bg-[linear-gradient(135deg,#a86cff_0%,#6e4eff_100%)] shadow-[0_10px_24px_rgba(110,78,255,0.3)] text-[0.78rem] font-bold">${this.getInitials(user?.fullName)}</span>
          <div class="grid gap-[2px] min-w-0">
            <span class="text-[0.92rem] font-semibold overflow-hidden text-ellipsis whitespace-nowrap">${user?.fullName ?? 'Operations user'}</span>
            <span class="text-white/60 text-[0.78rem] overflow-hidden text-ellipsis whitespace-nowrap">${this.formatRole(user?.role)}</span>
          </div>
        </div>
      </aside>
    `
  }

  private renderSection(section: NavSection) {
    return html`
      <section class="flex flex-col gap-[12px]">
        ${section.label ? html`<div class="px-[2px] text-white/40 text-[0.68rem] font-bold tracking-[0.08em] uppercase">${section.label}</div>` : nothing}
        <div class="flex flex-col gap-[8px]">
          ${section.items.map((item) => this.renderItem(item))}
        </div>
      </section>
    `
  }

  private renderItem(item: NavItem) {
    const isActive = item.path === this.currentPath
    const isDisabled = item.path === undefined

    return html`
      <button
        class="flex items-center gap-[12px] w-full min-h-[48px] px-[14px] border-0 rounded-xl text-[#f3efff] text-left cursor-pointer transition-all hover:bg-white/10 hover:translate-x-[1px] ${isActive ? 'bg-white/10 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]' : 'bg-transparent'} ${isDisabled ? 'text-white/70 cursor-default hover:bg-transparent hover:translate-x-0' : ''}"
        type="button"
        @click=${() => this.handleItemClick(item)}
      >
        <span class="inline-grid place-items-center w-[18px] h-[18px] text-white/70 flex-none"><app-icon .icon=${item.icon} .size=${16}></app-icon></span>
        <span class="flex-1 text-[0.94rem] font-medium">${item.label}</span>
        ${item.badge ? html`<span class="inline-grid place-items-center min-w-[20px] h-5 px-[6px] rounded-full bg-[#ff4e63] text-white text-[0.72rem] font-bold">${item.badge}</span>` : nothing}
      </button>
    `
  }

  private async handleItemClick(item: NavItem): Promise<void> {
    if (!item.path || item.path === this.currentPath) {
      return
    }

    await AppRouter.navigate(item.path)
  }

  private getInitials(fullName: string | undefined): string {
    if (!fullName) {
      return 'OP'
    }

    return fullName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('')
  }

  private formatRole(role: string | undefined): string {
    if (!role) {
      return 'Operations workspace'
    }

    return role
      .split('_')
      .map((part) => part[0]?.toUpperCase() + part.slice(1))
      .join(' ')
  }
}
