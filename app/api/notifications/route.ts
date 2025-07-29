import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
  .from('notifications')
  .select(`
    *,
    actor:actor_id (
      id, pseudo, avatar_url
    ),
    song:entity_id (
      id, title
    )
  `)
  .eq('recipient_id', user.id)
  .order('created_at', { ascending: false })
  .limit(15);


  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
