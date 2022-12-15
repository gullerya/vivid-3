import { icon } from '../../lib/icon/definition';
import { badge } from '../../lib/badge/definition';
import { registerFactorial } from '.';

describe('design system', () => {
	it('should register with custom prefix instead of default', async () => {
		const elementsDefintions = [badge, icon];
		const registerBadge = registerFactorial(elementsDefintions);
		const defaultPrefix = 'vwc';
		const customPrefix = 'dashboard';

		registerBadge(customPrefix);

		await Promise.all(
			elementsDefintions.map(({ definition }) =>
				customElements.whenDefined(`${customPrefix}-${definition.baseName}`)
			));

		elementsDefintions.forEach(({ definition }) => {
			expect(customElements.get(`${customPrefix}-${definition.baseName}`)).toBeDefined();
			expect(customElements.get(`${defaultPrefix}-${definition.baseName}`)).toBeUndefined();
		});
	});

	it('should register a component along with its integrated components', async () => {
		const elementsDefintions = [badge, icon];
		const registerBadge = registerFactorial(elementsDefintions);
		const defaultPrefix = 'vwc';

		registerBadge();

		await Promise.all(
			elementsDefintions.map(({ definition }) =>
				customElements.whenDefined(`${defaultPrefix}-${definition.baseName}`)
			));

		elementsDefintions.forEach(({ definition }) => {
			expect(customElements.get(`${defaultPrefix}-${definition.baseName}`)).toBeDefined();
		});
	});
});
