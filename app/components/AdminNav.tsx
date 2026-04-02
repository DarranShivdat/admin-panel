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
  { href: "/caption-requests", label: "📋 Requests" },
  { href: "/caption-examples", label: "✨ Examples" },
  { href: "/terms", label: "📖 Terms" },
  { href: "/humor-flavors", label: "🌶️ Flavors" },
  { href: "/humor-mix", label: "🎨 Mix" },
  { href: "/llm-providers", label: "🤖 Providers" },
  { href: "/llm-models", label: "🧠 Models" },
  { href: "/llm-prompt-chains", label: "⛓️ Chains" },
  { href: "/llm-responses", label: "💭 Responses" },
  { href: "/signup-domains", label: "🌐 Domains" },
  { href: "/whitelisted-emails", label: "📧 Emails" },
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
    <nav className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center gap-1 flex-wrap">
      <span className="font-bold text-white mr-3">⚡ Admin</span>
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={`text-xs px-2 py-1.5 rounded-lg transition ${
            pathname === l.href
              ? "bg-indigo-600 text-white"
              : "text-gray-400 hover:text-white hover:bg-gray-800"
          }`}
        >
          {l.label}
        </Link>
      ))}
      <button onClick={handleSignOut} className="ml-auto text-xs text-gray-400 hover:text-white">
        Sign out
      </button>
    </nav>
  );
}
