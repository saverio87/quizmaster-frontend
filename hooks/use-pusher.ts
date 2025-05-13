"use client"

import { useEffect, useState } from "react"
import { getPusherClient } from "../lib/pusher-client"

export function usePusher(channelName: string, eventName: string) {
    const [isConnected, setIsConnected] = useState(false)
    const [events, setEvents] = useState<any[]>([])
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const pusherClient = getPusherClient()

        if (!pusherClient) {
            setError("Failed to initialize Pusher client")
            return
        }

        // Subscribe to the channel
        const channel = pusherClient.subscribe(channelName)

        // Listen for the specified event
        channel.bind(eventName, (data: any) => {
            console.log(`Received ${eventName} event:`, data)
            setEvents((prev) => [
                {
                    type: eventName,
                    data,
                    timestamp: new Date().toISOString(),
                },
                ...prev,
            ])
        })

        // Set up connection event handlers
        pusherClient.connection.bind("connected", () => {
            console.log("Connected to Pusher")
            setIsConnected(true)
            setError(null)
        })

        pusherClient.connection.bind("error", (err: any) => {
            console.error("Pusher connection error:", err)
            setError(`Connection error: ${err.message || JSON.stringify(err)}`)
            setIsConnected(false)
        })

        // If already connected, set state accordingly
        if (pusherClient.connection.state === "connected") {
            setIsConnected(true)
        }

        // Clean up on unmount
        return () => {
            channel.unbind_all()
            pusherClient.unsubscribe(channelName)
        }
    }, [channelName, eventName])

    return { isConnected, events, error }
}
