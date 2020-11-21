import React from 'react';
import { createClient } from 'contentful-management';

import { Layout } from './components/layout';
import {
  Form,
  hasRequiredPayload,
  SubmitPayload,
  UpldateLoadingStateFunction,
} from './components/form';

interface Props {
  onSubmitError?: (err: unknown) => void;
}

const { SPACE_ID, ACCESS_TOKEN, CF_ENV } = window.photoblogUploadClient;

// tslint:disable:next-line no-suspicious-comment
// TODO: handle submit error 4 realz
const App: React.SFC<Props> = ({ onSubmitError = () => void 0 }) => {
  const handleSubmit = async (
    updateLoadingState: UpldateLoadingStateFunction,
    args?: SubmitPayload
  ): Promise<void> | never => {
    if (!hasRequiredPayload(args)) {
      throw Error('Missing arguments.');
    }
    if (!ACCESS_TOKEN || !SPACE_ID) {
      throw Error('Missing environment variables.');
    }

    updateLoadingState(10);

    const payload = args as SubmitPayload;
    const fileName = payload.fileName as string;
    const fileContent = payload.fileContent as ArrayBuffer;
    const title = payload.title as string;
    const altText = payload.altText as string;
    const tags = payload.tags as string[];
    const client = createClient({ accessToken: ACCESS_TOKEN });
    const space = await client.getSpace(SPACE_ID);
    const env = await space.getEnvironment(CF_ENV);

    updateLoadingState(20);
    const tmpAsset = await env.createAssetFromFiles({
      fields: {
        title: {
          'en-US': fileName,
        },
        description: {
          'en-US': altText,
        },
        file: {
          'en-US': {
            fileName: fileName,
            contentType: 'image/jpg',
            file: fileContent,
          },
        },
      },
    });
    const asset = await tmpAsset.processForLocale('en-US', {
      processingCheckWait: 2000,
    });

    updateLoadingState(30);
    await asset.publish();

    updateLoadingState(40);
    const entry = await env.createEntry('image', {
      fields: {
        title: {
          'en-US': title,
        },
        date: {
          'en-US': payload.date || new Date().toISOString(),
        },
        tags: {
          'en-US': tags,
        },
        description: {
          'en-US': payload.description || '·',
        },
        file: {
          'en-US': {
            sys: { id: asset.sys.id, linkType: 'Asset', type: 'Link' },
          },
        },
      },
    });

    updateLoadingState(50);
    await entry.publish();
  };

  return (
    <Layout>
      <Form onSubmit={handleSubmit} onSubmitError={onSubmitError} />
    </Layout>
  );
};
export default App;
