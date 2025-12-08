import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer as supabase } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Saving session:', body);
    
    const { data, error } = await supabase
      .from('mantra_sessions')
      .insert([body])
      .select();
    
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    console.log('Session saved:', data);
    return NextResponse.json({ success: true, session: data[0] });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to save session' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const mantraId = searchParams.get('mantraId');
    const date = searchParams.get('date');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let query = supabase.from('mantra_sessions').select('*');

    if (userId) {
      query = query.eq('user_id', userId);
    }

    if (mantraId) {
      query = query.eq('mantra_id', mantraId);
    }

    if (date) {
      query = query.eq('session_date', date);
    }

    if (startDate && endDate) {
      query = query.gte('session_date', startDate).lte('session_date', endDate);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return NextResponse.json({ sessions: data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
}
