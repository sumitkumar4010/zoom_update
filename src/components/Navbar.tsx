'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Current Job', href: '/category/latest-jobs' },
    { name: 'Admit Card', href: '/category/admit-card' },
    { name: 'Result', href: '/category/result' },
    { name: 'Syllabus', href: '/category/syllabus' },
    { name: 'Admission', href: '/category/admission' },
    { name: 'Contact Us', href: '/contact' },
  ];

  return (
    <header className="w-full">
      {/* Top Banner Header */}
      <div className="bg-sky-400 py-3 px-4 flex items-center justify-center border-b border-sky-500">
        <Link href="/" className="flex items-center justify-center gap-3 text-center cursor-pointer">
          {/* Logo Container (Gol / Circular) */}
          <div className="relative w-12 h-12 md:w-14 md:h-14 overflow-hidden rounded-full border-2 border-white shadow-sm bg-white shrink-0">
            <Image
              src="/logo.png"
              alt="ZOOM UPDATE Logo"
              fill
              sizes="(max-width: 768px) 48px, 56px"
              className="object-cover"
              priority
            />
          </div>

          <div className="text-center">
            <h1 className="text-2xl md:text-4xl font-black text-white tracking-wide drop-shadow-xs leading-none">
              ZOOM UPDATE
            </h1>
            <p className="text-xs font-bold text-sky-950 italic mt-0.5">
              ⚡ सबसे तेज Update !
            </p>
          </div>
        </Link>
      </div>

      {/* Main Navigation Bar */}
      <nav className="bg-red-600 text-white shadow-md">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center md:justify-start text-xs md:text-sm font-bold">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 md:px-4 py-2.5 transition ${
                  isActive
                    ? 'bg-amber-500 text-gray-900' // Selected link ke liye Yellow Box
                    : 'hover:bg-red-700 text-white' // Normal link hover
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}