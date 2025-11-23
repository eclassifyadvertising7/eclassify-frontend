"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock, Star, Shield, Award, Users } from "lucide-react"
import Header from "@/components/Header"
import FooterSection from "@/components/Footer"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Handle form submission
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <>
    <Header/>
        <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            We're here to help you with any questions about eClassify. Reach out to our friendly team anytime.
          </p>
        </div>
      </section>

      <div className="container  px-4 py-16 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2 ">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-foreground">Send us a Message</CardTitle>
                <CardDescription>Fill out the form below and we'll get back to you within 24 hours.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us how we can help you..."
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-accent/90">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Support Information */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-foreground">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">support@eclassify.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Support Hours</p>
                    <p className="text-muted-foreground">Mon-Fri: 9AM-6PM EST</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Office Locations */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-foreground">Our Offices</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">New York Office</p>
                    <p className="text-muted-foreground text-sm">
                      123 Business Ave
                      <br />
                      New York, NY 10001
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">San Francisco Office</p>
                    <p className="text-muted-foreground text-sm">
                      456 Tech Street
                      <br />
                      San Francisco, CA 94105
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trust Elements */}
         
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-foreground text-center">Find Us</CardTitle>
              <CardDescription className="text-center">Visit our offices or reach out to us online</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg h-96 flex items-center justify-center">
                <div className="text-center w-full">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d448193.950603092!2d76.76356906374639!3d28.64428745347556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x37205b715389640!2sDelhi!5e0!3m2!1sen!2sin!4v1755716570423!5m2!1sen!2sin"  height="300"   loading="lazy" className="w-full"></iframe>
                  {/* <MapPin className="h-12 w-12 text-primary mx-auto mb-4" /> */}
                  {/* <p className="text-muted-foreground">Interactive map would be integrated here</p>
                  <p className="text-sm text-muted-foreground mt-2">Showing our New York and San Francisco locations</p> */}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Quick answers to common questions about eClassify</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">How do I post an ad?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Simply click "Add Listing" in the header, fill out the form with your item details, upload photos, and
                  publish your ad.
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Is eClassify free to use?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! Basic listings are free. We also offer premium packages for enhanced visibility and additional
                  features.
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">How do I contact sellers?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Use our secure messaging system or call directly through the contact information provided in each
                  listing.
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Is my information secure?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Absolutely. We use industry-standard encryption and never share your personal information with third
                  parties.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
        </div>
    <FooterSection/>
    </>
  )
}
