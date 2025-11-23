"use client"
import { useState } from "react"
import { Heart, Phone, MessageCircle, Star, Eye, Fuel, Users, Palette, Settings, Zap } from "lucide-react"
import Header from "@/components/Header"
import FooterSection from "@/components/Footer"

export default function productDetails() {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [message, setMessage] = useState("")

  const carImages = [
    "./assets/img/car-1.png",
    "./assets/img/car-1.png",
    "./assets/img/car-1.png",
    "./assets/img/car-1.png",
  ]

  const carSpecs = [
    { icon: Settings, label: "Car Brand", value: "Lamborghini" },
    { icon: Settings, label: "Year of Registration", value: "2022" },
    { icon: Eye, label: "Mileage", value: "15,000 km" },
    { icon: Eye, label: "View", value: "Luxury" },
    { icon: Fuel, label: "Fuel", value: "Petrol" },
    { icon: Users, label: "Seating", value: "2 Seater" },
    { icon: Palette, label: "Colors", value: "Red" },
    { icon: Zap, label: "Brand Focus", value: "Super Car" },
    { icon: Settings, label: "Engine Capacity (CC)", value: "5,204 - 5,600 CC" },
  ]

  return (
    <>
    <Header/>
        <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Images and Specs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Image */}
          <div className="relative">
            <img
              src={carImages[selectedImage] || "/placeholder.svg"}
              alt="Car main view"
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
            </button>
          </div>

          {/* Thumbnail Images */}
          <div className="flex gap-3 overflow-x-auto">
            {carImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImage === index ? "border-cyan-500" : "border-gray-200"
                }`}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`Car view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Car Specifications */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
              Overview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {carSpecs.map((spec, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <spec.icon className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">{spec.label}</p>
                    <p className="font-medium">{spec.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Description</h3>
            <p className="text-gray-700 leading-relaxed">
              This stunning red Lamborghini Huracan Evo represents the pinnacle of automotive engineering and luxury.
              With its powerful V10 engine and cutting-edge aerodynamics, this supercar delivers an unmatched driving
              experience. The vehicle has been meticulously maintained and comes with a comprehensive service history.
              Perfect for enthusiasts who demand the very best in performance and style.
            </p>
          </div>
        </div>

        {/* Right Column - Car Info and Contact */}
        <div className="space-y-6">
          {/* Car Title and Price */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-2xl font-bold text-gray-900">Lamborghini Huracan Evo</h1>
              <Heart
                className={`w-6 h-6 cursor-pointer ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                onClick={() => setIsFavorite(!isFavorite)}
              />
            </div>
            <p className="text-3xl font-bold text-cyan-600 mb-2">$ 3,70,000</p>
            <p className="text-sm text-gray-500 mb-4">📅 Posted on: Nov 20, 2024</p>

            <div className="inline-block bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium mb-4">
              Featured
            </div>

            {/* Seller Info */}
            <div className="border-t pt-4">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/placeholder.svg?height=50&width=50"
                  alt="Seller"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold">John Smith</h4>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-600">4.8 (127 reviews)</span>
                  </div>
                  <p className="text-sm text-gray-500">Active since 2019</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button className="flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  Start Chat
                </button>
                <button className="flex items-center justify-center gap-2 bg-cyan-600 text-white px-4 py-3 rounded-lg hover:bg-cyan-700 transition-colors">
                  <Phone className="w-4 h-4" />
                  Call
                </button>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold mb-3">Features</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
              <span>Price negotiable</span>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold mb-4">Send Message</h3>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hi, I am interested in [Lamborghini Huracan Evo]. Please let me know if it's still available. Thanks."
              className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
            <button className="w-full mt-3 bg-cyan-600 text-white py-3 rounded-lg hover:bg-cyan-700 transition-colors">
              Send Message
            </button>
          </div>

          {/* View All Ads */}
          <button className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors">
            View all Classified Ads
          </button>

          {/* Safety Tips */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs">!</span>
              </div>
              <div>
                <p className="text-sm font-medium text-orange-800">Safety tips for deal</p>
                <p className="text-xs text-orange-600 mt-1">Use safe locations to meet seller</p>
              </div>
            </div>
          </div>

          {/* Ad ID */}
          <div className="text-center">
            <p className="text-sm text-gray-500">AD# 87456</p>
            <button className="text-cyan-600 text-sm hover:underline">Report this ad</button>
          </div>
        </div>
      </div>
    </div>
    <FooterSection/>
    </>
  )
}
