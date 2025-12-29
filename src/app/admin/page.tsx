import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Container from '@/components/Container';
import AdminDashboard from '@/components/admin/AdminDashboard';

/**
 * Admin Dashboard
 * 
 * Protected admin page for managing astronomy images.
 */
export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <main className="min-h-screen py-12">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-space-50 mb-2">Admin Dashboard</h1>
          <p className="text-space-400">Manage your astronomy gallery</p>
          <p className="text-sm text-space-500 mt-1">Logged in as: {user.email}</p>
        </div>

        <AdminDashboard />
      </Container>
    </main>
  );
}

