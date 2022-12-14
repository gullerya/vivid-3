import {html, when} from '@microsoft/fast-element';
import type {ViewTemplate} from '@microsoft/fast-element';
import type {
	ElementDefinitionContext,
	FoundationElementDefinition,
} from '@microsoft/fast-foundation';
import {classNames} from '@microsoft/fast-web-utilities';
import {affixIconTemplateFactory} from '../../shared/patterns/affix';
import type {Dialog} from './dialog';

const getClasses = ({iconPlacement}: Dialog) => classNames(
	'base',
	[`icon-placement-${iconPlacement}`, Boolean(iconPlacement)],
);



/**
 *
 */
function headline() {
	return html<Dialog>`
	  <div class="headline">
		  ${x => x.headline}
	  </div>
	`;
}


/**
 *
 */
function renderDismissButton() {
	return html<Dialog>`
	  <vwc-button
			  size="condensed"
			  class="dismiss-button"
			  icon="close-line"
			  @click="${x => {
		x.open = false;
	}}">
	  </vwc-button>`;
}

/**
 * @param dialog
 * @param event
 */
function handleEscapeKey(dialog: Dialog, event: Event) {
	if ((event as KeyboardEvent).key === 'Escape' && dialog.modal) {
		dialog.open = false;
	}
}

/**
 *
 */
function content() {
	return html<Dialog>`
	  <div class="content">
		  ${x => x.text}
	  </div>
	`;
}
/**
 * The template for the {@link @microsoft/fast-foundation#Dialog} component.
 *
 * @param context
 * @public
 */
export const DialogTemplate: (
	context: ElementDefinitionContext,
	definition: FoundationElementDefinition
) => ViewTemplate<Dialog> = (
	context: ElementDefinitionContext,
) => {
	const affixIconTemplate = affixIconTemplateFactory(context);
	return html<Dialog>`
	<vwc-elevation dp="12">
		<div>
			<dialog class="${getClasses}"
					@keydown="${(x, c) => handleEscapeKey(x, c.event)}"
					returnValue="${x => x.returnValue}"
					aria-labelledby="${x => x.ariaLabelledBy}"
					aria-label="${x => x.ariaLabel}"
					aria-describedby="${x => x.ariaDescribedBy}"
			>
				<slot name="main">
					<div class="main-wrapper">
						<div class="header">
							<div class="headline-wrapper">
								<slot name="graphic">
									${when( x => x.icon, html`${x => affixIconTemplate(x.icon)}`)}
								</slot>
								${when(x => x.headline, headline())}
							</div>
						${renderDismissButton()}
						</div>
						<slot name="content">
							${when(x => x.text, content())}
						</slot>
						<slot name="footer"></slot>
					</div>
				</slot>
			</dialog>
		</div>
	</vwc-elevation>`;
};

