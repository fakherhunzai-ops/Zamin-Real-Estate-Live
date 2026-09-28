import { useRef, useState } from 'react';
import { uploadStayImage, type StayImageInput } from '@/utils/stayAdmin';

type Props = {
  images: StayImageInput[];
  onChange: (images: StayImageInput[]) => void;
};

export default function StayImagesManager({ images, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');

  const update = (next: StayImageInput[]) => {
    onChange(next.map((image, index) => ({ ...image, sort_order: index })));
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      const uploaded: StayImageInput[] = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) {
          setError('Only image files can be uploaded.');
          continue;
        }
        const url = await uploadStayImage(file);
        uploaded.push({
          url,
          alt: null,
          is_cover: images.length === 0 && uploaded.length === 0,
          sort_order: images.length + uploaded.length,
        });
      }
      update([...images, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const addUrl = () => {
    const url = urlInput.trim();
    if (!url) return;
    update([
      ...images,
      { url, alt: null, is_cover: images.length === 0, sort_order: images.length },
    ]);
    setUrlInput('');
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    update(next);
  };

  const setCover = (index: number) => {
    update(images.map((image, i) => ({ ...image, is_cover: i === index })));
  };

  const setAlt = (index: number, alt: string) => {
    update(images.map((image, i) => (i === index ? { ...image, alt } : image)));
  };

  const remove = (index: number) => {
    const next = images.filter((_, i) => i !== index);
    if (next.length > 0 && !next.some((image) => image.is_cover)) {
      next[0].is_cover = true;
    }
    update(next);
  };

  const iconButton =
    'flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-background-300 text-foreground-700 transition-colors hover:bg-background-100 disabled:cursor-not-allowed disabled:opacity-40';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md bg-primary-800 px-4 py-2.5 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-900 disabled:cursor-not-allowed disabled:opacity-60 dark:text-foreground-950"
        >
          <i className={`${uploading ? 'ri-loader-4-line animate-spin' : 'ri-upload-2-line'} text-base`}></i>
          {uploading ? 'Uploading…' : 'Upload images'}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(event) => handleFiles(event.target.files)}
        />
        <span className="text-xs text-foreground-500">
          JPG / PNG / WebP. First image is the cover by default.
        </span>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="url"
          value={urlInput}
          onChange={(event) => setUrlInput(event.target.value)}
          placeholder="…or paste an image URL"
          className="w-full rounded-md border border-background-300 bg-background-50 px-3 py-2.5 text-sm text-foreground-900 focus:border-primary-500 focus:outline-none"
        />
        <button
          type="button"
          onClick={addUrl}
          className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border border-primary-300 px-4 py-2.5 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50"
        >
          <i className="ri-link text-base"></i>
          Add URL
        </button>
      </div>

      {error && (
        <p className="flex items-start gap-2 rounded-md bg-primary-50 px-3 py-2 text-sm text-primary-800">
          <i className="ri-error-warning-line mt-0.5"></i>
          {error}
        </p>
      )}

      {images.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-card border border-dashed border-background-300 bg-background-50 py-10 text-center">
          <span className="flex h-12 w-12 items-center justify-center text-background-400">
            <i className="ri-image-add-line text-3xl"></i>
          </span>
          <p className="text-sm text-foreground-600">No images yet. Upload the first one above.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {images.map((image, index) => (
            <li
              key={`${image.url}-${index}`}
              className="overflow-hidden rounded-card border border-background-200 bg-background-50"
            >
              <div className="relative h-40 w-full bg-background-100">
                <img src={image.url} alt={image.alt || `Stay image ${index + 1}`} className="h-full w-full object-cover object-top" />
                {image.is_cover && (
                  <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-md bg-primary-800/95 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-background-50">
                    <i className="ri-star-fill text-accent-300"></i>
                    Cover
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2 p-3">
                <input
                  type="text"
                  value={image.alt ?? ''}
                  onChange={(event) => setAlt(index, event.target.value)}
                  placeholder="Alt text (optional)"
                  className="w-full rounded-md border border-background-300 bg-background-50 px-2.5 py-2 text-xs text-foreground-900 focus:border-primary-500 focus:outline-none"
                />
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1">
                    <button type="button" className={iconButton} onClick={() => move(index, -1)} disabled={index === 0} aria-label="Move up">
                      <i className="ri-arrow-up-line text-base"></i>
                    </button>
                    <button type="button" className={iconButton} onClick={() => move(index, 1)} disabled={index === images.length - 1} aria-label="Move down">
                      <i className="ri-arrow-down-line text-base"></i>
                    </button>
                    <button type="button" className={iconButton} onClick={() => setCover(index)} disabled={image.is_cover} aria-label="Set as cover">
                      <i className="ri-star-line text-base"></i>
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-primary-200 text-primary-700 transition-colors hover:bg-primary-50"
                    aria-label="Remove image"
                  >
                    <i className="ri-delete-bin-line text-base"></i>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}