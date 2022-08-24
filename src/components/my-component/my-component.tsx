import { Component, Prop, h } from '@stencil/core';
import { format } from '../../utils/utils';

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css',
  shadow: true
})
export class MyComponent {
  /**
   * The first name
   */
  @Prop() first: string;

  /**
   * The middle name
   */
  @Prop() middle: string;

  /**
   * The last name
   */
  @Prop() last: string;

  private getText(): string {
    return format(this.first, this.middle, this.last);
  }

  private slotChange() {
    console.log('my slot has changed');
  }

  render() {
    return (
      <div>
        <div>Hello, World! I'm {this.getText()}</div>
        <div>
          <p>A slot will go here...</p>
          <slot onSlotchange={() => this.slotChange()}></slot>
        </div>
        <button class="fr-btn">{this.getText()}</button>
      </div>
    );
  }
}