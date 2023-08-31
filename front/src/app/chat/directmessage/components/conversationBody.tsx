import React from 'react'
import { conversationData } from './privateConversation'

function ConversationBody({ convBody }: { convBody: conversationData | null}) {
  return (
    <div className='text-white'>
        {convBody ? 
            <section>
                <div className='flex justify-between border p-5'>
                    <p>{convBody.users[0].login}</p>
                    <p>{convBody.users[1].login}</p>
                </div>
                <p>{convBody.id}</p>
                <span>{convBody.content}</span>
            </section>
            :
            <section>No Content</section>}
    </div>
  )
}

export default ConversationBody