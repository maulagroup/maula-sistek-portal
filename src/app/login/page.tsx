"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Eye,
  EyeOff,
  Cpu,
  TrendingUp,
  Building2,
  Globe,
  GraduationCap,
  Palette,
  Car,
  Heart,
  Sparkles,
  UtensilsCrossed,
  ShoppingCart,
  Home,
} from "lucide-react";

export const dynamic = "force-dynamic";

// Icons for connected ecosystem
const ecosystemIcons = [
  { id: 1, name: "SYSTEM", icon: Cpu },
  { id: 2, name: "VENTURE", icon: TrendingUp },
  { id: 3, name: "PROPERTY", icon: Building2 },
  { id: 4, name: "TRAVEL", icon: Globe },
  { id: 5, name: "ACADEMY", icon: GraduationCap },
  { id: 6, name: "CREATIVE", icon: Palette },
  { id: 7, name: "AUTOMOTIVE", icon: Car },
  { id: 8, name: "HEALTH", icon: Heart },
  { id: 9, name: "BEAUTY", icon: Sparkles },
  { id: 10, name: "DINING", icon: UtensilsCrossed },
  { id: 11, name: "RETAIL", icon: ShoppingCart },
  { id: 12, name: "LIVING", icon: Home },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setError("");

    try {
      const supabase = createClientComponentClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        router.push("/");
      }
    } catch {
      setError("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  // TODO: Ganti dengan URL gambar peta Indonesia kamu
  const INDONESIA_MAP_URL = "https://i.pinimg.com/1200x/4f/a6/b3/4fa6b3e76faf7f46fe55921f3a5a6869.jpg";

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Indonesia Map Image */}
      {INDONESIA_MAP_URL && (
        <div className="absolute inset-0 pointer-events-none opacity-25">
          <img
            src={INDONESIA_MAP_URL}
            alt="Peta Indonesia"
            className="w-full h-full object-cover"
          />
          {/* Overlay hitam agar tidak terlalu mencolok */}
          <div className="absolute inset-0 bg-black/60" />
        </div>
      )}

      {/* Background Indonesia Map Pattern (fallback jika tidak ada URL) */}
      {!INDONESIA_MAP_URL && (
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 border border-slate-700/30 rotate-12 rounded-full" />
          <div className="absolute top-1/3 right-20 w-48 h-48 border border-slate-700/30 -rotate-6 rounded-full" />
          <div className="absolute bottom-20 left-1/4 w-40 h-40 border border-slate-700/30 rotate-45 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-slate-800/20 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-slate-800/20 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-slate-800/20 rounded-full" />
        </div>
      )}

      {/* Background circles */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] border border-slate-800/30 rounded-full" />
        <div className="absolute w-[380px] h-[380px] border border-slate-800/30 rounded-full" />
        <div className="absolute w-[260px] h-[260px] border border-slate-800/30 rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-1">
            MAULA
          </h1>
          <p className="text-white text-xs tracking-[0.3em] uppercase">
            Ecosystem Access
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-6 shadow-2xl backdrop-blur-sm">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 tracking-wide uppercase">
                Username
              </label>
              <Input
                type="email"
                placeholder=""
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-900 border-slate-800 h-10 text-slate-200 placeholder:text-slate-600 focus-visible:ring-slate-700 focus-visible:border-slate-700 text-sm"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 tracking-wide uppercase">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-900 border-slate-800 h-10 text-slate-200 pr-10 focus-visible:ring-slate-700 focus-visible:border-slate-700 text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                className="text-xs text-slate-500 hover:text-slate-400 transition-colors"
              >
                Lupa password?
              </button>
            </div>

            {error && (
              <p className="text-red-400 text-xs text-center">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full h-10 bg-gradient-to-b from-slate-600 to-slate-800 hover:from-slate-500 hover:to-slate-700 text-white font-semibold border border-slate-700 shadow-lg transition-all duration-200 text-sm"
              disabled={loading}
            >
              {loading ? "Loading..." : "Login"}
            </Button>
          </form>
        </div>

        {/* Connected Ecosystem */}
        <div className="mt-8">
          <p className="text-center text-white text-[10px] tracking-[0.2em] uppercase mb-4">
            Connected Ecosystem
          </p>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {ecosystemIcons.map((item) => (
              <div
                key={item.id}
                className="aspect-square bg-slate-900 border border-slate-700 rounded-md flex flex-col items-center justify-center gap-0.5 hover:border-slate-600 hover:bg-slate-800 transition-all duration-200"
              >
                <item.icon className="w-5 h-5 text-slate-400" />
                <span className="text-[9px] text-slate-400 uppercase tracking-wide font-medium">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
