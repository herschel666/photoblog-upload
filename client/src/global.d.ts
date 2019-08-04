interface PhotoblogUploadClient {
  SPACE_ID: string;
  ACCESS_TOKEN: string;
}

interface Window {
  photoblogUploadClient: PhotoblogUploadClient;
}
