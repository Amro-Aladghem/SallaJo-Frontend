export default function InventorySection() {
  return (
    <section className="py-12 md:py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">تابع مخزونك أثناء العمل</h2>
            <p className="mt-4 text-base text-gray-500 leading-relaxed">
              حدّث مخزون منتجاتك بسهولة أثناء البيع والعمل، وحافظ على معلومات منتجاتك محدثة لتعرف دائمًا ما هو متوفر.
            </p>
          </div>
          <div className="flex-1 w-full max-w-sm">
            <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs text-gray-400 font-medium pb-2 border-b border-gray-50">
                <span>المنتج</span>
                <span>الكمية</span>
              </div>
              {[
                { name: 'منتج أ', qty: 24, low: false },
                { name: 'منتج ب', qty: 5, low: true },
                { name: 'منتج ج', qty: 0, low: true },
                { name: 'منتج د', qty: 12, low: false },
              ].map((p) => (
                <div key={p.name} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{p.name}</span>
                  <span className={`font-medium ${p.qty === 0 ? 'text-red-500' : p.low ? 'text-orange-500' : 'text-gray-900'}`}>
                    {p.qty === 0 ? 'نفذ' : p.qty}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
