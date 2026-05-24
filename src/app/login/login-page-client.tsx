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

// Indonesia map URL - fill this with your map image URL
const INDONESIA_MAP_URL = "";

export function LoginPageClient() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const supabase = createClientComponentClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      if (data.session) {
        router.refresh();
        router.push("/");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Gagal login. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Indonesia Map */}
      {INDONESIA_MAP_URL && (
        <div className="absolute inset-0">
          <img
            src={INDONESIA_MAP_URL}
            alt="Indonesia Map"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
      )}

      {/* Fallback Background Pattern */}
      {!INDONESIA_MAP_URL && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="absolute w-[500px] h-[500px] border border-slate-800/30 rounded-full" />
          <div className="absolute w-[380px] h-[380px] border border-slate-800/30 rounded-full" />
          <div className="absolute w-[260px] h-[260px] border border-slate-800/30 rounded-full" />

          {/* Decorative circles */}
          <div className="absolute w-2 h-2 bg-slate-700/50 rounded-full top-[20%] left-[15%]" />
          <div className="absolute w-1.5 h-1.5 bg-slate-700/30 rounded-full top-[40%] right-[20%]" />
          <div className="absolute w-1 h-1 bg-slate-700/40 rounded-full bottom-[30%] left-[25%]" />
        </div>
      )}

      <div className="relative z-10 w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            MAULA
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm tracking-[0.4em] uppercase">
            Ecosystem Access
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-950/90 border border-slate-800 rounded-lg p-6 sm:p-8 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-950/50 border border-red-800/50 rounded-md p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-slate-400 tracking-wide uppercase">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="username@maula.id"
                required
                disabled={loading}
                className="bg-slate-900 border-slate-700 text-slate-200 placeholder:text-slate-600 h-10"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-slate-400 tracking-wide uppercase">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=""
                  required
                  disabled={loading}
                  className="bg-slate-900 border-slate-700 text-slate-200 placeholder:text-slate-600 h-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="text-sm">
              <a href="#" className="text-slate-500 hover:text-slate-300 transition-colors">
                Lupa password?
              </a>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-b from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 border border-slate-600 text-white font-semibold h-11 shadow-lg"
            >
              {loading ? "Loading..." : "Login"}
            </Button>
          </form>
        </div>

        {/* Connected Ecosystem */}
        <div className="space-y-4">
          <p className="text-center text-slate-500 text-[10px] tracking-[0.3em] uppercase">
            Connected Ecosystem
          </p>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {ecosystemIcons.map((item) => (
              <div
                key={item.id}
                className="aspect-square bg-slate-900/70 border border-slate-700/50 rounded-md flex flex-col items-center justify-center gap-0.5 hover:border-slate-600 hover:bg-slate-900 transition-all duration-200"
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
