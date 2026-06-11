import { auth } from '@/lib/auth';
import { SidebarToggle } from './SidebarToggle';

export async function AdminTopbar() {
  const session = await auth();
  const userName = session?.user?.name || 'Admin Institusi';
  const userImage = session?.user?.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlViOBIrbi7H6kB0GYR_fj3nZeQRJVNLVgzGiSUkl0Ro2D8mZHa2TMrfYPl_4QMorzFkbcj0bQCj9hjlGPOm5cDfdyA-_JbODXun_ihNEhpkDuLb-kJ0QxTx5oGgvbGrcM2V8AQ_AYKI3aO5LS8kCKt0MVmQyd1gtv_KstQEOQiWkDCxukAtSAuySf3I8XmYn814pqkkwzApQaET6NgpthMv2DJ5ulqiP8lHmT1Ggmr-u1IbU_QuEaWZ-wXQQ3t4G0Vi8H4xKOxc-H';
  // @ts-ignore
  const roleName = session?.user?.role === 'admin' ? 'Super Administrator' : 'Instruktur';

  return (
    <header className="flex justify-between items-center px-4 md:px-10 w-full h-16 sticky top-0 z-40 bg-surface dark:bg-surface-dark border-b border-outline-variant dark:border-outline shadow-sm">
      <div className="flex items-center w-full md:w-auto">
        <SidebarToggle />
        <div className="hidden md:flex items-center bg-surface-container-low rounded-full px-4 py-1.5 w-96 border border-outline-variant">
          <span className="material-symbols-outlined text-on-surface-variant text-sm mr-2">search</span>
          <input className="bg-transparent border-none focus:ring-0 text-body-sm w-full outline-none" placeholder="Cari data, laporan, atau pengguna..." type="text"/>
        </div>
        {/* Mobile Search Icon */}
        <button className="md:hidden text-on-surface-variant ml-auto mr-4">
          <span className="material-symbols-outlined">search</span>
        </button>
      </div>
      <div className="flex items-center gap-3 md:gap-6 shrink-0">
        <div className="flex items-center gap-2 md:gap-4 border-r border-outline-variant pr-3 md:pr-6">
          <button className="text-on-surface-variant hover:text-primary transition-colors relative">
            <span className="material-symbols-outlined text-xl md:text-2xl">notifications</span>
            <span className="absolute top-0 right-0 w-2 h-2 bg-error-red rounded-full"></span>
          </button>
          <button className="hidden sm:block text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-xl md:text-2xl">help_outline</span>
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="font-label-md text-label-md text-primary font-bold">{userName}</p>
            <p className="text-[10px] text-on-surface-variant leading-none">{roleName}</p>
          </div>
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden bg-primary-container shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="Profile" className="w-full h-full object-cover" src={userImage}/>
          </div>
        </div>
      </div>
    </header>
  );
}
