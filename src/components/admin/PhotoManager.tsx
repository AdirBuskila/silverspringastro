'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { ManagedPhoto } from '@/lib/photoCatalog';
import {
  HOME_PHOTO_COUNT,
  isHidden,
  isStarred,
  orderStarredPhotos,
  PhotoSetting,
  PhotoSettings,
  toPhotoSettings,
} from '@/lib/photoSettings';
import { storagePathFromUrl } from '@/lib/prepareUpload';
import { fetchUploadedPhotos } from './uploadedPhotos';

type Visibility = 'all' | 'showing' | 'removed';

const FIELD_CLASS =
  'px-4 py-3 bg-space-900 border border-space-600 rounded-lg text-space-100 focus:outline-none focus:ring-2 focus:ring-nebula-blue';

/**
 * Every photo on the site in one place. "Remove from site" only hides a photo, so it can
 * always be put back. Uploaded photos can also be deleted for good.
 */
export default function PhotoManager({ builtInPhotos }: { builtInPhotos: ManagedPhoto[] }) {
  const supabase = useMemo(() => createClient(), []);
  const [uploads, setUploads] = useState<ManagedPhoto[]>([]);
  const [settings, setSettings] = useState<PhotoSettings>(() => toPhotoSettings([]));
  const [status, setStatus] = useState<'loading' | 'ready' | 'failed'>('loading');
  const [actionError, setActionError] = useState<string | null>(null);
  const [section, setSection] = useState('all');
  const [visibility, setVisibility] = useState<Visibility>('all');
  const [search, setSearch] = useState('');
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const [uploaded, settingsResult] = await Promise.all([
        fetchUploadedPhotos(supabase),
        supabase.from('photo_settings').select('photo_id, hidden, featured'),
      ]);
      if (settingsResult.error) throw settingsResult.error;
      setUploads(uploaded);
      setSettings(toPhotoSettings(settingsResult.data as PhotoSetting[]));
      setStatus('ready');
    } catch (error) {
      console.error('Could not load photos:', error);
      setStatus('failed');
    }
  }, [supabase]);

  useEffect(() => {
     
    load();
  }, [load]);

  const allPhotos = useMemo(() => [...uploads, ...builtInPhotos], [uploads, builtInPhotos]);
  const sections = useMemo(() => Array.from(new Set(allPhotos.map((p) => p.section))), [allPhotos]);
  const homePhotoIds = useMemo(
    () => new Set(orderStarredPhotos(allPhotos, settings).slice(0, HOME_PHOTO_COUNT).map((p) => p.id)),
    [allPhotos, settings],
  );

  const visiblePhotos = useMemo(() => {
    const query = search.trim().toLowerCase();
    return allPhotos.filter((photo) => {
      if (section !== 'all' && photo.section !== section) return false;
      const hidden = isHidden(photo.id, settings);
      if (visibility === 'showing' && hidden) return false;
      if (visibility === 'removed' && !hidden) return false;
      return !query || `${photo.title} ${photo.subtitle ?? ''}`.toLowerCase().includes(query);
    });
  }, [allPhotos, section, visibility, search, settings]);

  // Shows the change at once, and undoes it if saving fails.
  const saveSetting = async (photo: ManagedPhoto, change: Partial<Pick<PhotoSetting, 'hidden' | 'featured'>>) => {
    const previous = settings;
    const current = settings.get(photo.id);
    const updated: PhotoSetting = {
      photo_id: photo.id,
      hidden: current?.hidden ?? false,
      featured: current?.featured ?? null,
      ...change,
    };

    setActionError(null);
    setSettings(new Map(settings).set(photo.id, updated));

    const { error } = await supabase.from('photo_settings').upsert(updated);
    if (error) {
      console.error('Could not save photo setting:', error);
      setSettings(previous);
      setActionError(`Sorry, "${photo.title}" could not be changed. Please try again.`);
    }
  };

  const deleteForever = async (photo: ManagedPhoto) => {
    if (!photo.upload) return;
    setActionError(null);
    setConfirmingDelete(null);

    const { error } = await supabase.from(photo.upload.table).delete().eq('id', photo.upload.rowId);
    if (error) {
      console.error('Could not delete photo:', error);
      setActionError(`Sorry, "${photo.title}" could not be deleted. Please try again.`);
      return;
    }

    // The photo is gone from the site once its row is deleted, so a failed cleanup here
    // only leaves an unused file behind. That's logged rather than shown as a failure.
    const paths = photo.upload.fileUrls.map(storagePathFromUrl).filter(Boolean) as string[];
    const removal = await supabase.storage.from('images').remove(paths);
    if (removal.error) console.error('Could not remove stored files:', removal.error);
    const cleanup = await supabase.from('photo_settings').delete().eq('photo_id', photo.id);
    if (cleanup.error) console.error('Could not remove photo setting:', cleanup.error);

    setUploads((current) => current.filter((p) => p.id !== photo.id));
  };

  if (status === 'loading') {
    return <p className="py-12 text-center text-space-300">Loading your photos...</p>;
  }

  if (status === 'failed') {
    return (
      <div className="py-12 text-center">
        <p className="text-red-400 mb-4">Your photos could not be loaded.</p>
        <button onClick={load} className="px-4 py-2 bg-space-700 text-space-100 rounded-lg hover:bg-space-600">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <p className="text-space-300 mb-5">
        Changes appear on the website right away. Photos you remove can always be put back. The home page shows{' '}
        {HOME_PHOTO_COUNT} starred photos, and the ones you star go first.
      </p>

      <div className="flex flex-wrap gap-3 mb-5">
        <select
          aria-label="Section"
          value={section}
          onChange={(e) => setSection(e.target.value)}
          className={FIELD_CLASS}
        >
          <option value="all">All sections</option>
          {sections.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        <select
          aria-label="Show"
          value={visibility}
          onChange={(e) => setVisibility(e.target.value as Visibility)}
          className={FIELD_CLASS}
        >
          <option value="all">On and off the site</option>
          <option value="showing">On the site</option>
          <option value="removed">Removed from the site</option>
        </select>
        <input
          type="search"
          aria-label="Search by name"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${FIELD_CLASS} flex-1 min-w-48 placeholder-space-500`}
        />
      </div>

      {actionError && (
        <p role="alert" className="mb-5 p-4 rounded-lg bg-red-900/30 border border-red-700/50 text-red-300">
          {actionError}
        </p>
      )}

      <p className="text-sm text-space-400 mb-3">
        {visiblePhotos.length} {visiblePhotos.length === 1 ? 'item' : 'items'}
      </p>

      {visiblePhotos.length === 0 ? (
        <p className="py-12 text-center text-space-400">Nothing matches.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {visiblePhotos.map((photo) => {
            const hidden = isHidden(photo.id, settings);
            const starred = isStarred(photo, settings);
            return (
              <li
                key={photo.id}
                className={`flex flex-col rounded-lg border bg-space-900/60 overflow-hidden ${
                  hidden ? 'border-red-800/60' : 'border-space-700'
                }`}
              >
                <div className={`relative aspect-[4/3] bg-space-800 ${hidden ? 'opacity-40' : ''}`}>
                  <Image
                    src={photo.thumbnail}
                    alt={photo.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 320px"
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-col flex-1 gap-3 p-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-space-100">{photo.title}</h3>
                    {photo.subtitle && <p className="text-sm text-space-400">{photo.subtitle}</p>}
                    <p className="text-xs text-space-500 mt-1">{photo.section}</p>
                    {hidden && <p className="text-sm font-medium text-red-400 mt-1">Removed from site</p>}
                    {homePhotoIds.has(photo.id) && (
                      <p className="text-sm font-medium text-star-warm mt-1">On home page</p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => saveSetting(photo, { hidden: !hidden })}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        hidden
                          ? 'bg-nebula-blue text-space-900 hover:bg-nebula-cyan'
                          : 'bg-space-700 text-space-100 hover:bg-space-600'
                      }`}
                    >
                      {hidden ? 'Put back on site' : 'Remove from site'}
                    </button>
                    {photo.canStar && (
                      <button
                        onClick={() => saveSetting(photo, { featured: !starred })}
                        aria-pressed={starred}
                        title={starred ? 'Starred for the home page' : 'Star for the home page'}
                        className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                          starred
                            ? 'bg-star-warm/20 text-star-warm hover:bg-star-warm/30'
                            : 'bg-space-700 text-space-300 hover:bg-space-600'
                        }`}
                      >
                        {starred ? '★ Home page' : '☆ Home page'}
                      </button>
                    )}
                  </div>

                  {photo.upload &&
                    (confirmingDelete === photo.id ? (
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="text-red-300">Delete for good? This can&apos;t be undone.</span>
                        <button
                          onClick={() => deleteForever(photo)}
                          className="px-3 py-1.5 rounded-lg bg-red-700 text-white hover:bg-red-600"
                        >
                          Yes, delete
                        </button>
                        <button
                          onClick={() => setConfirmingDelete(null)}
                          className="px-3 py-1.5 rounded-lg bg-space-700 text-space-100 hover:bg-space-600"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmingDelete(photo.id)}
                        className="self-start text-sm text-red-400 hover:text-red-300 underline"
                      >
                        Delete for good
                      </button>
                    ))}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
