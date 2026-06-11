import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import { redirect } from 'next/navigation'
import { signOut } from '@/lib/auth'
import { handleSignOut } from '@/app/actions/auth-actions'

interface SharedNavBarProps {
  email?: string | null
  name?: string | null
  role?: string | null
  currentPath?: string
}

const userLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/tests', label: 'Tryout' },
  { href: '/results', label: 'Hasil Saya' },
]

const adminLinks = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/users', label: 'Pengguna' },
  { href: '/admin/tests', label: 'Paket Ujian' },
  { href: '/admin/results', label: 'Hasil Ujian' },
]

export default function SharedNavBar({ email, name, role, currentPath }: SharedNavBarProps) {
  const isActive = (href: string) => {
    if (!currentPath) return false
    // Exact match for overview/dashboard to avoid matching subpaths wrongly
    if (href === '/admin' && currentPath !== '/admin') return false
    if (href === '/dashboard' && currentPath !== '/dashboard') return false
    return currentPath.startsWith(href)
  }

  const linksToRender = role === 'admin' ? adminLinks : userLinks

  return (
    <header className="sticky top-0 z-50 bg-canvas border-b border-hairline transition-all">
      <div className="container max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
        {/* Logo + Nav */}
        <div className="flex items-center gap-8">
          <Link href={role === 'admin' ? '/admin' : '/dashboard'} className="flex items-center gap-2 font-bold shrink-0 text-primary">
            <BookOpen className="w-6 h-6" />
            <span className="heading-md hidden sm:inline">EduBangsa</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {linksToRender.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`body-md transition-colors ${
                  isActive(link.href) ? 'font-bold text-ink' : 'text-ink-mute hover:text-link-blue'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right side: user info + sign out */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            {name && (
              <span className="body-strong text-ink leading-tight">{name}</span>
            )}
            {email && (
              <span className="caption text-ink-mute leading-tight">{email}</span>
            )}
          </div>
          <form action={handleSignOut}>
            <button
              type="submit"
              className="button-secondary-pill !py-2 !px-4 text-sm"
            >
              Keluar
            </button>
          </form>
        </div>
      </div>

      {/* Mobile bottom nav strip */}
      <div className="md:hidden flex items-center gap-4 px-6 pb-3 overflow-x-auto bg-canvas">
        {linksToRender.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm whitespace-nowrap transition-colors ${
              isActive(link.href) ? 'font-bold text-ink' : 'text-ink-mute hover:text-ink'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </header>
  )
}
