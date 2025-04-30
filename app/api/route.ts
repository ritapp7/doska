import { NextResponse } from "next/server";

import GigaChat from 'gigachat';
import { Agent } from 'node:https';
import { createClient } from "@/lib/supabase/serverClient";

const httpsAgent = new Agent({
    rejectUnauthorized: false,
});

const client = new GigaChat({
    timeout: 600,
    model: 'GigaChat',
    httpsAgent: httpsAgent,
    dangerouslyAllowBrowser: true,
    credentials: process.env.CHAT_KEY,
});
 
export async function POST(req) {
  const body = await req.json();
  const supabase = await createClient();

  const get_user_1 = async () => {
    const { data: users = [] } = await supabase.from("users_1").select("*");
    return users;
  }

  try {
    const resp = await client.chat({
      messages: [{role: "system", content: "Ты умеешь получать список пользователей при помощи функции get_users_1"}, { role: 'user_1', content: body.message }],
      functions: [{
        name: 'get_users_1',
        description: 'Получает список всех пользователей',
        parameters: {
          type: 'object',
          properties: {
            arg: {
              type: 'string'
            }
          }
        }
      }],
      function_call: "auto",
    })


    if (resp.choices[0].message.function_call) {
      const functionToCall = resp.choices[0].message.function_call.name;
      if (functionToCall === "get_users_1") {
        const users = await get_users_1();
        return NextResponse.json({ type: "func", message: users, status: 200})
      }
    } else {
      return NextResponse.json({ message: resp.choices[0].message.content, status: 200})
    }
  } catch (e) {
    return NextResponse.json({message: e.message, status: 200})
  }
}
