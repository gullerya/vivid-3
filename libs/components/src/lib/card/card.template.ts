import { html, slotted, when } from '@microsoft/fast-element';
import type { ViewTemplate } from '@microsoft/fast-element';
import type {
	ElementDefinitionContext,
	FoundationElementDefinition,
} from '@microsoft/fast-foundation';
import { classNames } from '@microsoft/fast-web-utilities';
import type { Card } from './card';

const getClasses = (_: Card) => classNames(
	'control',
	['hide-footer', !_.footerSlottedContent || !_.footerSlottedContent.length],
	['hide-header', shouldHideHeader(_)]
);

/**
header icon
 */
function renderHeaderIcon() {
	return html<Card>`
	  <vwc-icon class="icon" inline type="${x => x.icon}"></vwc-icon>`;
}

/**
 *
 */
function heading() {
	return html`
		<div class="header-title">${(x) => x.heading}</div>
	`;
}

/**
 *
 */
function subheading() {
	return html`
		<div class="header-subheading">${(x) => x.subheading}</div>
	`;
}

/**
 *
 */
function headerContent() {
	return html`
		<div class="header-content">
			${when(x => x.heading, heading())}
			${when(x => x.subheading, subheading())}
		</div>
	`;
}

/**
 header
 */
function renderHeader() {

	return html<Card>`
		<header class="header">
			<slot name="graphic" ${slotted('graphicSlottedContent')}>${when(x => x.icon, renderHeaderIcon())}</slot>
			${when(x => x.heading || x.subheading, headerContent())}
		</header>`;
}


/**
 * @param card
 */
function shouldHideHeader(card:Card) {
	// eslint-disable-next-line max-len
	return 	!card.heading  && !card.subheading && !card.icon && (!card.graphicSlottedContent || !card.graphicSlottedContent.length);
}

/**
 *
 */
function renderMetaSlot() {
	return html`
		<slot name="meta" ${slotted('metaSlottedContent')}></slot>
	`;
}

/**
 *
 */
function text() {
	return html`
		<div class="text">${(x) => x.text}</div>
	`;
}

/**
 * The template for the {@link @microsoft/fast-foundation#Card} component.
 *
 * @param context
 * @public
 */
export const CardTemplate: (
	context: ElementDefinitionContext,
	definition: FoundationElementDefinition
) => ViewTemplate<Card> = () => html<Card>`
	<vwc-elevation dp=${(x => x.elevation ??  '4')}>
		<div class="${getClasses}">
			<div class="wrapper">
				<div class="vwc-card-media">
					<slot name="media"></slot>
				</div>
				<div class="content">
					<slot name="content">
						<div class="content-container">
							${renderHeader()}
							${renderMetaSlot()}
						</div>
						${when(x => x.text, text())}
					</slot>
				</div>
				<div class="footer">
					<slot name="footer" ${slotted('footerSlottedContent')}></slot>
				</div>
			</div>
		</div>
	</vwc-elevation>
`;