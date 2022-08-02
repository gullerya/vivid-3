import { elementUpdated, fixture, getBaseElement } from '@vivid-nx/shared';
import { Icon } from '../icon/icon';
import { SidenavDisclosure } from './sidenav-disclosure';
import '.';

const COMPONENT_TAG = 'vwc-sidenav-disclosure';
const ICON_SELECTOR = 'vwc-icon';

describe('vwc-sidenav-disclosure', () => {
	let element: SidenavDisclosure;

	beforeEach(async () => {
		element = (await fixture(
			`<${COMPONENT_TAG}></${COMPONENT_TAG}>`
		)) as SidenavDisclosure;
	});

	describe('basic', () => {
		it('should be initialized as a vwc-sidenav-disclosure', async () => {
			expect(element).toBeInstanceOf(SidenavDisclosure);
			expect(element.label).toEqual(undefined);
			expect(element.icon).toBeUndefined();
			expect(element.open).toBeFalsy();
		});
	});

	describe('open', () => {
		it('should open the sidenav disclosure', async () => {
			expect(getBaseElement(element).hasAttribute('open')).toBeFalsy();

			element.open = true;
			await elementUpdated(element);
			expect(getBaseElement(element).hasAttribute('open')).toBeTruthy();
		});
	});

	describe('icon', () => {
		it('should add an icon to the sidenav disclosure', async () => {
			element.icon = 'home';
			await elementUpdated(element);

			const icon = element.shadowRoot?.querySelector(ICON_SELECTOR) as Icon;
			expect(icon)
				.toBeInstanceOf(Icon);
			expect(icon?.type)
				.toEqual('home');
		});
	});

	describe('label', () => {
		it('should set label property value as text content', async () => {
			const label = 'lorem';
			element.label = label;
			await elementUpdated(element);
			
			expect(getBaseElement(element).textContent?.trim())
				.toEqual(label);
		});
	});
});
