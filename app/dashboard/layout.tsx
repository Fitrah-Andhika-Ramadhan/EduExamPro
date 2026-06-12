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
    <div className="bg-background min-h-screen flex flex-col">
      {children}
    </div>
  );
}
