export default function PricingSection() {
  return (
    <section id="pricing" className="py-12 md:py-16 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">ابدأ مجانًا، وقرر بنفسك</h2>
        <p className="mt-3 text-base text-gray-500">
          أنشئ متجرك مجانًا وجرّبه لمدة 3 أيام، وتعرّف على جميع المميزات قبل الاشتراك.
        </p>

        <div className="mt-8 max-w-sm mx-auto bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm">
          <p className="text-sm text-gray-500 font-medium">الخطة الشهرية</p>
          <p className="mt-2 text-4xl font-extrabold text-gray-900">4 <span className="text-lg font-medium text-gray-500">د.أ</span></p>
          <p className="mt-1 text-xs text-gray-400">شهريًا</p>

          <ul className="mt-6 space-y-3 text-right">
            {[
              'إنشاء متجر إلكتروني',
              'إضافة المنتجات',
              'إدارة العروض',
              'إدارة الخصومات',
              'إدارة المخزون',
              'مشاركة رابط المتجر',
              'دعم فني',
            ].map((item) => (
              <li key={item} className="text-sm text-gray-600 flex items-center gap-2">
                <span className="text-primary font-bold text-lg leading-none">✓</span>
                {item}
              </li>
            ))}
          </ul>

          <a
            href="/seller/sign-up"
            className="mt-6 block w-full text-center text-base font-bold text-white bg-primary hover:bg-primary/90 transition-colors px-6 py-3.5 rounded-lg"
          >
            ابدأ تجربتك المجانية
          </a>
          <p className="mt-2 text-xs text-gray-400">3 أيام مجانًا — بدون تعقيد.</p>
        </div>
      </div>
    </section>
  );
}
