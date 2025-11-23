"use client"

import { useState } from "react"
import {
  Heart,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Send,
  Star,
  Users,
  ShoppingBag,
  Award,
} from "lucide-react"
import Link from "next/link"

export default function Footer() {
  const [email, setEmail] = useState("")
  const [hoveredSocial, setHoveredSocial] = useState(null)

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    console.log("Newsletter signup:", email)
    setEmail("")
  }

  const socialLinks = [
    { icon: Facebook, name: "Facebook", color: "bg-blue-600" },
    { icon: Twitter, name: "Twitter", color: "bg-sky-500" },
    { icon: Instagram, name: "Instagram", color: "bg-pink-500" },
    { icon: Linkedin, name: "LinkedIn", color: "bg-secondary" },
    { icon: Youtube, name: "YouTube", color: "bg-red-600" },
  ]

  const quickLinks = [
    { title: "About Us", url: "/about" },
    { title: "Pricing Plans", url: "pricing" },
    { title: "Contact Us", url: "/contact" },
  // { title: "Safety Tips", url: "safety-tips" },
  // { title: "Success Stories", url: "success-stories" },
  // { title: "Help Center", url: "help-center" },
];

  const categories = [{
    title: "Cars",
    url: "cars",
  },
  {
    title: "Property",
    url: "property",
  },
 

]

  return (
    <footer className="relative overflow-hidden bg-[#f7f8fd]">
      {/* Background with overlapping gradients */}
      

      {/* Decorative shapes */}
      {/* <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full blur-3xl -translate-x-32 -translate-y-32"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-accent/30 to-primary/30 rounded-full blur-3xl translate-x-48 translate-y-48"></div> */}

      <div className="relative max-w-7xl mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
          {/* Company Info Section */}
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 border border-border/50 shadow-xl hover:shadow-2xl transition-all duration-300 animate-bounce-subtle">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-card-foreground">eClassify</h3>
                <p className="text-sm text-muted-foreground">Buy & Sell Anything</p>
              </div>
            </div>

            <p className="text-muted-foreground mb-6 leading-relaxed">
              Your trusted marketplace for buying and selling everything. Connect with millions of users worldwide and
              discover amazing deals every day.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                <MapPin className="w-5 h-5" />
                <span>123 Market Street, Commerce City, CC 12345</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                <Phone className="w-5 h-5" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                <Mail className="w-5 h-5" />
                <span>hello@eclassify.com</span>
              </div>
            </div>

           
          </div>

          {/* Quick Links & Categories */}
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 border border-border/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-black text-card-foreground mb-6 flex items-center gap-2">
                  <Star className="w-5 h-5 text-accent" />
                  Quick Links
                </h4>
                <ul className="space-y-3">
                  {quickLinks.map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.url}
                        className="text-muted-foreground hover:text-primary hover:translate-x-2 transition-all duration-300 flex items-center gap-2 group"
                      >
                        <div className="w-2 h-2 bg-secondary rounded-full group-hover:bg-primary transition-colors "></div>
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-black text-card-foreground mb-6 flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Categories
                </h4>
                <ul className="space-y-3">
                  {categories.map((category, index) => (
                    <li key={index}>
                      <Link
                        href={category.url}
                        className="text-muted-foreground hover:text-secondary hover:translate-x-2 transition-all duration-300 flex items-center gap-2 group"
                      >
                        <div className="w-2 h-2 bg-accent rounded-full group-hover:bg-secondary transition-colors"></div>
                        {category.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
             {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-border/50">
              <div className="text-center">
                <div className="text-2xl font-black text-primary">2M+</div>
                <div className="text-xs text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-secondary">500K+</div>
                <div className="text-xs text-muted-foreground">Listings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-accent">99%</div>
                <div className="text-xs text-muted-foreground">Satisfaction</div>
              </div>
            </div>
{/* Trust Badges */}
            <div className="mt-8 pt-6 border-t border-border/50">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Secure Platform</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span>Trusted by Millions</span>
                </div>
              </div>
            </div>

          </div>

          {/* Newsletter & Social */}
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 border border-border/50 shadow-xl hover:shadow-2xl transition-all duration-300 animate-pulse-glow">
            <h4 className="text-xl font-black text-card-foreground mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-secondary" />
              Stay Connected
            </h4>

            <p className="text-muted-foreground mb-6">
              Join our community and get the latest updates, exclusive deals, and marketplace insights delivered to your
              inbox.
            </p>

            {/* Newsletter Form */}
            <form onSubmit={handleNewsletterSubmit} className="mb-8">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-2 text-[10px] md: text-md md:px-4 md:py-3 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  required
                />
                <button
                  type="submit"
                  className="px-2 text-[10px] md:text-md md:px-4 py-2 md:py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2 font-semibold"
                >
                
                  <Send className="w-4 h-4" />
                  Subscribe
                </button>
              </div>
            </form>

            {/* Social Media Icons */}
            <div>
              <h5 className="text-lg font-bold text-card-foreground mb-4">Follow Us</h5>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon
                  return (
                    <button
                      key={index}
                      onMouseEnter={() => setHoveredSocial(index)}
                      onMouseLeave={() => setHoveredSocial(null)}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-12 ${
                        hoveredSocial === index ? `${social.color} shadow-lg` : "bg-muted hover:bg-primary"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          hoveredSocial === index ? "text-white" : "text-muted-foreground hover:text-primary-foreground"
                        }`}
                      />
                    </button>
                  )
                })}
              </div>
            </div>

            
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-muted-foreground text-sm">
              © 2024 eClassify. All rights reserved. Made with ❤️ for the community.
            </div>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
