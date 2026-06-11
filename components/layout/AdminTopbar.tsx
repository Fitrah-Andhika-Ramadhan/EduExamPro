import { auth } from '@/lib/auth';

export async function AdminTopbar() {
  const session = await auth();
  const userName = session?.user?.name || 'Admin Institusi';
  const userImage = session?.user?.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlViOBIrbi7H6kB0GYR_fj3nZeQRJVNLVgzGiSUkl0Ro2D8mZHa2TMrfYPl_4QMorzFkbcj0bQCj9hjlGPOm5cDfdyA-_JbODXun_ihNEhpkDuLb-kJ0QxTx5oGgvbGrcM2V8AQ_AYKI3aO5LS8kCKt0MVmQyd1gtv_KstQEOQiWkDCxukAtSAuySf3I8XmYn814pqkkwzApQaET6NgpthMv2DJ5ulqiP8lHmT1Ggmr-u1IbU_QuEaWZ-wXQQ3t4G0Vi8H4xKOxc-H';
  const roleName = session?.user?.role === 'admin' ? 'Super Administrator' : 'Instruktur';

  return (
    <header className="flex justify-between items-center px-10 w-full h-16 sticky top-0 z-40 bg-surface dark:bg-surface-dark border-b border-outline-variant dark:border-outline shadow-sm">
      <div className="flex items-center bg-surface-container-low rounded-full px-4 py-1.5 w-96 border border-outline-variant">
        <span className="material-symbols-outlined text-on-surface-variant text-sm mr-2">search</span>
        <input className="bg-transparent border-none focus:ring-0 text-body-sm w-full outline-none" placeholder="Cari data, laporan, atau pengguna..." type="text"/>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 border-r border-outline-variant pr-6">
          <button className="text-on-surface-variant hover:text-primary transition-colors relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-0 right-0 w-2 h-2 bg-error-red rounded-full"></span>
          </button>
          <button className="text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">help_outline</span>
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-label-md text-label-md text-primary font-bold">{userName}</p>
            <p className="text-[10px] text-on-surface-variant leading-none">{roleName}</p>
          </div>
          <div className="w-10 h-10 rounded-full overflow-hidden bg-primary-container">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="Profile" className="w-full h-full object-cover" src={userImage}/>
          </div>
        </div>
      </div>
    </header>
  );
}
