import Image from "next/image";

interface CoverImageProps {
  src: string;
  alt: string;
  priority?: boolean;
}

/**
 * Imagen de cabecera para hubs editoriales y paginas institucionales.
 * Usa next/image (optimizacion automatica: redimensionado, WebP/AVIF,
 * lazy-load salvo `priority`) para no penalizar Core Web Vitals.
 */
export function CoverImage({ src, alt, priority = false }: CoverImageProps) {
  return (
    <div className="relative mb-8 h-56 w-full overflow-hidden rounded-xl sm:h-72">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 768px"
        priority={priority}
        className="object-cover"
      />
    </div>
  );
}
