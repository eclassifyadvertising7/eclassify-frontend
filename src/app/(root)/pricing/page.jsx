"use client"

import FooterSection from "@/components/Footer"
import Header from "@/components/Header"
import { Splide, SplideSlide } from "@splidejs/react-splide"
import "@splidejs/react-splide/css"

export default function PricingPlans() {
  const plans = [
    {
      id: "free",
      name: "Free",
      price: "Free",
      icon: "🆓",
      badge: "FREE",
      badgeColor: "bg-red-500",
      features: [
        "3 Ads Listing",
        "10 Days",
        "→ Multiple-images & video",
        "→ Standard customer support",
        "→ Special ads badge",
      ],
    },
    {
      id: "silver",
      name: "Silver Package",
      price: "$199",
      icon: "🥈",
      features: [
        "50 Ads Listing",
        "30 Days",
        "→ Multiple-images & video",
        "→ Standard customer support",
        "→ Special ads badge",
      ],
    },
    {
      id: "gold",
      name: "Gold Package",
      price: "$169",
      icon: "🥇",
      features: [
        "100 Ads Listing",
        "60 Days",
        "→ Multiple-images & video",
        "→ Standard customer support",
        "→ Special ads badge",
      ],
    },
  ]

  return (
  <>
  <Header/>
      <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">Ad Listing Plan</h2>

        <Splide
          options={{
            type: "loop",
            perPage: 3,
            perMove: 1,
            gap: "2rem",
            pagination: false,
            arrows: true,
            autoplay: false,
            breakpoints: {
              1024: {
                perPage: 2,
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
          {plans.map((plan) => (
            <SplideSlide key={plan.id}>
              <div className="bg-white border border-gray-200 rounded-2xl p-8 h-full shadow-sm hover:shadow-lg transition-shadow duration-300 relative">
                {/* Badge for Free plan */}
                {plan.badge && (
                  <div
                    className={`absolute top-4 left-4 ${plan.badgeColor} text-white px-3 py-1 rounded-full text-sm font-semibold transform -rotate-12`}
                  >
                    {plan.badge}
                  </div>
                )}

                {/* Plan Header */}
                <div className="flex items-center gap-4 mb-8 mt-4">
                  <div className="text-4xl">{plan.icon}</div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{plan.name}</h3>
                    <p className="text-2xl font-bold text-gray-900">{plan.price}</p>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Choose Plan Button */}
                <button className="w-full py-3 px-6 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors duration-300 flex items-center justify-center gap-2">
                  Choose Plan
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </SplideSlide>
          ))}
        </Splide>
      </div>

      <style jsx global>{`
        .pricing-slider .splide__arrow {
          background: #2d48c3;
          border: none;
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          opacity: 0.8;
        }
        
        .pricing-slider .splide__arrow:hover {
          opacity: 1;
        }
        
        .pricing-slider .splide__arrow svg {
          fill: white;
        }
        
        .pricing-slider .splide__arrow--prev {
          left: -1.5rem;
        }
        
        .pricing-slider .splide__arrow--next {
          right: -1.5rem;
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
    <FooterSection/>
  </>
  )
}
