"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, Home, ArrowLeft } from "lucide-react"
import Link from "next/link"
import CarForm from "@/components/car-form/page"
import PropertyForm from "@/components/property-form/page"

export default function PostAdPage() {
  const [selectedCategory, setSelectedCategory] = useState(null)

  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
  }

  const handleBack = () => {
    setSelectedCategory(null)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-primary">Post Your Ad</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!selectedCategory ? (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Choose a Category</h2>
              <p className="text-lg text-muted-foreground">Select what you want to sell</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card
                className="hover:shadow-lg transition-all cursor-pointer hover:scale-105"
                onClick={() => handleCategorySelect("cars")}
              >
                <CardHeader className="text-center">
                  <Car className="h-16 w-16 mx-auto mb-4 text-primary" />
                  <CardTitle className="text-xl">Cars</CardTitle>
                  <CardDescription>Sell your vehicle with detailed specifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Select Cars</Button>
                </CardContent>
              </Card>

              <Card
                className="hover:shadow-lg transition-all cursor-pointer hover:scale-105"
                onClick={() => handleCategorySelect("properties")}
              >
                <CardHeader className="text-center">
                  <Home className="h-16 w-16 mx-auto mb-4 text-primary" />
                  <CardTitle className="text-xl">Properties</CardTitle>
                  <CardDescription>List your property with complete details</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Select Properties</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Categories
              </Button>
              <h2 className="text-2xl font-bold capitalize">
                {selectedCategory === "cars" ? "Car Details" : "Property Details"}
              </h2>
            </div>

            {selectedCategory === "cars" && <CarForm />}
            {selectedCategory === "properties" && <PropertyForm />}
          </div>
        )}
      </main>
    </div>
  )
}
