import { createElement, type IconNode } from 'lucide'
import { LitElement, html } from 'lit'
import { unsafeSVG } from 'lit/directives/unsafe-svg.js'
import { customElement, property } from 'lit/decorators.js'

@customElement('app-icon')
export class AppIcon extends LitElement {
  @property({ attribute: false })
  icon: IconNode | null = null

  @property({ type: Number })
  size = 16

  @property({ type: Number, attribute: 'stroke-width' })
  strokeWidth = 1.8

  updated() {
    this.style.display = 'inline-grid'
    this.style.placeItems = 'center'
    this.style.width = `${this.size}px`
    this.style.height = `${this.size}px`
    this.style.lineHeight = '0'
    this.style.flexShrink = '0'
  }

  render() {
    if (this.icon === null) {
      return html``
    }

    const svg = createElement(this.icon, {
      width: String(this.size),
      height: String(this.size),
      strokeWidth: this.strokeWidth,
      style: 'display: block;',
    })

    return html`
      <span style="display: inline-grid; place-items: center; color: inherit; line-height: 0; width: ${this.size}px; height: ${this.size}px;">
        ${unsafeSVG(svg.outerHTML)}
      </span>
    `
  }
}
