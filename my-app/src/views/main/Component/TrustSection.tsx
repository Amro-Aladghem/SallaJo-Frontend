export default function TrustSection() {
  return (
    <section className="py-12 md:py-16 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">متجرك متاح لعملائك عندما يحتاجون إليه</h2>
        <p className="mt-4 text-base text-gray-500 leading-relaxed max-w-2xl mx-auto">
          نحرص على توفير تجربة مستقرة لمتجرك، ليبقى متاحًا لعملائك على مدار الساعة.
        </p>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { label: 'متاح على مدار الساعة' },
            { label: 'تحديثات مستمرة' },
            { label: 'دعم فني' },
            { label: 'بيانات متجرك في مكان واحد' },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-xl px-4 py-5 border border-gray-100 text-sm font-bold text-gray-700">
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
