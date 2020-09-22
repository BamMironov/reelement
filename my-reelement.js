import { html, css } from 'lit-element';

import { declareAction, declareAtom } from '@reatom/core'

import ReElement from './reelement';

const increment = declareAction();
const countAtom = declareAtom(1, on => [
    on(increment, state => state + 1),
  ])

const properties = {
    name: { type: String },
}

const styles = css`
    :host {
        display: block;
        border: solid 1px gray;
        padding: 16px;
        max-width: 800px;
    }
`;

function MyReElement({ name = 'User' }, hooks) {
    const { useAtom, useAction } = hooks;

    let count = useAtom(countAtom);
    let onClick = useAction(increment);

    return html`
      <h1>Hello, ${name}!</h1>
      <button @click=${onClick} part="button">
        Click Count: ${count}
      </button>
      <slot></slot>
    `;
}


window.customElements.define(
    'my-reelement',
    ReElement(MyReElement, {
        styles,
        properties,
    })
);