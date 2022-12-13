import {html, when} from '@microsoft/fast-element';
import type { ViewTemplate } from '@microsoft/fast-element';
import type {
	ElementDefinitionContext,
	FoundationElementDefinition,
} from '@microsoft/fast-foundation';
import { classNames } from '@microsoft/fast-web-utilities';
import { affixIconTemplateFactory } from '../../shared/patterns/affix';
import type { Avatar } from './avatar';

const getClasses = ({appearance, connotation, shape, size}: Avatar) => classNames(
	'base',
	[`connotation-${connotation}`, Boolean(connotation)],
	[`appearance-${appearance}`, Boolean(appearance)],
	[`shape-${shape}`, Boolean(shape)],
	[`size-${size}`, Boolean(size)],
);


/**
 avatar initials
 */
function renderInitials() {
	return html<Avatar>`
		<span class="initials">${ ({ name }) => name!.substring(0, 2) }</span>
	`;
}

/**
 * The template for the {@link @microsoft/fast-foundation#Avatar} component.
 *
 * @param context
 * @public
 */
export const AvatarTemplate: (
	context: ElementDefinitionContext,
	definition: FoundationElementDefinition
) => ViewTemplate<Avatar> = (
	context: ElementDefinitionContext,
) => {
	const affixIconTemplate = affixIconTemplateFactory(context);
	return html`
	<span class="${getClasses}">
		<slot name="graphic">
			${when(x => x.name, renderInitials())}
			${when( x => !x.name, html`${x => affixIconTemplate(x.icon ? `${x.icon}` : 'user-line')}`)}
		</slot>
</span>`;
};
