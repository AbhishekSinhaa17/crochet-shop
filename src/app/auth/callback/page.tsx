"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Read redirect from sessionStorage (set before OAuth) or URL params as fallback
    const redirect = (typeof window !== 'undefined' ? sessionStorage.getItem("auth_redirect") : null) 
      || searchParams.get("redirect") 
      || "/";

    const handleCallback = async () => {
      const supabase = createClient();
      
      // Get the code from URL
      const code = searchParams.get("code");
      
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) console.error("Auth callback error:", error.message);
      }
      
      // Clear the stored redirect
      if (typeof window !== 'undefined') sessionStorage.removeItem("auth_redirect");
      
      // Redirect to target page
      router.push(redirect);
      router.refresh();
    };

    handleCallback();
  }, [router, searchParams]);

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

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthCallbackContent />
    </Suspense>
  );
}
