import InstructorSidebar from '@/components/layout/InstructorSidebar';
import InstructorTopbar from '@/components/layout/InstructorTopbar';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function InstructorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth();
  
  // Note: For now, we allow any logged in user or admin to view this if role is not strictly 'instructor' in the schema yet.
  // Actually, let's enforce logged in
  if (!session?.user) {
    redirect('/sign-in');
  }

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex">
      <InstructorSidebar />
      <main className="ml-64 flex-1 flex flex-col h-screen overflow-y-auto">
        <InstructorTopbar />
        {children}
      </main>
    </div>
  );
}
