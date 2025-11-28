import exifr from "exifr";

const getExifFromUrl = async (url: string) => {
  // fetch the actual bytes
  const res = await fetch(url);
  const blob = await res.blob();

  // parse EXIF from the blob
  const exif = await exifr.parse(blob, {
    gps: true,
    tiff: true,
    exif: true,
  });

  console.log(exif);
  return exif;
};

export default getExifFromUrl;
