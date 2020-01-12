import React from 'react';
import { render, fireEvent, waitForElement } from '@testing-library/react';

import { imageFile, imageName } from '../test-helper';
import { FormRow } from './form-row';
import { ImageInput } from './image-input';

const noop = () => void 0;

const renderInput = ({ onChange = noop, onReset = noop }) => {
  const result = render(
    <FormRow id="test" label="File">
      <ImageInput
        id="test"
        name="test"
        onChange={onChange}
        onReset={onReset}
        disabled={false}
        hasError={false}
      />
    </FormRow>
  );
  const input = result.getByLabelText('File') as HTMLInputElement;

  Object.defineProperty(input, 'files', {
    get: () => [imageFile],
  });
  fireEvent.change(input);

  return result;
};

it('shows the image preview', async () => {
  const handleChange = jest.fn();
  const { getByText, getByRole } = renderInput({
    onChange: handleChange,
  });

  await waitForElement(() => getByText('×'));
  await waitForElement(() => getByRole('presentation'));

  expect(handleChange).toHaveBeenCalled();
  expect(handleChange.mock.calls[0][0]).toBe(null);
  expect(handleChange.mock.calls[0][1]).toBe(imageName);
  expect(handleChange.mock.calls[0][2]).toBeDefined();

  const { src } = getByRole('presentation') as HTMLImageElement;
  expect(src.startsWith('data:;base64,')).toBe(true);
});

it('removes the preview', async () => {
  const handleReset = jest.fn();
  const { getByText, getByRole } = renderInput({
    onReset: handleReset,
  });

  await waitForElement(() => getByText('×'));

  fireEvent.click(getByText('×'));

  expect(handleReset).toHaveBeenCalled();

  expect(() => getByText('×')).toThrow();
  expect(() => getByRole('presentation')).toThrow();
});
