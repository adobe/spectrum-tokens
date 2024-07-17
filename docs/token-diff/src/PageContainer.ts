import { html, css, LitElement, TemplateResult } from 'lit';
import { Router } from '@vaadin/router';
import './token-diff.js';
import './getting-started.js';

export class PageContainer extends LitElement {
  static styles = css`
    .page {
      display: flex;
      height: 100vh;
      width: 100vw;
    }
    #outlet {
      width: 100vw;
      height: 100vh;
      overflow-y: scroll;
    }
  `;

  firstUpdated() {
    const router = new Router(this.shadowRoot!.querySelector('#outlet'));

    router.setRoutes([
      { path: '/demo', component: 'token-diff' },
      { path: '/getting-started', component: 'getting-started' },
    ]);
  }

  protected override render(): TemplateResult {
    return html`
      <div class="page">
        <nav-bar class="side-bar"></nav-bar>
        <div id="outlet"></div>
      </div>
    `;
  }
}
