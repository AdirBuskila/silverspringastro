'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ASTRONOMY_SECTIONS, ManagedPhoto } from '@/lib/photoCatalog';
import { prepareUpload } from '@/lib/prepareUpload';
import { fetchUploadedPhotos } from './uploadedPhotos';

const OBSERVATORIES = [
  { value: 'H85', label: 'H85 - Silver Spring Observatory' },
  { value: 'BBO', label: 'BBO - Blackbird Observatory' },
  { value: 'SRO', label: 'SRO - Sierra Remote Observatories' },
  { value: 'G53', label: 'G53 - Alder Springs Observatory' },
  { value: 'TAS', label: 'TAS - Texas Astronomical Society Dark Site' },
  { value: 'None', label: 'None / Not Applicable' },
];

const FAMILY = 'family';
const NEW_ALBUM = '__new__';
const FAMILY_PREFIX = 'Family: ';

const INPUT_CLASS =
  'w-full px-4 py-3 bg-space-900 border border-space-600 rounded-lg text-space-100 placeholder-space-500 focus:outline-none focus:ring-2 focus:ring-nebula-blue';
const LABEL_CLASS = 'block font-medium text-space-200 mb-2';

const EMPTY_DETAILS = {
  title: '',
  commonName: '',
  observatory: 'H85',
  filters: '',
  dateCaptured: '',
  exposure: '',
  location: '',
  date: '',
  newAlbum: '',
  description: '',
  featured: false,
};

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'photo';
}

function albumsFrom(photos: ManagedPhoto[]): string[] {
  return photos
    .filter((photo) => photo.section.startsWith(FAMILY_PREFIX))
    .map((photo) => photo.section.slice(FAMILY_PREFIX.length));
}

interface ImageUploadFormProps {
  builtInPhotos: ManagedPhoto[];
  onSuccess?: () => void;
}

export default function ImageUploadForm({ builtInPhotos, onSuccess }: ImageUploadFormProps) {
  const supabase = useMemo(() => createClient(), []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [destination, setDestination] = useState('galaxies');
  const [album, setAlbum] = useState('');
  const [details, setDetails] = useState(EMPTY_DETAILS);
  const [uploadedAlbums, setUploadedAlbums] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const isFamily = destination === FAMILY;
  const albums = useMemo(
    () => Array.from(new Set([...albumsFrom(builtInPhotos), ...uploadedAlbums])),
    [builtInPhotos, uploadedAlbums],
  );
  const selectedAlbum = album || albums[0] || NEW_ALBUM;

  // Albums made by earlier uploads belong in the list too. Failing to load them is
  // harmless: the built-in albums and "New album" are still offered.
  useEffect(() => {
    fetchUploadedPhotos(supabase)
      .then((photos) => setUploadedAlbums(albumsFrom(photos)))
      .catch((error) => console.error('Could not load uploaded albums:', error));
  }, [supabase]);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
     
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const update = (change: Partial<typeof EMPTY_DETAILS>) => setDetails((current) => ({ ...current, ...change }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage({ ok: false, text: 'Please choose a photo first.' });
      return;
    }
    const albumName = selectedAlbum === NEW_ALBUM ? details.newAlbum.trim() : selectedAlbum;
    if (isFamily && !albumName) {
      setMessage({ ok: false, text: 'Please type a name for the new album.' });
      return;
    }

    setUploading(true);
    setMessage(null);
    const storedPaths: string[] = [];

    try {
      const prepared = await prepareUpload(file);
      const base = `${isFamily ? 'family' : destination}/${Date.now()}-${slugify(details.title)}`;

      const store = async (path: string, blob: Blob) => {
        const { error } = await supabase.storage.from('images').upload(path, blob, {
          cacheControl: '31536000',
          contentType: blob.type,
        });
        if (error) throw error;
        storedPaths.push(path);
        return supabase.storage.from('images').getPublicUrl(path).data.publicUrl;
      };

      const imageUrl = await store(`${base}.${prepared.extension}`, prepared.full);
      const thumbnailUrl = await store(`${base}_thumb.jpg`, prepared.thumbnail);

      const description = details.description.trim() || null;
      const { error } = isFamily
        ? await supabase.from('travel_photos').insert({
            title: details.title.trim(),
            location: details.location.trim(),
            date: details.date.trim() || null,
            album: albumName,
            description,
            image_path: imageUrl,
            thumbnail_path: thumbnailUrl,
          })
        : await supabase.from('images').insert({
            designation: details.title.trim(),
            name: details.commonName.trim() || null,
            category: destination,
            observatory: details.observatory,
            filters: details.filters.trim() || null,
            date_captured: details.dateCaptured || null,
            exposure: details.exposure.trim() || null,
            description,
            featured: details.featured,
            image_path: imageUrl,
            thumbnail_path: thumbnailUrl,
          });
      if (error) throw error;

      if (isFamily) {
        setUploadedAlbums((current) => [...current, albumName]);
        setAlbum(albumName);
      }
      setMessage({ ok: true, text: `"${details.title.trim()}" is now on the website.` });
      setDetails(EMPTY_DETAILS);
      setFile(null);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      onSuccess?.();
    } catch (error) {
      console.error('Upload failed:', error);
      if (storedPaths.length > 0) {
        const cleanup = await supabase.storage.from('images').remove(storedPaths);
        if (cleanup.error) console.error('Could not remove partial upload:', cleanup.error);
      }
      const text = error instanceof Error ? error.message : 'The photo could not be uploaded. Please try again.';
      setMessage({ ok: false, text });
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div>
        <label htmlFor="photo-file" className={LABEL_CLASS}>
          1. Choose the photo
        </label>
        <input
          id="photo-file"
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={(e) => {
            const chosen = e.target.files?.[0] ?? null;
            setFile(chosen);
            if (!chosen) setPreview(null);
          }}
          className="w-full px-4 py-3 bg-space-900 border border-space-600 rounded-lg text-space-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-nebula-blue file:text-space-900 file:font-semibold hover:file:bg-nebula-cyan"
          required
        />
        <p className="text-sm text-space-400 mt-2">
          JPG or PNG. Large photos are resized automatically for the website; your original file isn&apos;t changed.
        </p>
        {preview && (
          // A local preview of the chosen file, which next/image can't optimize
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Preview" className="mt-4 max-h-72 rounded-lg border border-space-600" />
        )}
      </div>

      <div>
        <label htmlFor="destination" className={LABEL_CLASS}>
          2. Where should it appear?
        </label>
        <select
          id="destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className={INPUT_CLASS}
        >
          <optgroup label="Astronomy">
            {ASTRONOMY_SECTIONS.map((section) => (
              <option key={section.value} value={section.value}>
                {section.label}
              </option>
            ))}
          </optgroup>
          <optgroup label="Family & Travel">
            <option value={FAMILY}>Family &amp; Travel album</option>
          </optgroup>
        </select>
      </div>

      <fieldset className="space-y-5">
        <legend className={LABEL_CLASS}>3. Add the details</legend>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="title" className={LABEL_CLASS}>
              {isFamily ? 'Title' : 'Object (e.g., M51, NGC 4565)'}
            </label>
            <input
              id="title"
              type="text"
              value={details.title}
              onChange={(e) => update({ title: e.target.value })}
              className={INPUT_CLASS}
              required
            />
          </div>

          {isFamily ? (
            <>
              <div>
                <label htmlFor="album" className={LABEL_CLASS}>
                  Album
                </label>
                <select
                  id="album"
                  value={selectedAlbum}
                  onChange={(e) => setAlbum(e.target.value)}
                  className={INPUT_CLASS}
                >
                  {albums.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                  <option value={NEW_ALBUM}>New album...</option>
                </select>
              </div>
              {selectedAlbum === NEW_ALBUM && (
                <div>
                  <label htmlFor="new-album" className={LABEL_CLASS}>
                    New album name
                  </label>
                  <input
                    id="new-album"
                    type="text"
                    value={details.newAlbum}
                    onChange={(e) => update({ newAlbum: e.target.value })}
                    className={INPUT_CLASS}
                    required
                  />
                </div>
              )}
              <div>
                <label htmlFor="location" className={LABEL_CLASS}>
                  Place (optional)
                </label>
                <input
                  id="location"
                  type="text"
                  value={details.location}
                  onChange={(e) => update({ location: e.target.value })}
                  className={INPUT_CLASS}
                />
              </div>
              <div>
                <label htmlFor="date" className={LABEL_CLASS}>
                  Date (optional, e.g., 1971 or Aug 2006)
                </label>
                <input
                  id="date"
                  type="text"
                  value={details.date}
                  onChange={(e) => update({ date: e.target.value })}
                  className={INPUT_CLASS}
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label htmlFor="common-name" className={LABEL_CLASS}>
                  Common name (optional)
                </label>
                <input
                  id="common-name"
                  type="text"
                  value={details.commonName}
                  onChange={(e) => update({ commonName: e.target.value })}
                  className={INPUT_CLASS}
                  placeholder="Whirlpool Galaxy"
                />
              </div>
              <div>
                <label htmlFor="observatory" className={LABEL_CLASS}>
                  Observatory
                </label>
                <select
                  id="observatory"
                  value={details.observatory}
                  onChange={(e) => update({ observatory: e.target.value })}
                  className={INPUT_CLASS}
                >
                  {OBSERVATORIES.map((observatory) => (
                    <option key={observatory.value} value={observatory.value}>
                      {observatory.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="filters" className={LABEL_CLASS}>
                  Filters (optional)
                </label>
                <input
                  id="filters"
                  type="text"
                  value={details.filters}
                  onChange={(e) => update({ filters: e.target.value })}
                  className={INPUT_CLASS}
                  placeholder="LRGB, Ha, OIII..."
                />
              </div>
              <div>
                <label htmlFor="date-captured" className={LABEL_CLASS}>
                  Date taken (optional)
                </label>
                <input
                  id="date-captured"
                  type="date"
                  value={details.dateCaptured}
                  onChange={(e) => update({ dateCaptured: e.target.value })}
                  className={INPUT_CLASS}
                />
              </div>
              <div>
                <label htmlFor="exposure" className={LABEL_CLASS}>
                  Exposure (optional)
                </label>
                <input
                  id="exposure"
                  type="text"
                  value={details.exposure}
                  onChange={(e) => update({ exposure: e.target.value })}
                  className={INPUT_CLASS}
                  placeholder="LRGB=300:60:36:72 min"
                />
              </div>
            </>
          )}
        </div>

        <div>
          <label htmlFor="description" className={LABEL_CLASS}>
            Description (optional)
          </label>
          <textarea
            id="description"
            value={details.description}
            onChange={(e) => update({ description: e.target.value })}
            rows={3}
            className={`${INPUT_CLASS} resize-none`}
          />
        </div>

        {!isFamily && (
          <label className="flex items-center gap-3 text-space-200">
            <input
              type="checkbox"
              checked={details.featured}
              onChange={(e) => update({ featured: e.target.checked })}
              className="w-5 h-5 rounded bg-space-900 border-space-600"
            />
            Star for the home page
          </label>
        )}
      </fieldset>

      {message && (
        <p
          role="status"
          className={`p-4 rounded-lg border ${
            message.ok
              ? 'bg-green-900/30 border-green-700/50 text-green-300'
              : 'bg-red-900/30 border-red-700/50 text-red-300'
          }`}
        >
          {message.text}
        </p>
      )}

      <button
        type="submit"
        disabled={uploading}
        className="w-full py-3 px-4 text-lg bg-nebula-blue text-space-900 font-semibold rounded-lg hover:bg-nebula-cyan transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? 'Uploading...' : 'Put It on the Website'}
      </button>
    </form>
  );
}
