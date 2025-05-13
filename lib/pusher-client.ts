import PusherClient from "pusher-js"

// Client-side Pusher instance (singleton)
let pusherClient: PusherClient | null = null

export function getPusherClient() {
    if (!pusherClient && typeof window !== "undefined") {
        pusherClient = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
            forceTLS: true,
        })
    }
    return pusherClient
}
