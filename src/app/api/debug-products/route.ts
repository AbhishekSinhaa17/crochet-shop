import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, images")
    .limit(5);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Return raw data with type info
  const debug = products?.map((p: any) => ({
    name: p.name,
    images_type: typeof p.images,
    images_isArray: Array.isArray(p.images),
    images_raw: p.images,
    images_json: JSON.stringify(p.images),
    images_length: p.images?.length,
    first_image: Array.isArray(p.images) ? p.images[0] : "NOT_AN_ARRAY",
  }));

  return NextResponse.json({ products: debug });
}
