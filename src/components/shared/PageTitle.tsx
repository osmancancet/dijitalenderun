interface PageTitleProps {
  title: string;
  subtitle?: string;
}

export default function PageTitle({ title, subtitle }: PageTitleProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground animate-fade-in">
        {title}
      </h1>
      {subtitle && (
        <p className="text-gray-500 mt-2 text-lg animate-fade-in" style={{ animationDelay: "100ms" }}>
          {subtitle}
        </p>
      )}
      <div className="mt-4 flex items-center gap-1.5">
        <div className="w-12 h-1 bg-primary rounded-full animate-slide-in-left" />
        <div className="w-6 h-1 bg-primary/40 rounded-full animate-slide-in-left" style={{ animationDelay: "100ms" }} />
        <div className="w-3 h-1 bg-primary/20 rounded-full animate-slide-in-left" style={{ animationDelay: "200ms" }} />
      </div>
    </div>
  );
}
