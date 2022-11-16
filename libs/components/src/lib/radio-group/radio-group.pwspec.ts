import { Orientation } from '@microsoft/fast-web-utilities';
import { expect, test } from '@playwright/test';
import type { Radio } from '../radio/radio';
import type { RadioGroup } from './radio-group';
import type { Locator, Page } from '@playwright/test';
import { loadComponents } from '../../visual-tests/visual-tests-utils.js';

test.describe.configure({ mode: 'parallel' });

test.describe('Radio Group', () => {
	let page: Page;
	let element: Locator;
	let shadowElement: Locator;
	let root: Locator;
	let radios: Locator;
	let shadowRadios: Locator;
	const components = ['radio-group', 'radio'];

	test.beforeAll(async ({ browser }) => {
		page = await browser.newPage();
		root = page.locator('#root');

		element = page.locator('vwc-radio-group');
		shadowElement = page.locator('vwc-radio-group>div');

		radios = element.locator('vwc-radio');
		shadowRadios = element.locator('vwc-radio>span.base');

		await loadComponents({ page, components });
	});

	test.afterAll(async () => {
		await page.close();
	});

	test('should have a role of `radiogroup`', async () => {
		await root.evaluate((node) => {
			node.innerHTML = /* html */ `
				<vwc-radio-group></vwc-radio-group>
			`;
		});

		await expect(element).toHaveAttribute('role', 'radiogroup');
	});

	test('should display a label when given one', async () => {
		const teststring = 'hello';

		await root.evaluate((node, str) => {
			node.innerHTML = /* html */ `
                <vwc-radio-group label="${str}"></vwc-radio-group>
            `;
		}, teststring);

		const label = element.locator('label');
		expect(label).toHaveText(teststring);
	});

	test('should set a matching class on the `positioning-region` when an orientation is provided', async () => {
		await root.evaluate((node) => {
			node.innerHTML = /* html */ `
                <vwc-radio-group></vwc-radio-group>
            `;
		});

		const positioningRegion = element.locator('.positioning-region');

		// Horizontal by default
		await expect(positioningRegion).toHaveClass(/horizontal/);

		await element.evaluate((node: RadioGroup, Orientation) => {
			node.orientation = Orientation.vertical;
		}, Orientation);

		await expect(positioningRegion).toHaveClass(/vertical/);

		await element.evaluate((node: RadioGroup, Orientation) => {
			node.orientation = Orientation.horizontal;
		}, Orientation);

		await expect(positioningRegion).toHaveClass(/horizontal/);
	});

	test('should set the `aria-disabled` attribute when disabled', async () => {
		await root.evaluate((node) => {
			node.innerHTML = /* html */ `
                <vwc-radio-group disabled></vwc-radio-group>
            `;
		});

		await expect(element).toHaveAttribute('aria-disabled', 'true');
	});

	test('should set the `aria-disabled` attribute equal to the `disabled` property', async () => {
		await root.evaluate((node) => {
			node.innerHTML = /* html */ `
                <vwc-radio-group></vwc-radio-group>
            `;
		});

		await expect(element).not.toHaveAttribute('aria-disabled', '');

		await element.evaluate<void, RadioGroup>((node) => {
			node.disabled = true;
		});

		await expect(element).toHaveAttribute('aria-disabled', 'true');

		await element.evaluate<void, RadioGroup>((node) => {
			node.disabled = false;
		});

		await expect(element).toHaveAttribute('aria-disabled', 'false');
	});

	test('should set the `aria-readonly` attribute when the `readonly` attribute is present', async () => {
		await root.evaluate((node) => {
			node.innerHTML = /* html */ `
                <vwc-radio-group readonly></vwc-radio-group>
            `;
		});

		await expect(element).toHaveAttribute('aria-readonly', 'true');
	});

	test('should set the `aria-readonly` attribute equal to the `readonly` property', async () => {
		await root.evaluate((node) => {
			node.innerHTML = /* html */ `
                <vwc-radio-group></vwc-radio-group>
            `;
		});

		await expect(element).not.toHaveAttribute('aria-readonly', '');

		await element.evaluate<void, RadioGroup>((node) => {
			node.readOnly = true;
		});

		await expect(element).toHaveAttribute('aria-readonly', 'true');

		await element.evaluate<void, RadioGroup>((node) => {
			node.readOnly = false;
		});

		await expect(element).toHaveAttribute('aria-readonly', 'false');
	});

	test('should NOT set a default `aria-disabled` value when `disabled` is not defined', async () => {
		await root.evaluate((node) => {
			node.innerHTML = /* html */ `
                <vwc-radio-group></vwc-radio-group>
            `;
		});

		await expect(shadowElement).not.toHaveAttribute('aria-disabled', '');
	});

	test('should set all child radio elements to disabled when the `disabled` attribute is present', async () => {
		await root.evaluate((node) => {
			node.innerHTML = /* html */ `
                <vwc-radio-group disabled>
                    <vwc-radio></vwc-radio>
                    <vwc-radio></vwc-radio>
                    <vwc-radio></vwc-radio>
                </vwc-radio-group>
            `;
		});

		await expect(element).toHaveAttribute('disabled', '');

		expect(
			await radios.evaluateAll<boolean, Radio>((radios) =>
				radios.every((radio) => radio.disabled)
			)
		).toBeTruthy();

		expect(
			await shadowRadios.evaluateAll((radios) =>
				radios.every((radio) => radio.getAttribute('aria-disabled') === 'true')
			)
		).toBeTruthy();
	});

	test('should set tabindex of 0 to a child radio with a matching `value`', async () => {
		await root.evaluate((node) => {
			node.innerHTML = /* html */ `
                <vwc-radio-group value="foo">
                    <vwc-radio value="foo"></vwc-radio>
                    <vwc-radio value="bar"></vwc-radio>
                    <vwc-radio value="baz"></vwc-radio>
                </vwc-radio-group>
            `;
		});

		await expect(radios.nth(0)).toHaveAttribute('tabindex', '0');
	});

	test('should NOT set `tabindex` of 0 to a child radio if its value does not match the radiogroup `value`', async () => {
		await root.evaluate((node) => {
			node.innerHTML = /* html */ `
                <vwc-radio-group value="foo">
                    <vwc-radio value="bar"></vwc-radio>
                    <vwc-radio value="baz"></vwc-radio>
                    <vwc-radio value="qux"></vwc-radio>
                </vwc-radio-group>
            `;
		});

		expect(
			await radios.evaluateAll((radios) =>
				radios.every((radio) => radio.getAttribute('tabindex') === '-1')
			)
		).toBeTruthy();
	});

	test('should set a child radio with a matching `value` to `checked`', async () => {
		await root.evaluate((node) => {
			node.innerHTML = /* html */ `
                <vwc-radio-group value="bar">
                    <vwc-radio value="foo"></vwc-radio>
                    <vwc-radio value="bar"></vwc-radio>
                    <vwc-radio value="baz"></vwc-radio>
                </vwc-radio-group>
            `;
		});

		await expect(shadowRadios.nth(0)).not.toBeChecked();
		await expect(shadowRadios.nth(1)).toBeChecked();
		await expect(shadowRadios.nth(2)).not.toBeChecked();
	});

	test('should set a child radio with a matching `value` to `checked` when value changes', async () => {
		await root.evaluate((node) => {
			node.innerHTML = /* html */ `
                <vwc-radio-group value="foo">
                    <vwc-radio value="foo"></vwc-radio>
                    <vwc-radio value="bar"></vwc-radio>
                    <vwc-radio value="baz"></vwc-radio>
                </vwc-radio-group>
            `;
		});

		await element.evaluate((node: RadioGroup) => {
			node.value = 'bar';
		});

		await expect(shadowRadios.nth(0)).not.toBeChecked();
		await expect(shadowRadios.nth(1)).toBeChecked();
		await expect(shadowRadios.nth(2)).not.toBeChecked();
	});

	test('should mark only the last radio defaulted to checked as checked', async () => {
		await root.evaluate((node) => {
			node.innerHTML = /* html */ `
                <vwc-radio-group>
                    <vwc-radio value="foo" checked></vwc-radio>
                    <vwc-radio value="bar" checked></vwc-radio>
                    <vwc-radio value="baz" checked></vwc-radio>
                </vwc-radio-group>
            `;
		});

		expect(
			await radios.evaluateAll<number, Radio>(
				(radios) => radios.filter((radio) => radio.checked).length
			)
		).toBe(1);

		await expect(shadowRadios.nth(0)).not.toBeChecked();
		await expect(shadowRadios.nth(1)).not.toBeChecked();
		await expect(shadowRadios.nth(2)).toBeChecked();
	});

	test('should mark radio matching value on radio-group over any checked attributes', async () => {
		await root.evaluate((node) => {
			node.innerHTML = /* html */ `
                <vwc-radio-group value="foo">
                    <vwc-radio value="foo"></vwc-radio>
                    <vwc-radio value="bar" checked></vwc-radio>
                    <vwc-radio value="baz"></vwc-radio>
                </vwc-radio-group>
            `;
		});

		expect(
			await radios.evaluateAll<number, Radio>(
				(radios) => radios.filter((radio) => radio.checked).length
			)
		).toBe(1);

		await expect(shadowRadios.nth(0)).toBeChecked();
		await expect(shadowRadios.nth(1)).not.toBeChecked();

		// radio-group explicitly sets non-matching radio's checked to false if
		// a value match was found, but the attribute should still persist.
		expect(
			await radios.nth(1).evaluate((node) => node.hasAttribute('checked'))
		).toBeTruthy();

		await expect(shadowRadios.nth(2)).not.toBeChecked();
	});

	test('should allow resetting of elements by the parent form', async () => {
		await root.evaluate((node) => {
			node.innerHTML = /* html */ `
                <form>
                    <vwc-radio-group>
                        <vwc-radio value="foo"></vwc-radio>
                        <vwc-radio value="bar" checked></vwc-radio>
                        <vwc-radio value="baz"></vwc-radio>
                    </vwc-radio-group>
                </form>
            `;
		});

		const form = page.locator('form');

		await radios.nth(2).evaluate<void, Radio>((node) => {
			node.checked = true;
		});

		await expect(shadowRadios.nth(0)).not.toBeChecked();
		await expect(shadowRadios.nth(1)).not.toBeChecked();
		await expect(shadowRadios.nth(2)).toBeChecked();

		await form.evaluate<void, HTMLFormElement>((node) => {
			node.reset();
		});

		await expect(shadowRadios.nth(0)).not.toBeChecked();
		await expect(shadowRadios.nth(1)).toBeChecked();
		await expect(shadowRadios.nth(2)).not.toBeChecked();
	});

	test('should loop over radio buttons', async () => {
		await root.evaluate((node) => {
			node.innerHTML = /* html */ `
	            <vwc-radio-group value="foo">
	                <vwc-radio value="foo"></vwc-radio>
	                <vwc-radio value="bar" checked></vwc-radio>
	                <vwc-radio value="baz"></vwc-radio>
	            </vwc-radio-group>
	        `;
		});

		await radios.nth(2).click();

		await expect(shadowRadios.nth(0)).not.toBeChecked();
		await expect(shadowRadios.nth(1)).not.toBeChecked();
		await expect(shadowRadios.nth(2)).toBeChecked();

		await page.keyboard.press('ArrowRight');

		await expect(shadowRadios.nth(0)).toBeChecked();
		await expect(shadowRadios.nth(1)).not.toBeChecked();
		await expect(shadowRadios.nth(2)).not.toBeChecked();
	});

	test('should receive the value of the radio that was clicked', async () => {
		await root.evaluate((node) => {
			node.innerHTML = /* html */ `
				<vwc-radio-group>
					<vwc-radio value="0"></vwc-radio>
					<vwc-radio value="1"></vwc-radio>
					<vwc-radio value="2"></vwc-radio>
				</vwc-radio-group>
			`;
		});

		await radios.nth(1).click();

		await expect(radios.nth(1)).toHaveAttribute('tabindex', '0');
		await expect(element).toHaveAttribute('value', '1');
	});

	test('should update when arrows are used', async () => {
		await root.evaluate((node) => {
			node.innerHTML = /* html */ `
					<vwc-radio-group>
						<vwc-radio value="0"></vwc-radio>
						<vwc-radio value="1"></vwc-radio>
						<vwc-radio value="2" checked></vwc-radio>
					</vwc-radio-group>
				`;
		});

		await radios.nth(0).click();
		await page.keyboard.press('ArrowRight');

		await expect(shadowRadios.nth(0)).not.toBeChecked();
		await expect(shadowRadios.nth(1)).toBeChecked();
		await expect(shadowRadios.nth(2)).not.toBeChecked();
	});
});
