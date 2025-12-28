"use client"

import { useSocket } from "@/app/context/SocketContext"
import { Wifi, WifiOff } from "lucide-react"

export default function SocketConnectionIndicator() {
  const { isConnected } = useSocket()

  // Only show when disconnected (to avoid clutter)
  if (isConnected) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-2 bg-yellow-100 border border-yellow-300 rounded-lg shadow-lg text-sm">
      <WifiOff className="h-4 w-4 text-yellow-700" />
      <span className="text-yellow-800 font-medium">Reconnecting...</span>
    </div>
  )
}
