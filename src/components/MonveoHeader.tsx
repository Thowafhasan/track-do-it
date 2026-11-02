'use client';

import React from 'react';
import { Bell } from 'lucide-react';

interface MonveoHeaderProps {
  initials?: string;
  title?: string;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
}

export function MonveoHeader({
  initials = 'TW\nF',
  title = 'Home',
  onNotificationClick,
  onProfileClick
}: MonveoHeaderProps) {
  return (
    <div className="w-full flex items-center justify-between py-3 px-1">
      {/* Left: Avatar + Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onProfileClick}
          className="w-10 h-10 rounded-full bg-white text-black font-black text-[11px] leading-tight flex items-center justify-center tracking-tighter uppercase shadow-md active:scale-95 transition"
          title="Profil Pengguna (Thowaf Hasan)"
        >
          <span className="text-center font-bold">TW<br/>F</span>
        </button>

        <h1 className="text-2xl font-bold tracking-tight text-white">
          {title}
        </h1>
      </div>

      {/* Right: Notification Bell in Circular Container */}
      <button
        onClick={onNotificationClick}
        className="w-10 h-10 rounded-full bg-[#1c1c1e] hover:bg-[#2c2c2e] text-zinc-300 hover:text-white flex items-center justify-center transition active:scale-95 border border-zinc-800/40"
        title="Notifikasi"
      >
        <Bell className="w-4 h-4" />
      </button>
    </div>
  );
}
