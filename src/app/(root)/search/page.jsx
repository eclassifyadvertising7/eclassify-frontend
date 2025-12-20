"use client"
import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Header from "@/components/Header"
import FooterSection from "@/components/Footer"
import SearchResults from "@/components/SearchResults"

function SearchContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const initialCategory = searchParams.get('category') || ''

  return (
    <SearchResults 
      initialQuery={initialQuery}
      initialCategory={initialCategory}
    />
  )
}

export default function SearchPage() {
  return (
    <div>
      <Header />
      <Suspense fallback={<div className="flex justify-center items-center min-h-[400px]">Loading search results...</div>}>
        <SearchContent />
      </Suspense>
      <FooterSection />
    </div>
  )
}