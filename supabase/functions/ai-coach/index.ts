import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SafeError {
  message: string;
  code: string;
}

const getSafeError = (error: unknown): SafeError => {
  if (error instanceof Error) {
    if (error.message.includes('LOVABLE_API_KEY')) {
      return {
        message: 'Service configuration error',
        code: 'SERVICE_ERROR'
      };
    }
    
    if (error.message.includes('fetch')) {
      return {
        message: 'Unable to connect to AI service',
        code: 'CONNECTION_ERROR'
      };
    }
  }
  
  return {
    message: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR'
  };
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    
    // Validate messages input
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid request', code: 'INVALID_INPUT' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (messages.length > 50) {
      return new Response(
        JSON.stringify({ error: 'Too many messages', code: 'INVALID_INPUT' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error('[AI Coach Error]', {
        timestamp: new Date().toISOString(),
        error: 'LOVABLE_API_KEY not configured'
      });
      return new Response(
        JSON.stringify({ error: 'Service configuration error', code: 'SERVICE_ERROR' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { 
            role: "system", 
            content: `You are an expert tennis AI coach for the Modo Matchee app. You provide personalized training advice, match analysis, and technique improvements. 
            
You help with:
- Daily/weekly performance overviews
- Technique improvement suggestions
- Pre-match preparation tips
- Training plan creation
- Nutrition advice for tennis players
- Match strategy and tactics

Keep responses clear, actionable, and encouraging. Focus on practical tennis-specific advice.` 
          },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[AI Gateway Error]', {
        status: response.status,
        response: errorText,
        timestamp: new Date().toISOString()
      });

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Too many requests. Please try again later.', code: 'RATE_LIMIT' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Service temporarily unavailable.', code: 'SERVICE_UNAVAILABLE' }),
          { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Unable to process request.', code: 'SERVICE_ERROR' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error('[AI Coach Error]', {
      timestamp: new Date().toISOString(),
      error: e,
    });
    
    const safeError = getSafeError(e);
    return new Response(
      JSON.stringify({ error: safeError.message, code: safeError.code }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
