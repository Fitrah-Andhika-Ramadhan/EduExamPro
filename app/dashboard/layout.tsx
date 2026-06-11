import UserSidebar from '@/components/layout/UserSidebar';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/sign-in');
  }

  // @ts-ignore
  if (session.user.role === 'admin') {
    redirect('/admin');
  }

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex overflow-hidden">
      <UserSidebar />
      <main className="ml-64 flex-1 flex flex-col h-screen overflow-y-auto custom-scrollbar">
        {children}
      </main>
    </div>
  );
}
