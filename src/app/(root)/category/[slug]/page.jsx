"use client"
import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "next/navigation"
import Header from "@/components/Header"
import FooterSection from "@/components/Footer"
import CategoryListings from "@/components/CategoryListings"

export default function CategoryPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const categorySlug = params.slug

  return (
    <div>
      <Header />
      <CategoryListings categorySlug={categorySlug} />
      <FooterSection />
    </div>
  )
}
