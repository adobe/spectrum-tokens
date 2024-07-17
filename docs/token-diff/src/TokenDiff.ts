import { html, css, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import '@spectrum-web-components/theme/sp-theme.js';
import '@spectrum-web-components/theme/src/themes.js';
import '@spectrum-web-components/card/sp-card.js';
import '@spectrum-web-components/button/sp-button.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-compare.js';
import './compare-card.js';

export class TokenDiff extends LitElement {
  static styles = css`
    :host {
      display: flex;
      padding: 25px;
      color: var(--token-diff-text-color, #000);
      background-color: white;
      flex: auto;
      top: 0;
      overflow-x: auto;
      height: 100vh;
    }
    .title {
      color: #000;
      font-family: 'Adobe Clean Serif';
      font-size: 58px;
      font-style: normal;
      font-weight: 900;
      line-height: 66.7px; /* 115% */
      margin-top: 15px;
    }
    .warning-text {
      color: #222;
      font-size: 18px;
      font-style: normal;
      font-weight: 400;
      line-height: 27px; /* 150% */
      margin-bottom: 40px;
    }
    .page {
      display: flex;
      justify-content: center;
      margin-left: 100px;
      margin-right: 100px;
    }
    .compare-button {
      margin-top: 40px;
    }
  `;

  @property({ type: String }) originalBranchOrTag = "";
  @property({ type: String }) updatedBranchOrTag = "";
  @property({ type: String }) originalSchema = "";
  @property({ type: String }) updatedSchema = "";
  @property({ type: String }) originalVers = "";
  @property({ type: String }) updatedVers = "";

  __originalCardListener(e: CustomEvent) {
    this.__updatedProperty(true, e.detail);
  }

  __updatedProperty(original: boolean, newValue: string) {
    const key = Object.keys(newValue)[0];
    if (original) {
      if (key !== "schema") {
        this.originalBranchOrTag = Object.values(newValue)[0];
        this.originalVers = key === "branch" ? "branch" : "tag";
      } else {
        this.originalSchema = Object.values(newValue)[0];
      }
    } else {
      if (key !== "schema") {
        this.updatedBranchOrTag = Object.values(newValue)[0];
        this.updatedVers = key === "branch" ? "branch" : "tag";
      } else {
        this.updatedSchema = Object.values(newValue)[0];
      }
    }
  }

  __updatedCardListener(e: CustomEvent) {
    this.__updatedProperty(false, e.detail);
  }

  __generateReport() {
    // call token diff generator library
    console.log("originalVers: " + this.originalVers);
    console.log("updatedVerse: " + this.updatedVers);
    console.log("originalBranch: " + this.originalBranchOrTag);
    console.log("originalSchema: " + this.originalSchema);
    console.log("updatedBranch: " + this.updatedBranchOrTag);
    console.log("updatedSchema: " + this.updatedSchema);
  }

  protected override render(): TemplateResult {
    return html`
      <div class="page">
        <sp-theme theme="spectrum" color="light" scale="medium">
          <div class="title spectrum-Typography spectrum-Heading--sizeXXL spectrum-Heading--serif">
            Token diff generator
          </div>
          <div class="warning-text">
            WARNING: Will either be inaccurate or will throw an error if used
            for releases or branches that use tokens from before
            @adobe/spectrum-tokens@12.26.0!
          </div>
          <div class="page">
            <compare-card @selection=${this.__originalCardListener} heading="Version A"></compare-card>
            <compare-card @selection=${this.__updatedCardListener} heading="Version B"></compare-card>
          </div>
          <div class="page compare-button">
            <sp-button @click=${this.__generateReport} variant="accent" size="m">
              <sp-icon-compare slot="icon"></sp-icon-compare>
              Compare
            </sp-button>
          </div>
        </sp-theme>
      </div>
    `;
  }
}
