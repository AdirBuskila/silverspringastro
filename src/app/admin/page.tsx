import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Container from '@/components/Container';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { getBuiltInPhotos } from '@/lib/photoCatalog';

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

  // Being signed in isn't enough: the account must be on the admin list.
  // An error counts as "no", so this fails closed.
  const { data: isAdmin } = await supabase.rpc('is_site_admin');

  return (
    <main className="min-h-screen py-12">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-space-50 mb-2">Manage Your Photos</h1>
          <p className="text-sm text-space-500 mt-1">Signed in as: {user.email}</p>
        </div>

        {isAdmin === true ? (
          <AdminDashboard builtInPhotos={getBuiltInPhotos()} />
        ) : (
          <p className="text-space-300">This account doesn&apos;t have access to manage the site.</p>
        )}
      </Container>
    </main>
  );
}

