import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="w-full">
      {/* Top Main Banner Header */}
      <div className="bg-sky-400 py-3 px-4 flex flex-col md:flex-row items-center justify-between border-b border-sky-500">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-red-600 text-white font-extrabold flex flex-col items-center justify-center text-[9px] text-center p-1 leading-tight border-2 border-white shadow-xs">
            <span>ZOOM</span>
            <span>UPDATE</span>
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl font-black text-white tracking-wide drop-shadow-xs">
              ZOOM UPDATE
            </h1>
            <p className="text-xs font-bold text-sky-950 italic">
              ⚡ सबसे तेज Update !
            </p>
          </div>
        </div>
      </div>

      {/* Main Red Navigation Bar */}
      <nav className="bg-red-600 text-white shadow-md">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-start text-xs md:text-sm font-bold">
          <Link href="/" className="bg-amber-500 text-gray-900 px-4 py-2.5 hover:bg-amber-400 transition">
            Home
          </Link>
          <Link href="/category/latest-jobs" className="px-3 md:px-4 py-2.5 hover:bg-red-700 transition">
            Current Job
          </Link>
          <Link href="/category/admit-card" className="px-3 md:px-4 py-2.5 hover:bg-red-700 transition">
            Admit Card
          </Link>
          <Link href="/category/result" className="px-3 md:px-4 py-2.5 hover:bg-red-700 transition">
            Result
          </Link>
          <Link href="/category/syllabus" className="px-3 md:px-4 py-2.5 hover:bg-red-700 transition">
            Syllabus
          </Link>
          <Link href="/category/admission" className="px-3 md:px-4 py-2.5 hover:bg-red-700 transition">
            Admission
          </Link>
          <Link href="/contact" className="px-3 md:px-4 py-2.5 hover:bg-red-700 transition">
            Contact Us
          </Link>
        
        </div>
      </nav>
    </header>
  );
}