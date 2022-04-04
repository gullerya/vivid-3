import { attr } from '@microsoft/fast-element';
import { FoundationElement } from '@microsoft/fast-foundation';
import { arrow, autoUpdate, computePosition, flip, hide, inline, offset, Placement, Strategy } from '@floating-ui/dom';

/**
 * Base class for popup
 *
 * @public
 */
export class Popup extends FoundationElement {
	private static ARROW_POSITION: any = { top: 'bottom', right: 'left', bottom: 'top', left: 'right' };

	private get PADDING(): number { return 0; }
	private get DISTANCE(): number { return 12; }
	private get STRATEGY(): Strategy { return 'fixed'; }

	popupEl!: HTMLElement;
	arrowEl!: HTMLElement;

	private cleanup?: () => void; // cleans the autoupdate

	private get middleware(): Array<any> {
		const middleware = [flip(), hide(), inline()];
		if (this.arrow) { middleware.push(arrow({ element: this.arrowEl, padding: this.PADDING }), offset(this.DISTANCE)); }
		return middleware;
	}

	/**
	 * indicates whether the popup is open
	 *
	 * @public
	 * HTML Attribute: open
	 */
	@attr({
		mode: 'boolean',
	}) open = false;

	/**
	 * adds close button to the popup
	 *
	 * @public
	 * HTML Attribute: dismissible
	 */
	@attr({
		mode: 'boolean',
	}) dismissible = false;

	/**
	 * adds small triangle to indicate the trigger element
	 *
	 * @public
	 * HTML Attribute: arrow
	 */
	@attr({
		mode: 'boolean',
	}) arrow = false;

	/**
	 * set the color-scheme to dark
	 *
	 * @public
	 * HTML Attribute: alternate
	 */
	@attr({
		mode: 'boolean',
	}) alternate = false;

	/**
	 * the placement of the popup
	 *
	 * @public
	 * HTML Attribute: corner
	 */
	@attr corner?: Placement;

	/**
	 * ID reference to element in the popup’s owner document.
	 *
	 * @public
	 * HTML Attribute: anchor
	 */
	@attr anchor!: string;

	/**
	 * popup's anchor element
	 *
	 * @private
	 */
	@attr private anchorEl: Element | null | undefined;

	constructor() {
		super();
		this.corner = 'left'; // default corner
	}

	override connectedCallback(): void {
		super.connectedCallback();
	}

	override disconnectedCallback(): void {
		super.disconnectedCallback();
		this.cleanup?.();
	}

	override attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
		super.attributeChangedCallback(name, oldValue, newValue);
		switch (name) {
			case 'anchor': {
				this.anchorEl = this.getAnchorById();
				break;
			}
		}
		if (this.anchorEl && this.popupEl) {
			this.cleanup = autoUpdate(this.anchorEl, this.popupEl, () => this.updatePosition());
		}
	}

	/**
	 * Updates popup position, if succeeded returns - true, if not - false
	 *
	 * @public
	 */
	async updatePosition() {
		if (!this.open || !this.anchorEl) {
			return;
		}

		const positionData = await computePosition(this.anchorEl, this.popupEl, {
			placement: this.corner,
			strategy: this.STRATEGY,
			middleware: this.middleware
		});
		this.assignPopupPosition(positionData);
		if (this.arrow) { this.assignArrowPosition(positionData); }
	}

	/**
	 * Opens the popup
	 *
	 * @public
	 */
	show(): void {
		if (this.anchorEl) { // only if anchor element exists
			this.open = true;
		}
	}

	/**
	 * Closes the popup
	 *
	 * @public
	 */
	hide(): void {
		this.open = false;
	}

	handleDismissClick(): void {
		this.hide();
	}

	private assignPopupPosition(data: any): void {
		const { x: popupX, y: popupY } = data;
		const { referenceHidden } = data.middlewareData.hide;
		Object.assign(this.popupEl.style, {
			left: `${popupX}px`,
			top: `${popupY}px`,
			visibility: referenceHidden ? 'hidden' : 'visible',
		});
	}

	private assignArrowPosition(data: any): void {
		const { x: arrowX, y: arrowY } = data.middlewareData.arrow;
		const side: string = Popup.ARROW_POSITION[data.placement.split('-')[0]];
		Object.assign(this.arrowEl.style, {
			left: `${arrowX}px`,
			top: `${arrowY}px`,
			right: '',
			bottom: '',
			[side]: '-4px',
		});
	}

	/**
	 * Gets the anchor element by id
	 */
	private getAnchorById(): HTMLElement | null {
		return document.getElementById(this.anchor);
	}
}
