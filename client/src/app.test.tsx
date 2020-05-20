import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import type { AssetArgs, EntryArgs } from 'contentful-management';

import { imageFile } from './test-helper';
import App from './app';

jest.mock('contentful-management', () => {
  const SPACE_ID = 'space_id';
  const ACCESS_TOKEN = 'access_token';
  const CF_ENV = 'staging';
  const ASSET_ID = 'asset-123';

  const item = { publish: () => void 0, sys: { id: ASSET_ID } };
  const processForLocale = (locale: string) => {
    expect(locale).toBe('en-US');
    return item;
  };
  const tmpAsset = { processForLocale };
  const createAssetFromFiles = (args: AssetArgs) => {
    expect(args.fields.title['en-US'].length).toBeGreaterThan(0);
    expect(args.fields.description['en-US'].length).toBeGreaterThan(0);
    expect(args.fields.file['en-US'].fileName.length).toBeGreaterThan(0);
    expect(args.fields.file['en-US'].contentType).toBe('image/jpg');
    return tmpAsset;
  };
  const createEntry = (_type: 'image', args: EntryArgs) => {
    expect(args.fields.title['en-US'].length).toBeGreaterThan(0);
    expect(args.fields.tags['en-US'].length).toBeGreaterThan(0);
    expect(args.fields.file['en-US'].sys.id).toBe(ASSET_ID);
    return item;
  };
  const env = { createAssetFromFiles, createEntry };
  const getEnvironment = (envName: string) => {
    expect(envName).toBe(CF_ENV);
    return env;
  };
  const space = { getEnvironment };
  const getSpace = (spaceId: string) => {
    expect(spaceId).toBe(SPACE_ID);
    return space;
  };
  const client = { getSpace };
  const createClient = ({ accessToken }: { accessToken: string }) => {
    expect(accessToken).toBe(ACCESS_TOKEN);
    return client;
  };

  return { createClient };
});

const timeout = async (ms: number) =>
  new Promise((resolve: () => void) => setTimeout(resolve, ms));

it('uploads an image', async () => {
  const onSubmitError = jest.fn();
  const { getByText, getByLabelText, getByTestId, queryByTestId } = render(
    <App onSubmitError={onSubmitError} />
  );
  const submit = getByText('Submit') as HTMLButtonElement;
  const input = getByLabelText('File') as HTMLInputElement;

  Object.defineProperty(input, 'files', {
    get: () => [imageFile],
  });

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

  await waitFor(() => queryByTestId('progress'));
  await act(async () => void (await timeout(200)));

  expect(() => getByTestId('progress')).toThrow();
  expect(onSubmitError).not.toHaveBeenCalled();
});
