'use client';
import React from 'react'
import Image from "next/image";



const metadata = {
  title: 'Transcendence',
  description: 'Online Pong Game',
};

export interface conversationData {
	id: string,
	content: string,
	createdAt: Date,
	updatedAt: Date,
	users: any[],
}


export default function page() {
    

  return (
    <div className="flex flex-col justify-center items-center h-full w-full">
        <Image src="/no_conversations.svg" width={600} height={600} alt={""} />
    </div>
  )

}
