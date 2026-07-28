export default function FinalCtaSection() {
  return (
    <section className="py-12 md:py-20 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900">جاهز تبدأ البيع؟</h2>
        <p className="mt-4 text-base md:text-lg text-gray-500 leading-relaxed">
          أنشئ متجرك اليوم، أضف منتجاتك، وشارك رابط متجرك مع عملائك خلال دقائق.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="/seller/sign-up"
            className="w-full sm:w-auto text-center text-base font-bold text-white bg-primary hover:bg-primary/90 transition-colors px-8 py-3.5 rounded-lg"
          >
            أنشئ متجرك مجانًا
          </a>
          <span className="text-sm text-gray-400">أو</span>
          <a
            href="/seller/sign-up"
            className="w-full sm:w-auto text-center text-sm font-medium text-primary border-2 border-primary hover:bg-primary/5 transition-colors px-6 py-3 rounded-lg"
          >
            جرّبه لمدة 3 أيام
          </a>
        </div>
        <p className="mt-3 text-sm text-gray-400">جرّبه لمدة 3 أيام، ثم قرر بنفسك.</p>
      </div>
    </section>
  );
}
