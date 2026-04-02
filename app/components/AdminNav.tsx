"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const links = [
  { href: "/", label: "📊 Dashboard" },
  { href: "/users", label: "👥 Users" },
  { href: "/images", label: "🖼️ Images" },
  { href: "/captions", label: "💬 Captions" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center gap-4">
      <span className="font-bold text-white mr-4">⚡ Admin</span>
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={`text-sm px-3 py-1.5 rounded-lg transition ${
            pathname === l.href
              ? "bg-indigo-600 text-white"
              : "text-gray-400 hover:text-white hover:bg-gray-800"
          }`}
        >
          {l.label}
        </Link>
      ))}
      <button
        onClick={handleSignOut}
        className="ml-auto text-sm text-gray-400 hover:text-white"
      >
        Sign out
      </button>
    </nav>
  );
}