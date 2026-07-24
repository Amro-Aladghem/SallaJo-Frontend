import type { StoreInfoForSellerDto } from '@/types/dtos';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Store, Package, BadgePercent, Gift } from 'lucide-react';

interface Props {
  store: StoreInfoForSellerDto | null | undefined;
}

function Box({
  icon,
  title,
  description,
  buttonText,
  onClick,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  buttonText: string;
  onClick?: () => void;
  children?: React.ReactNode;
}) {
  return (
    <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        {description && <p className="text-sm text-gray-500">{description}</p>}
        {children}
        <Button variant="outline" className="mt-1 w-full border-primary text-primary hover:bg-primary hover:text-white transition-colors" onClick={onClick}>
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function DashboardBoxes({ store }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 md:p-6 max-w-4xl mx-auto">
      {/* Store Info */}
      <Box
        icon={<Store className="h-7 w-7 text-primary" />}
        title="المتجر"
        buttonText="عرض المتجر"
        description={store?.description ? undefined : 'معلومات متجرك'}
      >
      </Box>

      {/* Products */}
      <Box
        icon={<Package className="h-7 w-7 text-primary" />}
        title="المنتجات"
        description="إدارة وعرض جميع منتجات متجرك"
        buttonText="المنتجات"
      />

      {/* Discounts */}
      <Box
        icon={<BadgePercent className="h-7 w-7 text-primary" />}
        title="الخصومات"
        description="إدارة الخصومات والعروض على المنتجات"
        buttonText="الخصومات"
      />

      {/* Offers */}
      <Box
        icon={<Gift className="h-7 w-7 text-primary" />}
        title="العروض"
        description="إنشاء وإدارة العروض التسويقية"
        buttonText="العروض"
      />
    </div>
  );
}
