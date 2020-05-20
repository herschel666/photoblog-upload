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
