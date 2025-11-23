"use client"

import { useParams } from "next/navigation"
import SubscriptionForm from "@/components/admin/subscription-form"

export default function EditSubscriptionPage() {
  const params = useParams()
  
  return <SubscriptionForm planId={params.id} mode="edit" />
}
