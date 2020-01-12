import React from 'react';
import { render, fireEvent, waitForElement, act } from '@testing-library/react';

import { imageFile, createApiScope, createUploadScope } from './test-helper';
import App from './app';

const timeout = async (ms: number) =>
  new Promise((resolve: () => void) => setTimeout(resolve, ms));

it('uploads an image', async () => {
  const { getByText, getByLabelText, getByTestId } = render(<App />);
  const submit = getByText('Submit') as HTMLButtonElement;
  const input = getByLabelText('File') as HTMLInputElement;

  Object.defineProperty(input, 'files', {
    get: () => [imageFile],
  });
  createApiScope();
  createUploadScope();

  fireEvent.change(input);
  fireEvent.change(getByLabelText('Title'), {
    target: { value: 'Test' },
  });
  fireEvent.change(getByLabelText('Tags'), {
    target: { value: 'lorem, ipsum, dolor' },
  });
  fireEvent.change(getByLabelText('Alt-Text'), {
    target: { value: 'Nothing to see here.' },
  });
  fireEvent.change(getByLabelText('Description'), {
    target: { value: 'void' },
  });
  await act(async () => void (await timeout(10)));

  expect(submit.disabled).toBe(false);

  fireEvent.click(submit);

  await waitForElement(() => getByTestId('progress'));
  await act(async () => void (await timeout(200)));

  expect(() => getByTestId('progress')).toThrow();
});
