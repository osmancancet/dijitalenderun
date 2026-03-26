interface PageTitleProps {
  title: string;
  subtitle?: string;
}

export default function PageTitle({ title, subtitle }: PageTitleProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-foreground">{title}</h1>
      {subtitle && (
        <p className="text-gray-500 mt-2">{subtitle}</p>
      )}
      <div className="w-20 h-1 bg-primary rounded-full mt-3" />
    </div>
  );
}
