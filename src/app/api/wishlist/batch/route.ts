import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const createClient = async () => {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet: { name: string; value: string; options?: any }[]) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
};

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { operations } = await request.json();

    if (!Array.isArray(operations)) {
      return NextResponse.json({ error: "Operations must be an array" }, { status: 400 });
    }

    const insertIds = operations
      .filter((op: any) => op.type === "add")
      .map((op: any) => ({
        user_id: user.id,
        product_id: op.product_id,
      }));

    const deleteIds = operations
      .filter((op: any) => op.type === "remove")
      .map((op: any) => op.product_id);

    if (deleteIds.length > 0) {
      const { error: deleteError } = await supabase
        .from("wishlist")
        .delete()
        .eq("user_id", user.id)
        .in("product_id", deleteIds);
      
      if (deleteError) throw deleteError;
    }

    if (insertIds.length > 0) {
      const { error: insertError } = await supabase
        .from("wishlist")
        .upsert(insertIds, { onConflict: "user_id,product_id" });
      
      if (insertError) throw insertError;
    }

    return NextResponse.json({ success: true, processed: operations.length });
  } catch (error: any) {
    console.error("Wishlist Batch Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
