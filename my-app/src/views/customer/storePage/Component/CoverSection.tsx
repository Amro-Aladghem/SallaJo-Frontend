interface Props {
  coverImageLink: string | null;
  logoImageUrl: string;
  storeName: string;
}

export default function CoverSection({ coverImageLink, logoImageUrl, storeName }: Props) {
  return (
    <div className="px-4 pt-4">
      <div className="relative w-full rounded-xl overflow-hidden" style={{ aspectRatio: '16 / 6 ' }}>
        <img
          src={coverImageLink || '/placeholder-cover.png'}
          alt={storeName}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
