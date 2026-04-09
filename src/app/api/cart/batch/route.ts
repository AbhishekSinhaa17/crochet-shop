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

    // Sort operations into upserts and deletes
    const upserts = operations
      .filter((op: any) => op.type === "upsert")
      .map((op: any) => ({
        user_id: user.id,
        product_id: op.product_id,
        quantity: op.quantity,
      }));

    const deleteIds = operations
      .filter((op: any) => op.type === "delete")
      .map((op: any) => op.product_id);

    // Execute deletions first (though order usually doesn't matter for distinct products)
    if (deleteIds.length > 0) {
      const { error: deleteError } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id)
        .in("product_id", deleteIds);
      
      if (deleteError) throw deleteError;
    }

    // Execute upserts
    if (upserts.length > 0) {
      const { error: upsertError } = await supabase
        .from("cart_items")
        .upsert(upserts, { onConflict: "user_id,product_id" });
      
      if (upsertError) throw upsertError;
    }

    return NextResponse.json({ success: true, processed: operations.length });
  } catch (error: any) {
    console.error("Cart Batch Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
