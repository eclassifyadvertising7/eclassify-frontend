"use client"

import { useState, useEffect } from "react"
import FooterSection from "@/components/Footer"
import Header from "@/components/Header"
import { Splide, SplideSlide } from "@splidejs/react-splide"
import "@splidejs/react-splide/css"
import { subscriptionService } from "@/app/services/api"

export default function PricingPlans() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await subscriptionService.getPlans()
      setPlans(data)
    } catch (err) {
      console.error("Failed to fetch plans:", err)
      setError("Failed to load pricing plans. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price, currency) => {
    const currencySymbols = {
      INR: "₹",
      USD: "$",
      EUR: "€",
      GBP: "£",
    }
    const symbol = currencySymbols[currency] || currency
    return `${symbol}${parseFloat(price).toFixed(0)}`
  }

  const getPlanFeatures = (plan) => {
    const features = []
    
    if (plan.maxTotalListings) {
      features.push(`${plan.maxTotalListings} Total Listings`)
    }
    if (plan.maxActiveListings) {
      features.push(`${plan.maxActiveListings} Active Listings`)
    }
    if (plan.maxFeaturedListings) {
      features.push(`${plan.maxFeaturedListings} Featured Listings`)
    }
    if (plan.durationDays) {
      features.push(`${plan.durationDays} Days Validity`)
    }
    if (plan.features?.showPhoneNumber) {
      features.push("→ Show Phone Number")
    }
    if (plan.features?.allowChat) {
      features.push("→ Chat Support")
    }
    if (plan.features?.analyticsEnabled) {
      features.push("→ Analytics Dashboard")
    }
    if (plan.features?.priorityModeration) {
      features.push("→ Priority Moderation")
    }
    
    return features
  }

  return (
    <>
      <Header />
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">Ad Listing Plan</h2>

          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-gray-600">Loading pricing plans...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchPlans}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && plans.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">No pricing plans available at the moment.</p>
            </div>
          )}

          {!loading && !error && plans.length > 0 && (
            <Splide
              options={{
                type: plans.length > 3 ? "loop" : "slide",
                perPage: Math.min(3, plans.length),
                perMove: 1,
                gap: "2rem",
                pagination: false,
                arrows: plans.length > 3,
                autoplay: false,
                breakpoints: {
                  1024: {
                    perPage: Math.min(2, plans.length),
                    gap: "1.5rem",
                  },
                  768: {
                    perPage: 1,
                    gap: "1rem",
                  },
                },
              }}
              className="pricing-slider"
            >
              {plans.map((plan) => {
                const features = getPlanFeatures(plan)
                const hasDiscount = plan.showOriginalPrice && parseFloat(plan.basePrice) > parseFloat(plan.finalPrice)

                return (
                  <SplideSlide key={plan.id}>
                    <div className="bg-white border border-gray-200 rounded-2xl p-8 h-full shadow-sm hover:shadow-lg transition-shadow duration-300 relative flex flex-col">
                      {/* Offer Badge */}
                      {plan.showOfferBadge && plan.offerBadgeText && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold transform -rotate-12">
                          {plan.offerBadgeText}
                        </div>
                      )}

                      {/* Plan Header */}
                      <div className="mb-8 mt-4">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{plan.name}</h3>
                        {plan.tagline && (
                          <p className="text-sm text-primary font-medium mb-3">{plan.tagline}</p>
                        )}
                        {plan.shortDescription && (
                          <p className="text-sm text-gray-600 mb-4">{plan.shortDescription}</p>
                        )}
                        <div className="flex items-baseline gap-2">
                          {hasDiscount && (
                            <span className="text-lg text-gray-400 line-through">
                              {formatPrice(plan.basePrice, plan.currency)}
                            </span>
                          )}
                          <span className="text-3xl font-bold text-gray-900">
                            {formatPrice(plan.finalPrice, plan.currency)}
                          </span>
                          <span className="text-sm text-gray-500">/{plan.billingCycle}</span>
                        </div>
                      </div>

                      {/* Features List */}
                      <div className="space-y-3 mb-8 flex-grow">
                        {features.map((feature, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <span className="text-gray-600 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Choose Plan Button */}
                      <button className="w-full py-3 px-6 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors duration-300 flex items-center justify-center gap-2 mt-auto">
                        Choose Plan
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </SplideSlide>
                )
              })}
            </Splide>
          )}
        </div>

        <style jsx global>{`
          @keyframes breathe {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.1);
            }
          }

          .pricing-slider .splide__arrow {
            background: #2d48c3;
            border: none;
            width: 3rem;
            height: 3rem;
            border-radius: 50%;
            opacity: 0.8;
            transition: opacity 0.3s ease, transform 0.3s ease;
            transform-origin: center;
          }
          
          .pricing-slider .splide__arrow:hover {
            opacity: 1;
            transform: scale(1.05);
          }
          
          .pricing-slider .splide__arrow svg {
            fill: white;
          }
          
          .pricing-slider .splide__arrow--prev {
            left: -1.5rem;
          }
          
          .pricing-slider .splide__arrow--next {
            right: -1.5rem;
            animation: breathe 2s ease-in-out infinite;
          }
          
          .pricing-slider .splide__arrow--next:hover {
            animation: none;
          }
          
          @media (max-width: 768px) {
            .pricing-slider .splide__arrow--prev {
              left: 0.5rem;
            }
            
            .pricing-slider .splide__arrow--next {
              right: 0.5rem;
            }
          }
        `}</style>
      </section>
      <FooterSection />
    </>
  )
}
