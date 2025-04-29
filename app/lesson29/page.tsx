"use client";

import { createClient } from '@/lib/supabase/browserClient';
import { useQuery } from '@tanstack/react-query';
import React from 'react'

export default function Lesson29() {
  const supabase = createClient();

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await supabase.from("users").select("*");

      return res.data;
    }
  })

  const { data: vacations = [] } = useQuery({
    queryKey: ["vacations"],
    queryFn: async () => {
      const res = await supabase.from("vacations").select("*");

      return res.data;
    }
  })

  console.log(users, vacations);

  const deleteVacation = async (vacationId: string) => {
    await supabase.from("vacations").delete().eq("id", vacationId);
  }

  const createUser = async () => {
    await supabase.from("students").insert({
      name: "Primer",
    });
  }

  return (
    <div>
      <div>
        Пользователи:
        {users.map((user) => (<div>{user.email}</div>))}
      </div>
      <div>
        Отпуска:
        {vacations.map((vacation) => (<div><div>{vacation.created_at}</div><button className='bg-red-500 cursor-pointer' onClick={() => deleteVacation(vacation.id)}>Удалить</button></div>))}
      </div>
      <div>
        <input type='text' className='border border-black' />
        <button className='bg-green-500 cursor-pointer' onClick={() => createUser()}>Добавить пользователя</button>
      </div>
    </div>
  )
}


