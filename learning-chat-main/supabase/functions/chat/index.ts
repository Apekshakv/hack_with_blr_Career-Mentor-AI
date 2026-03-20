import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const BASE_URL = "https://api.hindsight.vectorize.io";
const BANK_ID = "career-advisor";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get("HINDSIGHT_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Hindsight API key not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    };

    const { action, message } = await req.json();

    // Init bank via PUT
    if (action === "init-bank") {
      try {
        const res = await fetch(`${BASE_URL}/v1/default/banks/${BANK_ID}`, {
          method: "PUT", headers,
          body: JSON.stringify({
            name: "Career Advisor",
            mission: "You are a career advisor AI that helps professionals navigate career transitions, skill development, and professional growth. You remember user preferences, rejected suggestions, career goals, and past advice to provide increasingly personalized guidance. Always be encouraging but data-driven.",
          }),
        });
        const data = await res.json();
        return new Response(JSON.stringify({ success: true, data }), {
          status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch {
        return new Response(JSON.stringify({ success: true, existing: true }), {
          status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Retain: POST /v1/default/banks/{bank_id}/memories
    if (action === "retain") {
      const res = await fetch(`${BASE_URL}/v1/default/banks/${BANK_ID}/memories`, {
        method: "POST", headers,
        body: JSON.stringify({ items: [{ content: message, context: "career advising session" }] }),
      });
      const bodyText = await res.text();
      console.log("Retain:", res.status, bodyText);
      if (!res.ok) {
        return new Response(JSON.stringify({ error: `Retain failed: ${res.status}` }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ success: true, data: JSON.parse(bodyText) }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Recall: POST /v1/default/banks/{bank_id}/memories/recall
    if (action === "recall") {
      const res = await fetch(`${BASE_URL}/v1/default/banks/${BANK_ID}/memories/recall`, {
        method: "POST", headers,
        body: JSON.stringify({ query: message, budget: "mid" }),
      });
      const bodyText = await res.text();
      console.log("Recall:", res.status, bodyText.slice(0, 200));
      if (!res.ok) {
        return new Response(JSON.stringify({ results: [] }), {
          status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(bodyText, {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Reflect: POST /v1/default/banks/{bank_id}/reflect
    if (action === "reflect") {
      const res = await fetch(`${BASE_URL}/v1/default/banks/${BANK_ID}/reflect`, {
        method: "POST", headers,
        body: JSON.stringify({ query: message, budget: "mid" }),
      });
      const bodyText = await res.text();
      console.log("Reflect:", res.status, bodyText.slice(0, 200));

      if (!res.ok) {
        // Fallback to Lovable AI with recall context
        const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
        if (LOVABLE_API_KEY) {
          let context = "";
          try {
            const recallRes = await fetch(`${BASE_URL}/v1/default/banks/${BANK_ID}/memories/recall`, {
              method: "POST", headers,
              body: JSON.stringify({ query: message, budget: "low" }),
            });
            if (recallRes.ok) {
              const recallData = await recallRes.json();
              if (recallData.results?.length) {
                context = "\n\nRelevant memories about this user:\n" +
                  recallData.results.map((r: any) => `- ${r.text}`).join("\n");
              }
            }
          } catch {}

          const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              model: "google/gemini-3-flash-preview",
              messages: [
                { role: "system", content: `You are Pathfinder, a career advisor AI. You help professionals with career transitions, skill development, and growth. Be encouraging and data-driven.${context}` },
                { role: "user", content: message },
              ],
            }),
          });

          if (aiRes.ok) {
            const aiData = await aiRes.json();
            const text = aiData.choices?.[0]?.message?.content || "I couldn't generate a response.";
            return new Response(JSON.stringify({ text, fallback: true }), {
              status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
        }

        return new Response(JSON.stringify({ error: `Reflect failed: ${res.status}` }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(bodyText, {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
