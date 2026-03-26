"use client";

import dynamic from "next/dynamic";

const AdminShell = dynamic(() => import("@/components/admin/AdminShell"), {
  ssr: false,
  loading: () => <AdminSkeleton />,
});

function AdminSkeleton() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar skeleton */}
      <div className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 p-4">
        <div className="h-10 bg-gray-200 rounded-lg mb-6 animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
      {/* Content skeleton */}
      <div className="flex-1 p-6">
        <div className="h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse" />
        <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
