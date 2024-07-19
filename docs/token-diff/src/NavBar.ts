import { html, css, LitElement, TemplateResult } from 'lit';
import '@spectrum-web-components/sidenav/sp-sidenav.js';
import '@spectrum-web-components/sidenav/sp-sidenav-item.js';
import '@spectrum-web-components/theme/sp-theme.js';
import '@spectrum-web-components/theme/src/themes.js';

export class NavBar extends LitElement {
  static styles = css`
    :host {
      padding: 25px;
      color: var(--token-diff-text-color, #000);
      min-width: fit-content;
    }
    .logo-text {
      display: flex;
      color: #000;
      font-size: 20px;
      font-style: normal;
      font-weight: 700;
      line-height: 111%; /* 22.2px */
      float: right;
      padding-left: 10px;
      padding-top: 15px;
    }
    .logo-section {
      display: flex;
      align-items: center;
      padding-bottom: 15px;
      margin: auto;
      /* justify-content: center; */
    }
    .entire-bar {
      background-color: '#F8F8F8';
      width: fit-content;
    }
    img {
      align-content: center;
      vertical-align: middle;
      padding-left: 14px;
    }
    a {
      text-decoration: none;
    }
    @media only screen and (max-width: 1100px) {
      :host {
        padding: auto;
      }
    }
  `;

  protected override render(): TemplateResult {
    return html`
      <div class="entire-bar">
        <a class="logo-section" href="/demo/">
          <img class="logo" src="/src/assets/adobe_logo.svg" alt="adobe logo" />
          <div class="logo-text">
            <sp-theme theme="spectrum" color="light" scale="medium">
              <h2
                class="spectrum-Typography spectrum-Heading--sizeXXL logo-section"
              >
                Spectrum <br />
                Tokens
              </h2>
            </sp-theme>
          </div>
        </a>
        <sp-theme scale="medium" color="light">
          <sp-sidenav defaultValue="Token diff generator" variant="multilevel">
            <sp-sidenav-item
              value="Token diff generator"
              href="/demo/"
              label="Token diff generator"
            ></sp-sidenav-item>
            <sp-sidenav-item
              value="Getting started"
              href="/getting-started"
              label="Getting started"
            ></sp-sidenav-item>
          </sp-sidenav>
        </sp-theme>
      </div>
    `;
  }
}
