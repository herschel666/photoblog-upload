interface PhotoblogUploadClient {
  SPACE_ID: string;
  ACCESS_TOKEN: string;
  CF_ENV: string;
}

interface Window {
  photoblogUploadClient: PhotoblogUploadClient;
}
