'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const MIN_LENGTH = 10;
const INPUT_CLASS =
  'w-full px-4 py-3 bg-space-900 border border-space-600 rounded-lg text-space-100 focus:outline-none focus:ring-2 focus:ring-nebula-blue';

export default function PasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < MIN_LENGTH) {
      setMessage({ ok: false, text: `Please use at least ${MIN_LENGTH} characters.` });
      return;
    }
    if (password !== confirmation) {
      setMessage({ ok: false, text: "The two passwords don't match." });
      return;
    }

    setSaving(true);
    setMessage(null);
    const { error } = await createClient().auth.updateUser({ password });
    setSaving(false);

    if (error) {
      setMessage({ ok: false, text: error.message });
    } else {
      setPassword('');
      setConfirmation('');
      setMessage({ ok: true, text: 'Your password has been changed.' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-5">
      <div>
        <label htmlFor="new-password" className="block font-medium text-space-200 mb-2">
          New password
        </label>
        <input
          id="new-password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={INPUT_CLASS}
          required
        />
      </div>
      <div>
        <label htmlFor="confirm-password" className="block font-medium text-space-200 mb-2">
          Type it again
        </label>
        <input
          id="confirm-password"
          type="password"
          autoComplete="new-password"
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          className={INPUT_CLASS}
          required
        />
      </div>
      {message && (
        <p role="status" className={message.ok ? 'text-green-400' : 'text-red-400'}>
          {message.text}
        </p>
      )}
      <button
        type="submit"
        disabled={saving}
        className="px-6 py-3 bg-nebula-blue text-space-900 font-semibold rounded-lg hover:bg-nebula-cyan transition-colors disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Change Password'}
      </button>
    </form>
  );
}
