"use client"
import { useState, useEffect, Suspense } from "react"
import { useParams, useSearchParams } from "next/navigation"
import Header from "@/components/Header"
import FooterSection from "@/components/Footer"
import CategoryListings from "@/components/CategoryListings"

function CategoryContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const categorySlug = params.slug

  return <CategoryListings categorySlug={categorySlug} />
}

export default function CategoryPage() {
  return (
    <div>
      <Header />
      <Suspense fallback={<div className="flex justify-center items-center min-h-[400px]">Loading category listings...</div>}>
        <CategoryContent />
      </Suspense>
      <FooterSection />
    </div>
  )
}
