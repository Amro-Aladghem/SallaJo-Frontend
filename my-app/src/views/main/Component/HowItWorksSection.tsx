const steps = [
  { step: '1', title: 'أنشئ حسابك', desc: 'ابدأ بإنشاء حسابك وأدخل معلومات متجرك.' },
  { step: '2', title: 'عملية تحقق', desc: 'عملية تحقق مع خدمة العملاء سريعة.' },
  { step: '3', title: 'أضف منتجاتك', desc: 'أضف منتجاتك وأسعارك وصورك وعروضك وخصوماتك.' },
  { step: '4', title: 'شارك متجرك', desc: 'شارك رابط متجرك مع عملائك وابدأ بعرض منتجاتك.' },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-12 md:py-16 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">متجرك جاهز خلال دقائق</h2>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {steps.map((s, _i) => (
            <div key={s.step} className="bg-white rounded-xl p-6 border border-gray-100">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center mx-auto text-lg">{s.step}</div>
              <h3 className="mt-4 font-bold text-gray-900">{s.title}</h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
