"use client"
import { useState } from "react"
import { Heart } from "lucide-react"
import Link from "next/link"

const carData = [
  {
    id: 1,
    image: "./assets/img/car-1.png",
    price: "$ 3,70,000",
    title: "Lamborghini Huracan Evo",
    location: "Bhuj, Gujarat, India",
    timeAgo: "9mo",
    featured: true,
  },
  {
    id: 2,
    image: "./assets/img/car-1.png",
    price: "$ 18,40,000",
    title: "BMW 7 SERIES",
    location: "Kodki, Gujarat, India",
    timeAgo: "8mo",
    featured: false,
  },
  {
    id: 3,
    image: "./assets/img/car-1.png",
    price: "$ 65,999",
    title: "BMW 3 Series Gran Limousine",
    location: "Bhuj, Gujarat, India",
    timeAgo: "9mo",
    featured: false,
  },
  {
    id: 4,
    image: "./assets/img/car-1.png",
    price: "$ 64,093",
    title: "Nissan Z Performance Manual",
    location: "Bhuj, Gujarat, India",
    timeAgo: "11mo",
    featured: false,
  },
  {
    id: 5,
    image: "./assets/img/car-1.png",
    price: "$ 45,500",
    title: "Mercedes-Benz C-Class",
    location: "Ahmedabad, Gujarat, India",
    timeAgo: "6mo",
    featured: false,
  },
  {
    id: 6,
    image: "./assets/img/car-1.png",
    price: "$ 52,000",
    title: "Audi A4 Premium",
    location: "Surat, Gujarat, India",
    timeAgo: "7mo",
    featured: false,
  },
  {
    id: 7,
    image: "./assets/img/car-1.png",
    price: "$ 28,999",
    title: "Toyota Camry Hybrid",
    location: "Vadodara, Gujarat, India",
    timeAgo: "5mo",
    featured: false,
  },
  {
    id: 8,
    image: "./assets/img/car-1.png",
    price: "$ 32,500",
    title: "Honda Accord Sport",
    location: "Rajkot, Gujarat, India",
    timeAgo: "4mo",
    featured: false,
  },
  {
    id: 9,
    image: "./assets/img/car-1.png",
    price: "$ 2,50,000",
    title: "Ferrari 488 GTB",
    location: "Mumbai, Maharashtra, India",
    timeAgo: "10mo",
    featured: true,
  },
  {
    id: 10,
    image: "./assets/img/car-1.png",
    price: "$ 1,20,000",
    title: "Porsche 911 Carrera",
    location: "Pune, Maharashtra, India",
    timeAgo: "8mo",
    featured: false,
  },
  {
    id: 11,
    image: "./assets/img/car-1.png",
    price: "$ 89,999",
    title: "Tesla Model S",
    location: "Bangalore, Karnataka, India",
    timeAgo: "3mo",
    featured: false,
  },
  {
    id: 12,
    image: "./assets/img/car-1.png",
    price: "$ 67,500",
    title: "Jaguar XF Portfolio",
    location: "Chennai, Tamil Nadu, India",
    timeAgo: "6mo",
    featured: false,
  },
]

export default function CarListings() {
  const [showAll, setShowAll] = useState(false)
  const [favorites, setFavorites] = useState(new Set())

  const displayedCars = showAll ? carData : carData.slice(0, 8)

  const toggleFavorite = (carId) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(carId)) {
      newFavorites.delete(carId)
    } else {
      newFavorites.add(carId)
    }
    setFavorites(newFavorites)
  }

  return (
    <section className="container mx-auto px-4 py-8 max-w-7xl mb-10 ">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Top Cars Near You</h2>
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-cyan-600 hover:text-cyan-700 font-medium transition-colors duration-200"
        >
          {showAll ? "Show Less" : "View All"}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayedCars.map((car) => (
          <Link href={`/product-details`}
            key={car.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
          >
            <div className="relative">
              <img src={car.image || "/placeholder.svg"} alt={car.title} className="w-full h-32 md:h-48 object-cover" />
              {car.featured && (
                <div className="absolute top-3 left-3 bg-cyan-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Featured
                </div>
              )}
              <button
                onClick={() => toggleFavorite(car.id)}
                className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <Heart
                  className={`w-5 h-5 ${
                    favorites.has(car.id) ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500"
                  } transition-colors duration-200`}
                />
              </button>
            </div>

            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm md:text-xl font-bold text-gray-900">{car.price}</h3>
                <span className="text-sm text-gray-500">{car.timeAgo}</span>
              </div>
              <h4 className="text-sm  md:text-lg font-semibold text-gray-800 mb-1">{car.title}</h4>
              <p className="text-sm text-gray-600">{car.location}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
