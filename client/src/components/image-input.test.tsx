import React from 'react';
import { render, fireEvent, waitForElement } from '@testing-library/react';

import { FormRow } from './form-row';
import { ImageInput } from './image-input';

const image =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAYGBgYHBgcICAcKCwoLCg8ODAwODx' +
  'YQERAREBYiFRkVFRkVIh4kHhweJB42KiYmKjY+NDI0PkxERExfWl98fKcBBgYGBgcGBwgIBwoL' +
  'CgsKDw4MDA4PFhAREBEQFiIVGRUVGRUiHiQeHB4kHjYqJiYqNj40MjQ+TERETF9aX3x8p//CAB' +
  'EIAAUABQMBIgACEQEDEQH/xAAUAAEAAAAAAAAAAAAAAAAAAAAG/9oACAEBAAAAAEX/xAAUAQEA' +
  'AAAAAAAAAAAAAAAAAAAC/9oACAECEAAAAF//xAAUAQEAAAAAAAAAAAAAAAAAAAAC/9oACAEDEA' +
  'AAAH//xAAdEAACAQQDAAAAAAAAAAAAAAABAgMABAUREzEy/9oACAEBAAE/AHyHBk7oLFpWiiIR' +
  'TpV9dV//xAAYEQACAwAAAAAAAAAAAAAAAAAAAQIRgf/aAAgBAgEBPwCKVaz/xAAYEQACAwAAAA' +
  'AAAAAAAAAAAAAAAQIxgf/aAAgBAwEBPwCV4j//2Q==';
const imageName = 'test.jpg';
const blob = Buffer.from(image);
const imageFile = new File([blob], 'image.jpg');
Object.defineProperties(imageFile, {
  type: {
    get: () => 'image/jpeg',
  },
  name: {
    get: () => imageName,
  },
});

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
