/**
 * Plog Utilities
 * Content collection helpers for photo albums and album photo aggregation.
 */

import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

const PLOG_FILE_EXTENSION_PATTERN = /\.(md|mdx)$/i;
const PLOG_IMAGE_EXTENSION_PATTERN = /\.(avif|gif|jpe?g|png|webp)$/i;
const PLOG_IMAGES_FOLDER_SEGMENT = '/images/';

const plogImageModules = import.meta.glob<string>(
  '../content/plog/**/*.{jpg,jpeg,png,webp,avif,gif,JPG,JPEG,PNG,WEBP,AVIF,GIF}',
  {
    eager: true,
    query: '?url',
    import: 'default',
  },
);

export interface PlogPhoto {
  id: string;
  title: string;
  caption: string;
  signature: string;
  fileName: string;
  downloadName: string;
  date: string;
  location: string;
  camera: string;
  tags: string[];
  image: string;
  downloadUrl: string;
  imageAlt?: string;
  gradient: string;
  accent: string;
  featured: boolean;
}

export interface PlogAlbum {
  id: string;
  slug: string;
  href: string;
  title: string;
  description: string;
  date: string;
  updatedDate?: string;
  location: string;
  camera: string;
  tags: string[];
  cover: string;
  coverAlt?: string;
  gradient: string;
  accent: string;
  icon: string;
  featured: boolean;
  photoCount: number;
  photos: PlogPhoto[];
}

export interface PlogGallery {
  albums: PlogAlbum[];
  photos: PlogPhoto[];
}

interface PlogFolderImage {
  fileName: string;
  stem: string;
  src: string;
}

type PlogEntry = CollectionEntry<'plog'>;
type PlogPhotoMeta = PlogEntry['data']['photos'][number];

export function getPlogSlug(entry: PlogEntry) {
  let slug = entry.slug || entry.id.replace(PLOG_FILE_EXTENSION_PATTERN, '');
  slug = slug.replace(/\/index$/i, '');
  return slug;
}

function getImageSrc(image?: { src?: string } | string) {
  if (!image) return '';
  if (typeof image === 'string') return image;
  return image.src ?? '';
}

function getPlogAssetRelativePath(path: string) {
  return path
    .replace(/\\/g, '/')
    .replace(/^.*?\/src\/content\/plog\//, '')
    .replace(/^\.\.\/content\/plog\//, '');
}

function getPlogLookupSlug(slug: string) {
  return slug.toLowerCase();
}

function getPhotoLookupKey(file: string) {
  return file
    .replace(/\\/g, '/')
    .replace(/^\.?\//, '')
    .replace(/^images\//i, '')
    .toLowerCase();
}

function formatPhotoTitle(title: string, index: number, imageCount: number) {
  if (imageCount <= 1) return title;
  return `${title} ${String(index + 1).padStart(2, '0')}`;
}

function createPlogFolderImagesByEntry() {
  const imageMap = new Map<string, PlogFolderImage[]>();

  Object.entries(plogImageModules).forEach(([path, src]) => {
    const relativePath = getPlogAssetRelativePath(path);
    const folderIndex = relativePath.indexOf(PLOG_IMAGES_FOLDER_SEGMENT);

    if (folderIndex < 0) return;

    const entrySlug = relativePath.slice(0, folderIndex);
    const fileName = relativePath.slice(folderIndex + PLOG_IMAGES_FOLDER_SEGMENT.length);

    if (!entrySlug || !fileName || !PLOG_IMAGE_EXTENSION_PATTERN.test(fileName)) return;

    const lookupSlug = getPlogLookupSlug(entrySlug);
    const images = imageMap.get(lookupSlug) ?? [];
    images.push({
      fileName,
      stem: fileName.replace(PLOG_IMAGE_EXTENSION_PATTERN, ''),
      src,
    });
    imageMap.set(lookupSlug, images);
  });

  imageMap.forEach((images) => {
    images.sort((a, b) => a.fileName.localeCompare(b.fileName, undefined, {
      numeric: true,
      sensitivity: 'base',
    }));
  });

  return imageMap;
}

const plogFolderImagesByEntry = createPlogFolderImagesByEntry();

function createPhotoMetaMap(entry: PlogEntry) {
  const metaMap = new Map<string, PlogPhotoMeta>();

  entry.data.photos.forEach((photo) => {
    metaMap.set(getPhotoLookupKey(photo.file), photo);
  });

  return metaMap;
}

function createPlogPhoto(
  entry: PlogEntry,
  folderImage?: PlogFolderImage,
  imageIndex = 0,
  imageCount = 1,
  meta?: PlogPhotoMeta,
): PlogPhoto {
  const album = entry.data.album;
  const albumAccent = album.accent;
  const photoAccent = meta?.accent ?? entry.data.accent ?? albumAccent;
  const entrySlug = getPlogSlug(entry);
  const fileName = folderImage?.fileName ?? '';
  const fallbackTitle = formatPhotoTitle(entry.data.title, imageIndex, imageCount);
  const title = meta?.title ?? fallbackTitle;
  const image = folderImage?.src ?? getImageSrc(entry.data.image);
  const inferredDownloadName = fileName.split('/').pop() || `${entrySlug}.jpg`;
  const downloadName = meta?.downloadName ?? inferredDownloadName;

  return {
    id: folderImage ? `${entrySlug}/${folderImage.stem}` : entrySlug,
    title,
    caption: meta?.caption ?? meta?.description ?? entry.data.description,
    signature: meta?.signature ?? '',
    fileName: fileName.split('/').pop() || fileName,
    downloadName,
    date: (meta?.date ?? entry.data.publishDate).toISOString().slice(0, 10),
    location: meta?.location ?? entry.data.location,
    camera: meta?.camera ?? entry.data.camera,
    tags: meta?.tags ?? entry.data.tags,
    image,
    downloadUrl: image,
    imageAlt: meta?.alt ?? entry.data.imageAlt ?? title,
    gradient: entry.data.gradient,
    accent: photoAccent,
    featured: (meta?.featured ?? false) || (entry.data.featured && imageIndex === 0),
  };
}

export async function getAllPlogEntries() {
  const albums = await getCollection('plog', ({ data }) => {
    if (import.meta.env.DEV) {
      return true;
    }
    return !data.draft && data.published !== false;
  });

  return albums.sort((a, b) => {
    return b.data.publishDate.valueOf() - a.data.publishDate.valueOf();
  });
}

export function createPlogAlbum(entry: PlogEntry): PlogAlbum {
  const slug = getPlogSlug(entry);
  const photoMetaMap = createPhotoMetaMap(entry);
  const folderImages = plogFolderImagesByEntry.get(getPlogLookupSlug(slug)) ?? [];
  const photos = folderImages.length > 0
    ? folderImages.map((folderImage, index) => (
        createPlogPhoto(
          entry,
          folderImage,
          index,
          folderImages.length,
          photoMetaMap.get(getPhotoLookupKey(folderImage.fileName)),
        )
      ))
    : [createPlogPhoto(entry)];

  const featuredPhoto = photos.find((photo) => photo.featured && photo.image) ?? photos.find((photo) => photo.image);
  const cover = getImageSrc(entry.data.image) || featuredPhoto?.image || '';

  return {
    id: slug,
    slug,
    href: `/gallery/${slug}/`,
    title: entry.data.title,
    description: entry.data.description,
    date: entry.data.publishDate.toISOString().slice(0, 10),
    updatedDate: entry.data.updatedDate?.toISOString().slice(0, 10),
    location: entry.data.location,
    camera: entry.data.camera,
    tags: entry.data.tags,
    cover,
    coverAlt: entry.data.imageAlt ?? featuredPhoto?.imageAlt,
    gradient: entry.data.gradient,
    accent: entry.data.accent ?? entry.data.album.accent,
    icon: entry.data.album.icon,
    featured: entry.data.featured,
    photoCount: photos.length,
    photos,
  };
}

export async function getPlogAlbums() {
  const entries = await getAllPlogEntries();
  return entries.map(createPlogAlbum);
}

export async function getPlogAlbumBySlug(slug: string) {
  const albums = await getPlogAlbums();
  const lookupSlug = getPlogLookupSlug(slug);
  return albums.find((album) => getPlogLookupSlug(album.slug) === lookupSlug);
}

export async function getPlogGallery(): Promise<PlogGallery> {
  const albums = await getPlogAlbums();

  return {
    albums,
    photos: albums.flatMap((album) => album.photos),
  };
}
