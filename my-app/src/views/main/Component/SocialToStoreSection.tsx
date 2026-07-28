export default function SocialToStoreSection() {
  return (
    <section className="py-12 md:py-16 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">من حسابك على السوشيال ميديا إلى متجر متكامل</h2>

        <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
          <div className="bg-white rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700 shadow-sm">Instagram</div>
          <div className="text-gray-300 text-xl hidden md:block">←</div>
          <div className="text-gray-300 text-xl md:hidden">↓</div>
          <div className="bg-primary text-white rounded-xl px-6 py-3 text-sm font-bold shadow-sm">سلة جو</div>
          <div className="text-gray-300 text-xl hidden md:block">→</div>
          <div className="text-gray-300 text-xl md:hidden">↓</div>
          <div className="bg-white rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700 shadow-sm">متجر إلكتروني جاهز</div>
        </div>

        <p className="mt-8 text-base text-gray-500 leading-relaxed max-w-2xl mx-auto">
          بدل أن يبحث العميل بين منشوراتك القديمة ورسائلك، امنحه مكانًا واحدًا يرى فيه منتجاتك وعروضك وخصوماتك.
        </p>
      </div>
    </section>
  );
}
