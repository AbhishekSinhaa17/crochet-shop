"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Read redirect from sessionStorage (set before OAuth) or URL params as fallback
  const redirect = (typeof window !== 'undefined' && sessionStorage.getItem("auth_redirect")) 
    || searchParams.get("redirect") 
    || "/";

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createClient();
      
      // Get the code from URL
      const code = searchParams.get("code");
      
      if (code) {
        console.log("Auth callback: exchanging code for session...");
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        
        if (error) {
          console.error("Auth callback error:", error.message);
        } else {
          console.log("Auth callback: session established for", data.user?.email);
        }
      } else {
        // No code - check if we already have a session (hash fragment flow)
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          console.log("Auth callback: session already exists for", session.user?.email);
        } else {
          console.error("Auth callback: no code and no session");
        }
      }
      
      // Redirect to target page
      router.push(redirect);
      router.refresh();
    };

    handleCallback();
  }, []);

  return (
    <div style={{ 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      height: "100vh",
      fontFamily: "sans-serif",
      color: "#666"
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ 
          width: "40px", 
          height: "40px", 
          border: "3px solid #e5e7eb", 
          borderTopColor: "#ec4899", 
          borderRadius: "50%", 
          animation: "spin 1s linear infinite",
          margin: "0 auto 16px"
        }} />
        <p>Signing you in...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
