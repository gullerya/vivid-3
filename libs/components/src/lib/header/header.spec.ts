import { elementUpdated, fixture, getBaseElement } from '@vivid-nx/shared';
import { Header } from './header';
import '.';

const COMPONENT_TAG = 'vwc-header';

describe('vwc-header', () => {
	let element: Header;

	beforeEach(async () => {
		element = (await fixture(
			`<${COMPONENT_TAG}></${COMPONENT_TAG}>`
		)) as Header;
	});

	describe('basic', () => {
		it('should be initialized as a vwc-header', async () => {
			expect(element).toBeInstanceOf(Header);
			expect(element.alternate).toBeFalsy();
			expect(element.fixed).toBeFalsy();
			expect(element.heading).toBeUndefined();
		});
	});

	describe('fixed', () => {
		it('should add "fixed" class to base and attribute to host when fixed is true', async () => {
			const base = getBaseElement(element);
			const hasClassFixedOnInit = base.classList.contains('fixed');
			element.fixed = true;
			await elementUpdated(element);
			expect(hasClassFixedOnInit).toEqual(false);

			const hasClassFixed = base.classList.contains('fixed');
			expect(hasClassFixed).toEqual(true);
		});
	});

	describe('alternate', () => {
		it('should add "alternate" class to base and attribute to host when alternate is true', async () => {
			const base = getBaseElement(element);
			let hasClassAlternate = base.classList.contains('alternate');
			element.alternate = true;
			await elementUpdated(element);
			expect(hasClassAlternate).toEqual(false);

			hasClassAlternate = base.classList.contains('alternate');
			expect(hasClassAlternate).toEqual(true);
		});
	});

	describe('heading', () => {
		it('should render heading if heading is set', async function () {
			element.heading = 'header';
			await elementUpdated(element);

			const headerContent = element.shadowRoot?.querySelector('.header-content');
			expect(headerContent).toBeTruthy();
		});
	});

	describe('elevated', () => {
		/**
		 * @param scrollDist
		 */
		async function emulateScroll(scrollDist = 50) {
			window['pageYOffset'] = scrollDist;
			window.dispatchEvent(new CustomEvent('scroll'));
			await elementUpdated(element);
		}

		beforeEach(function () {
			element.fixed = true;
		});

		it('should default to no elevation', async function () {
			await elementUpdated(element);
			const base = getBaseElement(element);
			expect(element.elevated).toEqual(false);
			expect(base.classList.contains('elevated')).toEqual(false);
		});

		it('should set "elevated" to true and add "elevated" class when scrolled', async () => {
			const base = getBaseElement(element);
			let hasClassElevated = base.classList.contains('elevated');
			await emulateScroll();
			expect(hasClassElevated).toEqual(false);

			hasClassElevated = base.classList.contains('elevated');
			expect(element.elevated).toEqual(true);
			expect(hasClassElevated).toEqual(true);
		});

		it('should remove elevated state when not fixed', async function () {
			element.fixed = false;
			const base = getBaseElement(element);
			await emulateScroll();
			const hasClassElevated = base.classList.contains('elevated');

			expect(hasClassElevated).toEqual(false);
		});

		it('should remove elevated state when scroll offset is 0', async function () {
			const base = getBaseElement(element);
			await emulateScroll();

			await emulateScroll(0);
			const hasClassElevated = base.classList.contains('elevated');

			expect(hasClassElevated).toEqual(false);
		});

		it('should remove scroll listener after diconnection', async function () {
			const originalElevationState = element._elevated;
			element.disconnectedCallback();
			await emulateScroll();
			expect(element._elevated).toEqual(originalElevationState);
		});
	});

});
