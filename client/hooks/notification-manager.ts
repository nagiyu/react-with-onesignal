import { useEffect, useState } from "react"

export function useNotificationManager() {
  const [isSupported, setIsSupported] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null)

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true)
      registerServiceWorker()
    }
  }, [])

  // Service Workerの登録
  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
        updateViaCache: "none",
      })
      const sub = await registration.pushManager.getSubscription()
      setSubscription(sub)
      // 既にlocalStorageにIDがあればセット
      const savedId = localStorage.getItem("subscriptionId")
      if (savedId) setSubscriptionId(savedId)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      }
    }
  }

  // Base64文字列をUint8Arrayに変換
  function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/")

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  // 通知の購読
  const subscribeToPush = async () => {
    try {
      // 通知許可を要求
      const permission = await Notification.requestPermission()
      if (permission !== "granted") {
        throw new Error("通知の許可が得られませんでした")
      }

      const registration = await navigator.serviceWorker.ready

      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        ),
      })
      setSubscription(sub)

      // サーバーに購読情報を登録
      const res = await fetch("/api/register-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sub),
      })
      const data = await res.json()
      if (data.id) {
        setSubscriptionId(data.id)
        localStorage.setItem("subscriptionId", data.id)
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      }
    }
  }

  // 通知の購読解除
  const unsubscribeFromPush = async () => {
    try {
      if (!subscription) return
      // サーバーに購読解除を通知
      await fetch("/api/unregister-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: subscriptionId }),
      })
      await subscription.unsubscribe()
      setSubscription(null)
      setSubscriptionId(null)
      localStorage.removeItem("subscriptionId")
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      }
    }
  }

  // 通知の送信
  const sendNotification = async (message: string) => {
    try {
      if (!subscription) {
        return false
      }

      const response = await fetch("/api/send-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          subscription,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "通知の送信に失敗しました")
      }

      return true
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      }
      return false
    }
  }

  return {
    isSupported,
    subscription,
    subscriptionId,
    error,
    subscribeToPush,
    unsubscribeFromPush,
    sendNotification,
  }
}
