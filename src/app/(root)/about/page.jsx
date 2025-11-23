import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Header from "@/components/Header"
import FooterSection from "@/components/Footer"

export default function AboutPage() {
  const values = [
    {
      icon: "🤝",
      title: "Trust",
      description: "Building secure and reliable connections between buyers and sellers worldwide."
    },
    {
      icon: "💡",
      title: "Innovation",
      description: "Continuously improving our platform with cutting-edge technology and user-focused features."
    },
    {
      icon: "🌍",
      title: "Community",
      description: "Creating a vibrant marketplace where everyone can buy, sell, and connect with confidence."
    },
    {
      icon: "🔒",
      title: "Security",
      description: "Protecting our users with advanced security measures and verified transactions."
    }
  ]

  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image: "/placeholder.svg?height=300&width=300",
      bio: "With 15+ years in e-commerce, Sarah founded eClassify to revolutionize online marketplaces."
    },
    {
      name: "Michael Chen",
      role: "CTO",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Tech visionary with expertise in scalable platforms and user experience design."
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Marketing",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Marketing strategist passionate about connecting brands with their communities."
    },
    {
      name: "David Kim",
      role: "Head of Security",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Cybersecurity expert ensuring safe and secure transactions for all users."
    }
  ]

  return (
    <>
    <Header/>
        <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 font-sans">
            Welcome to <span className="text-primary">eClassify</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Your trusted marketplace for buying and selling anything, anywhere. 
            Connecting communities through secure, innovative, and user-friendly commerce.
          </p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-accent/10 border-accent/20 p-8 md:p-12">
            <CardContent className="text-center p-0">
              <blockquote className="text-2xl md:text-3xl font-medium text-foreground leading-relaxed italic">
                "To create the world's most trusted and innovative marketplace where 
                anyone can buy, sell, and exchange with complete confidence and ease."
              </blockquote>
              <cite className="block mt-6 text-lg text-primary font-semibold">
                — Our Mission
              </cite>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Our Core Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do and shape the experience we create for our community.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow duration-300 bg-card border-border">
                <CardContent className="p-0">
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold text-primary mb-3">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Our Story</h2>
          </div>
          
          <div className="prose prose-lg max-w-none text-foreground">
            <p className="text-lg leading-relaxed mb-6">
              Founded in 2020, eClassify began with a simple vision: to create a marketplace that puts 
              trust and community at its heart. We recognized that online commerce needed more than just 
              a platform—it needed a trusted partner that could bring people together safely and securely.
            </p>
            
            <p className="text-lg leading-relaxed mb-6">
              Starting as a small team of passionate entrepreneurs, we've grown into a global platform 
              serving millions of users worldwide. Our journey has been driven by continuous innovation, 
              user feedback, and an unwavering commitment to creating the best possible experience for 
              buyers and sellers alike.
            </p>
            
            <p className="text-lg leading-relaxed">
              Today, eClassify stands as a testament to what's possible when technology meets human 
              connection. We're not just a marketplace—we're a community where dreams are bought, 
              sold, and realized every single day.
            </p>
          </div>
        </div>
      </section>

      

    

      
    </div>
    <FooterSection/>
    </>
  )
}