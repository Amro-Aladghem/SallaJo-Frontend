export default function HeroSection() {
  return (
    <section id="hero" className="pt-24 pb-12 md:pt-32 md:pb-20 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-16">
        <div className="flex-1 text-center md:text-right">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            أنشئ متجرك الإلكتروني خلال دقائق
          </h1>
          <p className="mt-2 text-xl md:text-2xl font-bold text-primary">مجانا وبعدها قرر</p>
          <p className="mt-4 text-base md:text-lg text-gray-500 leading-relaxed max-w-xl">
            أنشئ متجرك بسهولة كما تنشئ ملفك الشخصي على منصات التواصل الاجتماعي، وأضف منتجاتك وعروضك وخصوماتك وابدأ البيع.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 justify-center md:justify-start">
            <a
              href="/seller/sign-up"
              className="w-full sm:w-auto text-center text-sm font-bold text-white bg-primary hover:bg-primary/90 transition-colors px-6 py-3.5 rounded-lg"
            >
              انشئ متجرك وابدأ تجربة لمدة 3 ايام مجانا
            </a>
            <span className="text-sm text-gray-400">أو</span>
            <a
              href="/support"
              className="w-full sm:w-auto text-center text-sm font-medium text-primary border-2 border-primary hover:bg-primary/5 transition-colors px-6 py-3 rounded-lg"
            >
              تواصل مع خدمة العملاء
            </a>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <a href="https://sallahjo.taskalyze.com/store/cookienoura" target="_blank" rel="noopener noreferrer" className="relative w-[260px] h-[530px] md:w-[280px] md:h-[560px] rounded-[40px] border-[4px] border-gray-800 bg-white shadow-xl overflow-hidden block">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-gray-800 rounded-b-xl z-10" />
            <div className="h-full w-full">
              <img src="/storewebsiteImage.png" alt="متجر سلة جو" className="w-full h-full object-cover" />
            </div>
          </a>
          <p className="text-xs text-gray-400 mt-2 text-center">احد متاجر عملائنا</p>
        </div>
      </div>
    </section>
  );
}
