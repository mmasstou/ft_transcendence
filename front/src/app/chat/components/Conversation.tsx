import React from 'react';
import Link from "next/link"

export default function Conversation(props: { md: any }) {
    const [IsMounted, setIsMounted] = React.useState(false)
    React.useEffect(() => { setIsMounted(true) }, [])

    if (!IsMounted) return
    return <Link href={`/chat/${props.md.id}`}>
        <h2>{props.md.id}</h2>
    </Link>
}