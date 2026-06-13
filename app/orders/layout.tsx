import StudentLayout from '@/components/layout/student-layout'

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
  return <StudentLayout activePath="/orders">{children}</StudentLayout>
}
