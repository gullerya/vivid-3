import {html, when} from '@microsoft/fast-element';
import type { ViewTemplate } from '@microsoft/fast-element';
import type {
	ElementDefinitionContext,
	FoundationElementDefinition,
} from '@microsoft/fast-foundation';
import { classNames } from '@microsoft/fast-web-utilities';
import type { Avatar } from './avatar';

const getClasses = ({appearance, connotation, shape, size}: Avatar) => classNames(
	'base',
	[`connotation-${connotation}`, Boolean(connotation)],
	[`appearance-${appearance}`, Boolean(appearance)],
	[`shape-${shape}`, Boolean(shape)],
	[`size-${size}`, Boolean(size)],
);

/**
 * avatar icon
 * 
 * @returns {HTMLElement} template
 */
function renderIcon() {
	return html<Avatar>`
		<span class="icon">
			<vwc-icon name="${(x) => x.icon? `${x.icon}` : 'user-line'}"></vwc-icon>
		</span>
	`;
}


/**
 * avatar initials
 * 
 * @returns {HTMLElement} template
 */
function renderInitials() {
	return html<Avatar>`
		<span class="initials">${ ({ name }) => name?.substring(0, 2) }</span>
	` ?? html<Avatar>``;
}

/**
 * The template for the {@link @microsoft/fast-foundation#Avatar} component.
 *
 * @returns {HTMLElement} template
 */
export const AvatarTemplate: (
	context: ElementDefinitionContext,
	definition: FoundationElementDefinition
) => ViewTemplate<Avatar> = () => html`
	<span class="${getClasses}">
		<slot>
			${when(x => x.name, renderInitials())}
			${when( x => !x.name, renderIcon())}
		</slot>
</span>`;
