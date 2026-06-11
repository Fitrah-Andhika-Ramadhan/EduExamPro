"use client"

import { useSidebar } from './SidebarContext';

export function SidebarToggle() {
  const { toggleMobileOpen } = useSidebar();

  return (
    <button 
      onClick={toggleMobileOpen}
      className="md:hidden mr-4 text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center p-2 -ml-2 rounded-lg active:bg-surface-variant/50"
      aria-label="Toggle Menu"
    >
      <span className="material-symbols-outlined">menu</span>
    </button>
  );
}
