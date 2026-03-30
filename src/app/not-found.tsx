import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] px-4 text-center">
      <div className="animate-fade-in flex max-w-md flex-col items-center gap-6">
        <Image
          src="/images/logo-renkli.png"
          alt="Dijital Enderun"
          width={160}
          height={160}
          priority
        />

        <h1 className="text-8xl font-extrabold tracking-tight text-[var(--primary)]">
          404
        </h1>

        <h2 className="text-2xl font-semibold text-[var(--foreground)]">
          Sayfa Bulunamadı
        </h2>

        <p className="text-base text-[var(--foreground)] opacity-70">
          Bu sayfa mevcut değil veya kaldırılmış olabilir.
        </p>

        <Link
          href="/"
          className="mt-2 inline-block rounded-lg bg-[var(--primary)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--primary-dark)]"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
}
