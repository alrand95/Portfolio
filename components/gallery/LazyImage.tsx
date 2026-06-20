import Image from 'next/image';

interface LazyImageProps {
    src: string;
    alt: string;
    fill?: boolean;
    sizes?: string;
    quality?: number;
    className?: string;
}

export function LazyImage({ src, alt, fill, sizes, quality = 60, className }: LazyImageProps) {
    return (
        <div className="w-full h-full relative">
            {/* Placeholder Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/20 via-black to-neon-blue/20 opacity-80" />
            <Image
                src={src}
                alt={alt}
                fill={fill}
                sizes={sizes}
                quality={quality}
                className={className}
                loading="lazy"
            />
        </div>
    );
}
