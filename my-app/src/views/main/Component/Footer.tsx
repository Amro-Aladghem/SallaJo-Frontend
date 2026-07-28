export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-right">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <img src="/sallahlogo.png" alt="سلة جو" className="h-7 w-auto brightness-0 invert" />
              <span className="font-bold text-lg text-white">سلة جو</span>
            </div>
            <p className="mt-2 text-sm text-gray-400 max-w-sm">أنشئ متجرك الإلكتروني بسهولة، وابدأ بعرض منتجاتك لعملائك.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            <a href="#hero" className="hover:text-white transition-colors">الرئيسية</a>
            <a href="#features" className="hover:text-white transition-colors">المميزات</a>
            <a href="#pricing" className="hover:text-white transition-colors">الأسعار</a>
            <a href="/support" className="hover:text-white transition-colors">تواصل معنا</a>
            <a href="/seller/sign-in" className="hover:text-white transition-colors">تسجيل الدخول</a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800 text-center text-xs text-gray-500">
          © 2026 سلة جو. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
}
