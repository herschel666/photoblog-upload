declare module 'contentful-management' {
  interface Sys {
    readonly id: string;
  }

  interface AssetArgs {
    fields: {
      title: {
        'en-US': string;
      };
      description: {
        'en-US': string;
      };
      file: {
        'en-US': {
          fileName: string;
          contentType: 'image/jpg';
          file: ArrayBuffer;
        };
      };
    };
  }

  class Asset {
    readonly sys: Sys;
    public processForLocale(
      locale: 'en-US',
      options?: { processingCheckWait: number }
    ): Promise<Asset>;
    public publish(): Promise<void>;
  }

  interface EntryArgs {
    fields: {
      title: {
        'en-US': string;
      };
      date: {
        'en-US'?: string;
      };
      tags: {
        'en-US': string[];
      };
      description: {
        'en-US'?: string;
      };
      file: {
        'en-US': {
          sys: {
            id: string;
            linkType: 'Asset';
            type: 'Link';
          };
        };
      };
    };
  }

  interface Entry {
    publish(): Promise<void>;
  }

  interface Environment {
    createAssetFromFiles(asset: AssetArgs): Promise<Asset>;
    createEntry(entryType: 'image', entry: EntryArgs): Promise<Entry>;
  }

  interface Space {
    getEnvironment(environmentId: 'master'): Promise<Environment>;
  }

  interface Client {
    getSpace(spaceId: string): Promise<Space>;
  }

  export function createClient(args: { accessToken: string }): Client;
}
