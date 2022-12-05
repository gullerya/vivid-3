import type { FoundationElementDefinition } from '@microsoft/fast-foundation';
import { designSystem, getPrefix } from '../../shared/design-system';
import styles from './accordion.scss';

import { Accordion } from './accordion';
import { AccordionTemplate as template } from './accordion.template';

export const vividAccordion = Accordion.compose<FoundationElementDefinition>({
	baseName: 'accordion',
	template: template as any,
	styles,
});

designSystem.withPrefix(getPrefix(import.meta.url)).register(vividAccordion());
