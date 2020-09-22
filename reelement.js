import { LitElement } from 'lit-element';
import { createStore } from '@reatom/core';

const store = createStore();

function createHooks(component) {
    let { _subscriptions } = component;

    return {
        useAtom(atom) {
            if (!_subscriptions.has(atom)) {
                _subscriptions.set(
                    atom, store.subscribe(atom, () => component.requestUpdate())
                )
            }

            return store.getState(atom);
        },
        useAction(action) {
            return (params) => store.dispatch(action(params));
        }
    }
}

export default function ReElement(functionalComponent, options) {
    class ComponentClass extends LitElement {
        _subscriptions = new Map();
        _hooks = createHooks(this);

        disconnectedCallback() {
            this._subscriptions.forEach(cleanup => cleanup());
            this._subscriptions.clear();
        }

        render() {
            return functionalComponent(this, this._hooks)
        }
    }

    ComponentClass.styles = options.styles;
    ComponentClass.properties = options.properties;

    return ComponentClass;
}