import React, { useEffect, useRef, useState } from 'react';
import galleryService from '../../services/galleryService';

const MAX_FILES = 10;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);

const getImagesFromResponse = (response) => {
  const images = response?.data?.images || response?.images;
  return Array.isArray(images) ? images : [];
};

const GalleryManager = () => {
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const loadImages = async () => {
    setLoading(true);
    try {
      const response = await galleryService.getImages();
      setImages(getImagesFromResponse(response));
      setError('');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not load gallery images. Check that the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
    // Initial load only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileChange = (event) => {
    const selected = Array.from(event.target.files || []);
    setMessage('');
    setError('');

    if (selected.length > MAX_FILES) {
      setFiles([]);
      setError(`Choose no more than ${MAX_FILES} images at a time.`);
      event.target.value = '';
      return;
    }

    const invalidType = selected.find((file) => !allowedTypes.has(file.type));
    if (invalidType) {
      setFiles([]);
      setError('Only JPG, PNG, GIF and WEBP images are allowed.');
      event.target.value = '';
      return;
    }

    const oversized = selected.find((file) => file.size > MAX_FILE_SIZE);
    if (oversized) {
      setFiles([]);
      setError('Each image must be 5 MB or smaller.');
      event.target.value = '';
      return;
    }

    setFiles(selected);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!files.length) {
      setError('Choose at least one image first.');
      return;
    }

    setUploading(true);
    setError('');
    setMessage('');
    try {
      const response = await galleryService.uploadImages(files);
      const uploaded = getImagesFromResponse(response);
      setFiles([]);
      if (inputRef.current) inputRef.current.value = '';
      setMessage(`Uploaded ${uploaded.length || files.length} image(s). They are now available on the homepage gallery.`);
      await loadImages();
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || 'Gallery upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (image) => {
    const id = image._id || image.id;
    if (!id || !window.confirm(`Remove "${image.title || image.alt || 'this image'}" from the website gallery?`)) return;

    setDeletingId(id);
    setError('');
    setMessage('');
    try {
      await galleryService.deleteImage(id);
      setImages((current) => current.filter((item) => (item._id || item.id) !== id));
      setMessage('Gallery image removed from the homepage.');
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || 'Could not delete this image.');
    } finally {
      setDeletingId('');
    }
  };

  return (
    <section className="my-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600">Website content</p>
          <h2 className="mt-1 text-2xl font-extrabold text-slate-900">Homepage Gallery</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">Upload images to add them to the existing homepage gallery. The current default gallery stays in place.</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">{images.length} uploaded</span>
      </div>

      <form onSubmit={handleUpload} className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 sm:p-5">
        <label htmlFor="homepage-gallery-images" className="block text-sm font-semibold text-slate-800">Select gallery images</label>
        <input
          ref={inputRef}
          id="homepage-gallery-images"
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          multiple
          onChange={handleFileChange}
          className="mt-3 block w-full cursor-pointer rounded-lg border border-slate-200 bg-white text-sm text-slate-700 file:mr-4 file:border-0 file:bg-slate-900 file:px-4 file:py-3 file:font-semibold file:text-white hover:file:bg-slate-700"
        />
        <p className="mt-2 text-xs text-slate-500">JPG, PNG, GIF or WEBP Â· up to 10 images per upload Â· 5 MB per image</p>
        {files.length > 0 && (
          <div className="mt-3 text-sm text-slate-700">
            <span className="font-semibold">{files.length} selected:</span> {files.map((file) => file.name).join(', ')}
          </div>
        )}
        <button type="submit" disabled={uploading || files.length === 0} className="mt-4 inline-flex items-center justify-center rounded-lg bg-amber-500 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50">
          {uploading ? 'Uploadingâ€¦' : 'Upload to Website Gallery'}
        </button>
      </form>

      {message && <p role="status" className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">{message}</p>}
      {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}

      <div className="mt-7">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-slate-900">Uploaded images</h3>
          <button type="button" onClick={loadImages} disabled={loading} className="text-sm font-semibold text-slate-700 underline underline-offset-4 disabled:opacity-50">Refresh</button>
        </div>
        {loading ? (
          <p className="py-6 text-sm text-slate-500">Loading galleryâ€¦</p>
        ) : images.length === 0 ? (
          <p className="rounded-xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">No admin-uploaded images yet. The existing default gallery will continue to show.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {images.map((image) => {
              const id = image._id || image.id;
              const url = image.imageUrl || image.url;
              return (
                <article key={id || url} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                    {url ? <img src={url} alt={image.alt || image.title || 'Homepage gallery'} loading="lazy" className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-sm text-slate-400">No preview</div>}
                  </div>
                  <div className="p-3">
                    <p className="truncate text-sm font-semibold text-slate-800" title={image.title || image.alt || ''}>{image.title || image.alt || 'Gallery image'}</p>
                    <button type="button" onClick={() => handleDelete(image)} disabled={deletingId === id} className="mt-3 text-xs font-bold text-red-600 hover:text-red-800 disabled:opacity-50">
                      {deletingId === id ? 'Removingâ€¦' : 'Remove from website'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default GalleryManager;