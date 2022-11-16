import { elementUpdated, fixture, listenToFormSubmission } from '@vivid-nx/shared';
import { configureAxe, toHaveNoViolations } from 'jest-axe';
import type { Radio } from '../radio/radio';
import { RadioGroup } from './radio-group';
import '../radio';
import '.';

const COMPONENT_TAG = 'vwc-radio-group';

describe('vwc-radio-group', () => {
	let element: RadioGroup;
	let radios: Radio[];

	expect.extend(toHaveNoViolations);
	const axe = configureAxe({
		rules: {
			'region': { enabled: false }
		}
	});

	beforeEach(async () => {
		element = fixture(`
			<${COMPONENT_TAG}>
				<vwc-radio value="0" label="one"></vwc-radio>
				<vwc-radio value="1" label="two"></vwc-radio>
				<vwc-radio value="2" label="three"></vwc-radio>
			</${COMPONENT_TAG}>
		`) as RadioGroup;
		await elementUpdated(element);
		radios = Array.from(element.children) as Radio[];
	});

	it('should be initialized as a vwc-radio-group with proper default values', async () => {
		expect(element).toBeInstanceOf(RadioGroup);
		expect(element.readOnly).toBeFalsy();
		expect(element.disabled).toBeFalsy();
		expect(element.label).toBeUndefined();
		expect(element.orientation).toEqual('horizontal');
		expect(element.getAttribute('value')).toBeNull();
	});

	describe('axe a11y', () => {
		it('should make sure the markup is validated by Axe', async () => {
			expect(await axe(element)).toHaveNoViolations();
		});
	});

	describe('form', () => {
		it('should behave as a radio group in a form', async () => {
			const form = document.createElement('form');
			form.onsubmit = () => false;
			form.appendChild(element);
			document.body.replaceChildren(form);

			element.name = 'chosenValue';
			radios[2].checked = true;

			const submitPromise = listenToFormSubmission(form);
			form.requestSubmit();
			const result = await submitPromise;

			expect(result.get(element.name)).toEqual('2');
		});
	});
});
