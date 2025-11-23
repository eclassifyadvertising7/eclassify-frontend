import Image from "next/image";
import Header from "../components/Header";
import Listing from "../components/listing";
import HeroSlider from "../components/Hero";
import FooterSection from "@/components/Footer";

export default function Home() {
  return (
    <div>
      <Header/>
      <HeroSlider/>
      <Listing/>
      <FooterSection/>
      
    </div>
  );
}
