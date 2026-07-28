import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const links = [
  { label: 'الرئيسية', href: '/', section: 'hero' },
  { label: 'المميزات', href: '/', section: 'features' },
  { label: 'كيف يعمل؟', href: '/', section: 'how-it-works' },
  { label: 'الأسعار', href: '/', section: 'pricing' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleNav = (href: string, section: string) => {
    setOpen(false);
    if (location.pathname === '/') {
      const el = document.getElementById(section);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(href);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="/" onClick={(e) => { e.preventDefault(); handleNav('/', 'hero'); }} className="flex items-center gap-2">
          <img src="/sallahlogo.png" alt="سلة جو" className="h-8 w-auto" />
          <span className="font-bold text-xl text-gray-900">سلة جو</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={(e) => { e.preventDefault(); handleNav(l.href, l.section); }}
              className="text-sm text-gray-600 hover:text-primary transition-colors font-medium"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <a
            href="/seller/sign-in"
            className="text-sm text-gray-600 hover:text-primary transition-colors font-medium px-4 py-2"
          >
            تسجيل الدخول
          </a>
          <a
            href="/seller/sign-up"
            className="text-sm font-bold text-white bg-primary hover:bg-primary/90 transition-colors px-5 py-2.5 rounded-lg"
          >
            أنشئ متجرك مجانًا
          </a>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <a
            href="/seller/sign-in"
            className="text-xs font-bold text-white bg-primary hover:bg-primary/90 transition-colors px-3 py-1.5 rounded-lg whitespace-nowrap"
          >
            تسجيل الدخول
          </a>
          <button onClick={() => setOpen(!open)} className="text-gray-600 p-2">
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={(e) => { e.preventDefault(); handleNav(l.href, l.section); }}
              className="block text-sm text-gray-600 hover:text-primary transition-colors font-medium py-2"
            >
              {l.label}
            </a>
          ))}
          <hr className="border-gray-100" />
          <a href="/seller/sign-in" className="block text-sm text-gray-600 font-medium py-2">تسجيل الدخول</a>
          <a
            href="/seller/sign-up"
            className="block text-center text-sm font-bold text-white bg-primary hover:bg-primary/90 transition-colors px-5 py-3 rounded-lg"
          >
            أنشئ متجرك مجانًا
          </a>
        </div>
      )}
    </nav>
  );
}
