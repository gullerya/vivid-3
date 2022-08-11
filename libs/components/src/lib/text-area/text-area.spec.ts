import {fixture} from '@vivid-nx/shared';
import { TextArea } from './text-area';
import '.';

const COMPONENT_TAG_NAME = 'vwc-text-area';

// function getRootElement(element: TextArea) {
// 	return element.shadowRoot?.querySelector('.base') as HTMLElement;
// }
//
// function getTextareaElement(element: TextArea) {
// 	return element.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
// }

describe('vwc-text-area', () => {
	let element: TextArea;

	beforeEach(async () => {
		element = (await fixture(
			`<${COMPONENT_TAG_NAME}></${COMPONENT_TAG_NAME}>`
		)) as TextArea;
	});

	describe('basic', () => {
		it('should be initialized as a vwc-text-field', async () => {
			expect(element)
				.toBeInstanceOf(TextArea);
		});
	});

	/*describe('label', function () {
		it('should set a label if label is set', async function () {
			const labelText = 'label';
			element.label = labelText;
			await elementUpdated(element);
			const labelElement = element.shadowRoot?.querySelector('label');
			expect(labelElement)
				.toBeTruthy();
			expect(labelElement?.textContent?.trim())
				.toEqual(labelText);
		});

		it('should show label only if label is set', async function () {
			const labelElement = element.shadowRoot?.querySelector('label');
			expect(labelElement)
				.toBeNull();
		});
	});

	describe('readOnly', function () {
		it('should add class readonly to host', async function () {
			const readonlyClassWhenFalse = getRootElement(element)
				.classList
				.contains('readonly');
			element.readOnly = true;
			await elementUpdated(element);
			const readonlyClassWhenTrue = getRootElement(element)
				.classList
				.contains('readonly');
			expect(readonlyClassWhenFalse)
				.toEqual(false);
			expect(readonlyClassWhenTrue)
				.toEqual(true);
		});
	});

	describe('autofocus', function () {
		it('should set autofocus on the textarea element', async function () {
			element.autofocus = true;
			await elementUpdated(element);
			expect(getTextareaElement(element).hasAttribute('autofocus'))
				.toEqual(true);
		});
	});

	describe('placeholder', function () {
		const placeholderText = 'Text';
		it('should set placeholder attribute on the textarea', async function () {

			element.placeholder = placeholderText;
			await elementUpdated(element);
			expect(getTextareaElement(element).getAttribute('placeholder'))
				.toEqual(placeholderText);
		});

		it('should set class placeholder to root', async function () {
			element.placeholder = placeholderText;
			await elementUpdated(element);
			expect(getRootElement(element)
				.classList
				.contains('placeholder'))
				.toEqual(true);
		});
	});

	describe('rows', function () {
		const value = '8';
		const propertyName = 'rows';

		it('should set rows attribute on the textarea', async function () {

			(element as any)[propertyName] = value;
			await elementUpdated(element);
			expect(getTextareaElement(element).getAttribute(propertyName))
				.toEqual(value);
		});
	});

	describe('cols', function () {
		const value = '2';
		const propertyName = 'cols';

		it('should set minlength attribute on the textarea', async function () {

			(element as any)[propertyName] = value;
			await elementUpdated(element);
			expect(getTextareaElement(element).getAttribute(propertyName))
				.toEqual(value);
		});
	});

	describe('form association', function () {
		let fieldValue: string,
			formId: string,
			fieldName: string,
			formWrapper: HTMLElement;

		beforeEach(function () {
			fieldValue = 'field-value';
			fieldName = 'test-field';
			formId = 'test-form-id';
			formWrapper = document.createElement('div');
			document.body.appendChild(formWrapper);
		});

		afterEach(function () {
			formWrapper.remove();
		});

		it('should attach to closest form', async function () {
			const {form: formElement} = createFormHTML<TextArea>({
				componentTagName: COMPONENT_TAG_NAME,
				fieldName,
				fieldValue,
				formId,
				formWrapper
			});

			const submitPromise = listenToFormSubmission(formElement);
			formElement.requestSubmit();

			(await submitPromise).forEach((formDataValue, formDataKey) => {
				expect(formDataKey)
					.toEqual(fieldName);
				expect(formDataValue)
					.toEqual(fieldValue);
			});
		});

		it('should attach to form when given form id', async function () {
			const {otherForm} = createFormHTML<TextArea>(
				{
					fieldName, fieldValue, formId, otherFormId: 'otherFormId', componentTagName: COMPONENT_TAG_NAME, formWrapper
				});

			const submitPromise = listenToFormSubmission(otherForm);
			otherForm.requestSubmit();

			(await submitPromise).forEach((formDataValue, formDataKey) => {
				expect(formDataKey)
					.toEqual(fieldName);
				expect(formDataValue)
					.toEqual(fieldValue);
			});
		});

		it('should reset the value of the custom element to default on form reset', async function () {
			const {
				form: formElement,
				element
			} = createFormHTML<TextArea>({
				fieldName,
				fieldValue,
				formId,
				componentTagName: COMPONENT_TAG_NAME,
				formWrapper
			});

			element.value = '5';
			formElement.reset();
			await elementUpdated(element);

			expect(element.value)
				.toEqual(fieldValue);
		});
	});

	describe('events', function () {
		it('should emit an input event', async function () {
			const inputPromise = new Promise(res => element.addEventListener('input', () => res(true)));
			const innerInput = getTextareaElement(element);
			innerInput.dispatchEvent(new InputEvent('input', {
				bubbles: true,
				composed: true
			}));
			expect(await inputPromise)
				.toEqual(true);
		});

		it('should emit a change event', async function () {
			const inputPromise = new Promise(res => element.addEventListener('change', () => res(true)));
			const innerInput = getTextareaElement(element);
			innerInput.dispatchEvent(new InputEvent('change', {
				bubbles: true,
				composed: true
			}));
			expect(await inputPromise)
				.toEqual(true);
		});
	});

	describe('helper text', function () {
		it('should render the helper text when attribute is set', async function () {
			const helperTextElementWithoutText = element.shadowRoot?.querySelector('.helper-text');
			const helperText = 'Helper Text';
			element.helperText = helperText;
			await elementUpdated(element);
			expect(helperTextElementWithoutText)
				.toBeNull();
			expect(element.shadowRoot?.querySelector('.helper-text')
				?.textContent
				?.trim())
				.toEqual(helperText);
		});
	});

	describe('error message', function () {
		/!**
		 *
		 *!/
		function setToBlurred() {
			element.dispatchEvent(new Event('blur'));
		}

		/!**
		 *
		 *!/
		function setToFocused() {
			element.dispatchEvent(new Event('focus'));
		}

		/!**
		 * @param errorMessage
		 *!/
		function setValidityToError(errorMessage = 'error') {
			element.setValidity({badInput: true}, errorMessage);
			element.validate();
		}

		it('should add class error to base if not valid', async function () {
			element.dirtyValue = true;
			setToBlurred();
			setValidityToError('blah');
			await elementUpdated(element);

			expect(getRootElement(element)
				.classList
				.contains('error'))
				.toEqual(true);
		});

		it('should render the error message when not valid', async function () {
			const errorElementWithoutText = element.shadowRoot?.querySelector('.error-message');
			const errorMessage = 'Error Text';

			element.dirtyValue = true;
			setToBlurred();
			setValidityToError(errorMessage);
			await elementUpdated(element);

			expect(errorElementWithoutText)
				.toBeNull();
			expect(element.shadowRoot?.querySelector('.error-message')
				?.textContent
				?.trim())
				.toEqual(errorMessage);
		});

		it('should render the error message only after a blur', async function() {
			const errorMessage = 'Error Text';
			element.dirtyValue = true;
			setValidityToError(errorMessage);
			await elementUpdated(element);
			expect(element.shadowRoot?.querySelector('.error-message')).toBeNull();
		});

		it('should replace helper text', async function () {
			element.helperText = 'helper text';
			element.dirtyValue = true;
			setToBlurred();
			setValidityToError();
			await elementUpdated(element);
			expect(element.shadowRoot?.querySelector('.helper-text'))
				.toBeNull();
		});

		it('should set error message to empty string when pristine', async function () {
			setValidityToError();
			await elementUpdated(element);
			expect(element.errorValidationMessage)
				.toEqual('');
		});

		it('should validate after a blur', async function () {
			const errorMessage = 'Error Text';
			element.dirtyValue = true;
			setValidityToError(errorMessage);
			setToBlurred();
			await elementUpdated(element);
			expect(element.shadowRoot?.querySelector('.error-message')?.
			textContent?.trim()).toEqual(errorMessage);
		});

		it('should update error message when blurred', async function() {
			setToBlurred();
			const errorMessage = 'Error Text';
			const errorMessageTwo = 'Error Text 2';
			element.dirtyValue = true;
			setValidityToError(errorMessage);
			await elementUpdated(element);

			setValidityToError(errorMessageTwo);
			await elementUpdated(element);

			expect(element.shadowRoot?.querySelector('.error-message')?.
			textContent?.trim()).toEqual(errorMessageTwo);
		});

		it('should change the error message only when already not valid', async function() {
			setToBlurred();
			setToFocused();
			const errorMessage = 'Error Text';
			element.dirtyValue = true;
			setValidityToError(errorMessage);
			await elementUpdated(element);

			expect(element.shadowRoot?.querySelector('.error-message')).toBeNull();
		});
	});

	describe('disabled', function () {
		it('should set disabled class when attribute is set', async function () {
			const disabledClassWhenEnabled = getRootElement(element)
				.classList
				.contains('disabled');
			element.disabled = true;
			await elementUpdated(element);
			const disabledClassWhenDisabled = getRootElement(element)
				.classList
				.contains('disabled');
			expect(disabledClassWhenEnabled)
				.toEqual(false);
			expect(disabledClassWhenDisabled)
				.toEqual(true);
		});
	});

	describe('value', function () {
		it('should set \'has-value\' class when there is a value', async function () {
			const activeClassWhenEnabled = getRootElement(element)
				.classList
				.contains('has-value');
			element.value = '5';
			await elementUpdated(element);
			const activeClassWhenDisabled = getRootElement(element)
				.classList
				.contains('has-value');
			expect(activeClassWhenEnabled)
				.toEqual(false);
			expect(activeClassWhenDisabled)
				.toEqual(true);
		});
	});

	describe('density', function () {
		it('should set the size class on the root', async function () {
			const density = 'dense';
			element.setAttribute('density', density);
			await elementUpdated(element);

			expect(getRootElement(element)
				.classList
				.contains('density-dense'))
				.toEqual(true);
		});
	});

	describe('autocomplete', function () {
		it('should set autocomplete on the internal input', async function () {
			const internalInput = getTextareaElement(element);
			const autoCompleteDefault = internalInput.getAttribute('autocomplete');

			element.autoComplete = 'off';
			await elementUpdated(element);
			expect(autoCompleteDefault).toBeNull();
			expect(internalInput.getAttribute('autocomplete')).toEqual('off');

		});

		it('should reflect the name on the internal input', async function () {
			const internalInput = getTextareaElement(element);
			element.name = 'off';
			await elementUpdated(element);
			expect(internalInput.getAttribute('name')).toEqual('off');
		});
	});*/
});
