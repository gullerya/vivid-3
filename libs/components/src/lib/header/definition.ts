import type { FoundationElementDefinition } from '@microsoft/fast-foundation';
import { registerFactorial } from '../../shared/design-system';
import { elevationElements } from '../elevation/definition';
import styles from './header.scss';
import { Header } from './header';
import { headerTemplate as template } from './header.template';


/**
 * The header element.
 *
 * @internal
 */
export const header = Header.compose<FoundationElementDefinition>({
	baseName: 'header',
	template: template as any,
	styles,
})();

export const headerElements = [header, ...elevationElements];

/**
 * Registers the header elements with the design system.
 *
 * @param prefix - the prefix to use for the component name
 */
export const registerHeader = registerFactorial(headerElements);
