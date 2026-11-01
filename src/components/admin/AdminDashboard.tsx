'use client';

import { useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { ManagedPhoto } from '@/lib/photoCatalog';
import ImageUploadForm from './ImageUploadForm';
import PhotoManager from './PhotoManager';
import PasswordForm from './PasswordForm';

type Tab = 'photos' | 'add' | 'password';

const TABS: { id: Tab; label: string }[] = [
  { id: 'photos', label: 'My Photos' },
  { id: 'add', label: 'Add a Photo' },
  { id: 'password', label: 'Change Password' },
];

export default function AdminDashboard({ builtInPhotos }: { builtInPhotos: ManagedPhoto[] }) {
  const [activeTab, setActiveTab] = useState<Tab>('photos');
  const [uploadCount, setUploadCount] = useState(0);
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-space-700">
        <div className="flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 text-lg font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'text-nebula-blue border-nebula-blue'
                  : 'text-space-300 border-transparent hover:text-space-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button
          onClick={handleLogout}
          className="mb-2 px-4 py-2 bg-space-700 text-space-200 rounded-lg hover:bg-space-600 transition-colors"
        >
          Sign Out
        </button>
      </div>

      <div className="bg-space-800/50 rounded-xl border border-space-700 p-4 sm:p-6">
        {activeTab === 'photos' && <PhotoManager key={uploadCount} builtInPhotos={builtInPhotos} />}
        {activeTab === 'add' && (
          <ImageUploadForm
            builtInPhotos={builtInPhotos}
            onSuccess={() => setUploadCount((count) => count + 1)}
          />
        )}
        {activeTab === 'password' && <PasswordForm />}
      </div>
    </div>
  );
}
