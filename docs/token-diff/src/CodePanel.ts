import { html, css, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import '@spectrum-web-components/theme/sp-theme.js';
import '@spectrum-web-components/theme/src/themes.js';
import '@spectrum-web-components/card/sp-card.js';
import '@spectrum-web-components/button/sp-button.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-compare.js';
import '@spectrum-web-components/tabs/sp-tabs.js';
import '@spectrum-web-components/tabs/sp-tab.js';
import '@spectrum-web-components/tabs/sp-tab-panel.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-copy.js';
import '@spectrum-web-components/overlay/sp-overlay.js';
// import '@spectrum-web-components/toast/sp-toast.js';
import './compare-card.js';

export class CodePanel extends LitElement {
  static styles = css`
    :host {
      color: var(--token-diff-text-color, #000);
      top: 0;
      overflow-x: auto;
    }
    .page {
      background-color: #f8f8f8;
      border-radius: 10px;
      padding: 10px 25px;
      /* text-align: left; */
    }
    pre {
      margin: 0;
      height: fit-content;
      display: flex;
    }
    code {
      left: 0;
      text-align: left;
      width: fit-content;
      /* align-content: flex-start; */
    }
    .copy-button {
      display: flex;
      float: right;
    }
  `;

  constructor(codeSnippet: string, tagOptions: string[]) {
    super();
    this.codeSnippet = codeSnippet;
    this.tagOptions = tagOptions;
  }

  @property({ type: String }) codeSnippet = '';
  @property({ type: Array }) tagOptions: string[] = [];
  @property({ type: String }) copyMessage = 'Copy to clipboard';
  @property({ type: String }) curTab = '';

  firstUpdated() {
    this.codeSnippet = this.codeSnippet.trim();
    if (this.tagOptions.length > 0) {
      this.curTab = this.tagOptions[0];
    }
  }

  __addTabs() {
    return html`
      <sp-tabs id="tabs" selected=${this.tagOptions[0]} quiet>
        ${this.tagOptions.map(label => {
          return this.__newTab(label);
        })}
        ${this.tagOptions.map(label => {
          return this.__newPanel(label);
        })}
      </sp-tabs>
    `;
  }

  __newTab(label: string) {
    return html`
      <sp-tab
        label=${label}
        value=${label}
        @click=${() => (this.curTab = label)}
      ></sp-tab>
    `;
  }

  __newPanel(label: string) {
    return html`
      <sp-tab-panel value=${label}>
        ${this.__regularCodeSnippetDisplay(`${label} ${this.codeSnippet}`)}
      </sp-tab-panel>
    `;
  }

  __regularCodeSnippetDisplay(code: string) {
    return html` <pre>
          <code>
            ${code}
          </code>
        </pre>`;
  }

  __changeMessage() {
    // this.copyMessage = 'Copied!';
    if (this.tagOptions !== undefined) {
      navigator.clipboard.writeText(this.curTab + ' ' + this.codeSnippet);
    } else {
      navigator.clipboard.writeText(this.codeSnippet);
    }
  }

  protected override render(): TemplateResult {
    return html`
      <div class="page">
        <sp-theme scale="medium" color="light">
          <sp-action-button
            class="copy-button"
            quiet
            @click=${this.__changeMessage}
            id="trigger"
          >
            <sp-icon-copy slot="icon"></sp-icon-copy>
            ${this.copyMessage}
          </sp-action-button>
        </sp-theme>
        ${this.tagOptions.length > 0
          ? this.__addTabs()
          : this.__regularCodeSnippetDisplay(this.codeSnippet)}
      </div>
    `;
  }
}
