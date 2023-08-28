import { useEffect, useState } from "react"


export default function useCountdown() {
    const [secondsLeft, setsecondsLeft] = useState(0)
    useEffect(() => {
        if (secondsLeft <= 0) return;
        const timeout = setTimeout(() => { setsecondsLeft(secondsLeft - 1) }, 1000)
        return clearTimeout(timeout)
    }, [])

    function start(seconds: number) {
        setsecondsLeft(seconds);
    }
    return {start, secondsLeft}
}