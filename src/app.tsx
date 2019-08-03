import React from 'react';
import { createClient } from 'contentful-management';

import { Layout } from './components/layout';
import { Form, hasRequiredPayload, SubmitPayload } from './components/form';

const App: React.SFC = () => {
  const handleSubmit = async (args?: SubmitPayload): Promise<void> | never => {
    if (!hasRequiredPayload(args)) {
      throw Error('Missing arguments.');
    }
    if (
      !Boolean(process.env.REACT_APP_ACCESS_TOKEN) ||
      !Boolean(process.env.REACT_APP_SPACE_ID)
    ) {
      throw Error('Missing environment variables.');
    }

    const payload = args as SubmitPayload;
    const fileName = payload.fileName as string;
    const fileContent = payload.fileContent as ArrayBuffer;
    const title = payload.title as string;
    const altText = payload.altText as string;
    const tags = payload.tags as string[];
    const accessToken = process.env.REACT_APP_ACCESS_TOKEN as string;
    const spaceId = process.env.REACT_APP_SPACE_ID as string;
    const client = createClient({ accessToken });
    const space = await client.getSpace(spaceId);
    const env = await space.getEnvironment('master');
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
    await asset.publish();
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
          'en-US': payload.description,
        },
        file: {
          'en-US': {
            sys: { id: asset.sys.id, linkType: 'Asset', type: 'Link' },
          },
        },
      },
    });
    await entry.publish();
  };

  return (
    <Layout>
      <Form onSubmit={handleSubmit} />
    </Layout>
  );
};
export default App;
