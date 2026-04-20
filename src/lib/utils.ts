export const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w-]+/g, '')  // Remove all non-word chars
    .replace(/--+/g, '-');    // Replace multiple - with single -
};

export const slugifyLocation = (text: string) => {
  return slugify(text.replace(/[\s/]+/g, '-'));
};

export function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
