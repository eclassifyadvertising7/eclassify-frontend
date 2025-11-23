"use client"

import { useRef } from "react"
import { Splide, SplideSlide } from "@splidejs/react-splide"
import "@splidejs/react-splide/css"
import { Button } from "@/components/ui/button"

const banners = [
  {
    id: 1,
  
    titleHighlight: "Smartphone?",

    image: "./assets/img/banner2.jpg",
    
  },
  {
    id: 2,
 
    titleHighlight: "Exchange Any Car",
    
    image: "./assets/img/banner1.jpg",
    
  },
  

]

export default function HeroSlider() {
  const splideRef = useRef(null)

  const splideOptions = {
    type: "loop",
    autoplay: true,
    interval: 5000,
    pauseOnHover: true,
    pauseOnFocus: true,
    resetProgress: false,
    arrows: true,
    pagination: true,
    drag: true,
    keyboard: true,
    lazyLoad: "nearby",
    breakpoints: {
      768: {
        arrows: false,
      },
    },
  }

  return (
    <div className="relative w-full md:h-[500px] rounded-lg lg:h-[600px] overflow-hidden max-w-7xl mx-auto mt-10">
      <Splide ref={splideRef} options={splideOptions} className="h-full" aria-label="Hero Banner Slider">
        {banners.map((banner) => (
          <SplideSlide key={banner.id} className=" h-full">
            <div className="  mt-4">
                <img src={banner.image} className="rounded-lg w-full h-full " alt="" />
            </div>
          </SplideSlide>
        ))}
      </Splide>

      <style jsx global>{`
        .splide__arrow {
          background: rgba(6, 182, 212, 0.8) !important;
          border: none !important;
          width: 2.5rem !important;
          height: 2.5rem !important;
          border-radius: 50% !important;
          transition: all 0.3s ease !important;
        }
        
        .splide__arrow:hover {
          background: rgba(6, 182, 212, 1) !important;
          transform: scale(1.1) !important;
        }
        
        .splide__arrow svg {
          fill: white !important;
          width: 1rem !important;
          height: 1rem !important;
        }
        
        .splide__pagination {
          bottom: 1.5rem !important;
        }
        
        .splide__pagination__page {
          background: rgba(6, 182, 212, 0.4) !important;
          border: none !important;
          width: 10px !important;
          height: 10px !important;
          margin: 0 4px !important;
          transition: all 0.3s ease !important;
        }
        
        .splide__pagination__page.is-active {
          background: #06b6d4 !important;
          transform: scale(1.2) !important;
        }
      `}</style>
    </div>
  )
}
