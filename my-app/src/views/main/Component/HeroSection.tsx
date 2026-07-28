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

        <div className="flex-1 flex justify-center">
          <div className="relative w-[260px] h-[530px] md:w-[280px] md:h-[560px] rounded-[40px] border-[4px] border-gray-800 bg-gray-50 shadow-xl overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-gray-800 rounded-b-xl z-10" />
            <div className="pt-6 pb-4 px-3 h-full flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-gray-200 shrink-0" />
                <div className="h-2.5 bg-gray-300 rounded w-20" />
              </div>
              <div className="bg-primary/10 rounded-lg p-2 mb-2">
                <div className="h-32 bg-gray-200 rounded-md mb-1 flex items-center justify-center text-primary font-bold text-xs">شعار المتجر</div>
              </div>
              <div className="grid grid-cols-2 gap-1.5 mb-2">
                <div className="bg-white rounded-md border border-gray-100 p-1.5">
                  <div className="h-10 bg-gray-100 rounded mb-1" />
                  <div className="h-2 bg-gray-200 rounded w-12" />
                </div>
                <div className="bg-white rounded-md border border-gray-100 p-1.5">
                  <div className="h-10 bg-gray-100 rounded mb-1" />
                  <div className="h-2 bg-gray-200 rounded w-12" />
                </div>
              </div>
              <div className="flex gap-1">
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[9px] rounded">عروض</span>
                <span className="px-2 py-0.5 bg-red-50 text-red-500 text-[9px] rounded">خصم</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
