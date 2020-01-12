import nock from 'nock';

const { SPACE_ID, CF_ENV } = window.photoblogUploadClient;
const ASSET_ID = 'asset-123';
const ENTRY_ID = 'entry-123';

const image =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAYGBgYHBgcICAcKCwoLCg8ODAwODx' +
  'YQERAREBYiFRkVFRkVIh4kHhweJB42KiYmKjY+NDI0PkxERExfWl98fKcBBgYGBgcGBwgIBwoL' +
  'CgsKDw4MDA4PFhAREBEQFiIVGRUVGRUiHiQeHB4kHjYqJiYqNj40MjQ+TERETF9aX3x8p//CAB' +
  'EIAAUABQMBIgACEQEDEQH/xAAUAAEAAAAAAAAAAAAAAAAAAAAG/9oACAEBAAAAAEX/xAAUAQEA' +
  'AAAAAAAAAAAAAAAAAAAC/9oACAECEAAAAF//xAAUAQEAAAAAAAAAAAAAAAAAAAAC/9oACAEDEA' +
  'AAAH//xAAdEAACAQQDAAAAAAAAAAAAAAABAgMABAUREzEy/9oACAEBAAE/AHyHBk7oLFpWiiIR' +
  'TpV9dV//xAAYEQACAwAAAAAAAAAAAAAAAAAAAQIRgf/aAAgBAgEBPwCKVaz/xAAYEQACAwAAAA' +
  'AAAAAAAAAAAAAAAQIxgf/aAAgBAwEBPwCV4j//2Q==';
export const imageName = 'test.jpg';
const blob = Buffer.from(image);
export const imageFile = new File([blob], 'image.jpg');
Object.defineProperties(imageFile, {
  type: {
    get: () => 'image/jpeg',
  },
  name: {
    get: () => imageName,
  },
});

const uploadId = 'upload-id';

// tslint:disable:next-line max-func-body-length
export const createApiScope = () =>
  nock('https://api.contentful.com')
    .options(`/spaces/${SPACE_ID}`)
    .reply(204)
    .get(`/spaces/${SPACE_ID}`)
    .reply(200, {
      sys: { id: SPACE_ID },
    })

    .options(`/spaces/${SPACE_ID}/environments/staging`)
    .reply(204)
    .get(`/spaces/${SPACE_ID}/environments/staging`)
    .reply(200, {
      sys: {
        id: CF_ENV,
        space: {
          sys: { id: SPACE_ID },
        },
      },
    })

    .options(`/spaces/${SPACE_ID}/environments/staging/assets`)
    .reply(204)
    .post(`/spaces/${SPACE_ID}/environments/staging/assets`)
    .reply(201, {
      sys: {
        id: ASSET_ID,
        space: { sys: { id: SPACE_ID } },
        version: 1,
      },
      fields: {
        file: {
          'en-US': { fileName: imageName },
        },
      },
    })

    .options(
      `/spaces/${SPACE_ID}/environments/staging/assets/${ASSET_ID}/files/en-US/process`
    )
    .reply(204)
    .put(
      `/spaces/${SPACE_ID}/environments/staging/assets/${ASSET_ID}/files/en-US/process`
    )
    .reply(204)

    .options(`/spaces/${SPACE_ID}/environments/staging/assets/${ASSET_ID}`)
    .reply(204)
    .get(`/spaces/${SPACE_ID}/environments/staging/assets/${ASSET_ID}`)
    .reply(200, {
      sys: { id: ASSET_ID, version: 1 },
      fields: {
        file: {
          'en-US': {
            url: 'https://test.tld/test.jpg',
          },
        },
      },
    })

    .options(
      `/spaces/${SPACE_ID}/environments/staging/assets/${ASSET_ID}/published`
    )
    .reply(204)
    .put(
      `/spaces/${SPACE_ID}/environments/staging/assets/${ASSET_ID}/published`
    )
    .reply(200, {
      sys: { id: ASSET_ID, version: 1 },
    })

    .options(`/spaces/${SPACE_ID}/environments/staging/entries`)
    .reply(204)
    .post(`/spaces/${SPACE_ID}/environments/staging/entries`)
    .reply(201, {
      sys: { id: ENTRY_ID, version: 1 },
    })

    .options(
      `/spaces/${SPACE_ID}/environments/staging/entries/${ENTRY_ID}/published`
    )
    .reply(204)
    .put(
      `/spaces/${SPACE_ID}/environments/staging/entries/${ENTRY_ID}/published`
    )
    .reply(200, {
      sys: { id: ENTRY_ID },
    });

export const createUploadScope = () =>
  nock('https://upload.contentful.com')
    .options(`/spaces/${SPACE_ID}/uploads`)
    .reply(204)
    .post(`/spaces/${SPACE_ID}/uploads`)
    .reply(201, {
      sys: {
        id: uploadId,
        space: { sys: { id: SPACE_ID } },
      },
    });
