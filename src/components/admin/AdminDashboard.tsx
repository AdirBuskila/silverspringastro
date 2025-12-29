'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import ImageUploadForm from './ImageUploadForm';
import ImageList from './ImageList';

type Tab = 'upload' | 'images' | 'settings';

/**
 * Admin Dashboard Component
 * 
 * Main admin interface with tabs for uploading and managing images.
 */
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('upload');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const handleUploadSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'upload', label: 'Upload Image', icon: '📤' },
    { id: 'images', label: 'Manage Images', icon: '🖼️' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div>
      {/* Header Actions */}
      <div className="flex justify-end mb-6">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-space-700 text-space-200 rounded-lg hover:bg-space-600 transition-colors"
        >
          Sign Out
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-8 border-b border-space-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-6 py-3 font-medium transition-colors relative
              ${activeTab === tab.id 
                ? 'text-nebula-blue' 
                : 'text-space-400 hover:text-space-200'}
            `}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-nebula-blue" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-space-800/50 rounded-xl border border-space-700 p-6">
        {activeTab === 'upload' && (
          <ImageUploadForm onSuccess={handleUploadSuccess} />
        )}
        {activeTab === 'images' && (
          <ImageList key={refreshTrigger} />
        )}
        {activeTab === 'settings' && (
          <div className="text-center py-12 text-space-400">
            <p>Settings coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}

