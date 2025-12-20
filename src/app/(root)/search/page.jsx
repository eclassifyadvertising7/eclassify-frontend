"use client"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Header from "@/components/Header"
import FooterSection from "@/components/Footer"
import SearchResults from "@/components/SearchResults"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const initialCategory = searchParams.get('category') || ''

  return (
    <div>
      <Header />
      <SearchResults 
        initialQuery={initialQuery}
        initialCategory={initialCategory}
      />
      <FooterSection />
    </div>
  )
}