type BlogCardImageProps = {
  src: string;
  alt: string;
};

export function BlogCardImage({src, alt}: BlogCardImageProps) {
  return (
    <div className="relative h-[226px] w-full shrink-0 overflow-clip bg-primary-500">
      <img alt={alt} className="pointer-events-none absolute inset-0 size-full object-cover" src={src} />
    </div>
  );
}
