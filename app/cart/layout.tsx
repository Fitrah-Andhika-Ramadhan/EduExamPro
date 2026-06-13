import StudentLayout from '@/components/layout/student-layout'

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <StudentLayout activePath="/cart">{children}</StudentLayout>
}
