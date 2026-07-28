const features = [
  {
    title: 'أنشئ متجرك خلال دقائق',
    desc: 'أنشئ متجرًا إلكترونيًا خاصًا بك وشاركه مع عملائك كرابط واحد، تمامًا مثل صفحة ملفك على منصات التواصل الاجتماعي.',
  },
  {
    title: 'إدارة المنتجات بسهولة',
    desc: 'أضف منتجاتك، حدّث الأسعار والمعلومات، واحذف المنتجات أو عدّلها بسهولة من لوحة التحكم.',
  },
  {
    title: 'العروض والخصومات',
    desc: 'أضف عروضك وخصوماتك وحدثها في أي وقت لتبقى منتجاتك جذابة لعملائك.',
  },
  {
    title: 'إدارة المخزون بشكل مباشر',
    desc: 'حدّث كميات المنتجات أثناء عملك، وحافظ على معلومات المخزون محدثة بشكل مستمر.',
  },
  {
    title: 'متجر مناسب للمشاركة',
    desc: 'شارك رابط متجرك بسهولة عبر Instagram وFacebook وWhatsApp وغيرها من منصات التواصل.',
  },
  {
    title: 'بسيط بدون تعقيد',
    desc: 'واجهة سهلة وواضحة مصممة لأصحاب المشاريع، بدون الحاجة إلى خبرة تقنية.',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-12 md:py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 text-center">متجرك، تحت سيطرتك</h2>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-white border border-gray-100 rounded-xl p-5 md:p-6 hover:border-primary/20 hover:shadow-sm transition-all">
              <h3 className="font-bold text-gray-900">{f.title}</h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
