
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Brain, 
  TrendingUp, 
  Users, 
  Star, 
  CheckCircle, 
  ArrowRight,
  Calculator,
  Heart,
  Target,
  Award,
  Clock,
  Shield
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function LandingPage() {
  const { login, isLoading } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(false);

  const handleGetStarted = async () => {
    if (!email || !name) {
      toast({
        title: "Missing Information",
        description: "Please enter both your name and email to continue.",
        variant: "destructive",
      });
      return;
    }

    try {
      await login(email, name);
      toast({
        title: "Welcome to HomeMath Academy!",
        description: "Your account has been created. Let's get started with your child's math journey.",
      });
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "There was an error creating your account. Please try again.",
        variant: "destructive",
      });
    }
  };

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Get detailed analysis of your child's math abilities with actionable improvement plans."
    },
    {
      icon: Target,
      title: "Personalized Learning Paths",
      description: "24-week growth plans tailored to your child's specific needs and learning style."
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Monitor your child's mathematical growth with detailed progress reports and analytics."
    },
    {
      icon: Heart,
      title: "Christian Foundation",
      description: "Math education rooted in Christian values, showing God's order in creation."
    },
    {
      icon: Users,
      title: "Parent-Friendly",
      description: "Designed specifically for homeschooling parents with clear guidance and support."
    },
    {
      icon: Award,
      title: "Grade-Level Assessment",
      description: "Comprehensive placement tests for grades 1-8 to find the perfect starting point."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Homeschool Mom of 3",
      content: "HomeMath Academy transformed how we approach math. The AI insights helped me understand exactly where my daughter needed support.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Father & Educator",
      content: "The Christian foundation combined with modern AI technology is exactly what our family needed. Highly recommended!",
      rating: 5
    },
    {
      name: "Lisa Rodriguez",
      role: "Homeschool Parent",
      content: "Finally, a math program that gives me confidence in teaching. The detailed lesson plans are a game-changer.",
      rating: 5
    }
  ];

  const pricingTiers = [
    {
      name: "Free Trial",
      price: "$0",
      period: "14 days",
      features: [
        "Full placement test",
        "Basic insights report",
        "Sample growth plan",
        "Up to 2 children"
      ],
      popular: false
    },
    {
      name: "Family Plan",
      price: "$29.99",
      period: "per month",
      features: [
        "Everything in Free Trial",
        "Complete 24-week growth plans",
        "AI-powered recommendations",
        "Progress tracking",
        "Up to 6 children",
        "Priority support"
      ],
      popular: true
    },
    {
      name: "Basic Plan",
      price: "$19.99",
      period: "per month",
      features: [
        "Full placement test",
        "Detailed insights",
        "Complete growth plan",
        "Progress tracking",
        "Up to 3 children"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b">
        <div className="container-width">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Calculator className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold gradient-text">HomeMath Academy</span>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setIsLoginMode(!isLoginMode)}
              className="hidden sm:flex"
            >
              {isLoginMode ? 'Back to Home' : 'Sign In'}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-blue-50 via-white to-purple-50 parallax-bg">
        <div className="container-width">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <Badge variant="secondary" className="mb-4">
                  <Star className="w-4 h-4 mr-1" />
                  AI-Powered Math Education
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-balance">
                  Transform Your Child's{' '}
                  <span className="gradient-text">Math Journey</span>
                </h1>
                <p className="text-xl text-gray-600 text-balance">
                  Empowering Christian homeschooling families with AI-driven math placement 
                  and personalized growth plans that show exactly how to help your child succeed.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Grades 1-8 Coverage
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Christian Foundation
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Parent-Friendly
                </div>
              </div>

              {/* Quick Start Form */}
              <Card className="p-6 shadow-xl">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-lg">Start Your Free 14-Day Trial</CardTitle>
                  <CardDescription>
                    No credit card required. Get instant access to placement tests and insights.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 space-y-4">
                  <Input
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12"
                  />
                  <Input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12"
                  />
                  <Button 
                    onClick={handleGetStarted}
                    disabled={isLoading}
                    className="w-full h-12 btn-primary"
                  >
                    {isLoading ? (
                      <div className="loading-dots">Starting your journey</div>
                    ) : (
                      <>
                        Get Started Free
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-gray-500 text-center">
                    Join 1,000+ homeschooling families already using HomeMath Academy
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 shadow-2xl">
                <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-2xl"></div>
                <div className="relative z-10 h-full flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
                      <Brain className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">AI-Powered Insights</h3>
                    <p className="text-gray-600">
                      Get detailed analysis and actionable improvement plans
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="container-width">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Everything You Need for Math Success
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform provides the tools, insights, and guidance 
              to help your child excel in mathematics while building confidence.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full card-hover">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-width">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              How HomeMath Academy Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our simple 3-step process gets your child on the path to math success
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Take Placement Test",
                description: "Your child takes a comprehensive, grade-appropriate assessment to identify their current math level and areas for growth."
              },
              {
                step: "2", 
                title: "Get AI Insights",
                description: "Our AI analyzes the results and provides detailed insights about strengths, weaknesses, and specific recommendations."
              },
              {
                step: "3",
                title: "Follow Growth Plan",
                description: "Receive a personalized 24-week learning plan with daily lessons, activities, and progress tracking."
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-white">
        <div className="container-width">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Trusted by Homeschooling Families
            </h2>
            <p className="text-xl text-gray-600">
              See what parents are saying about their experience with HomeMath Academy
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-width">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that works best for your family
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className={`h-full relative ${tier.popular ? 'ring-2 ring-blue-600 shadow-xl' : ''}`}>
                  {tier.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl">{tier.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{tier.price}</span>
                      <span className="text-gray-500">/{tier.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {tier.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full mt-6 ${tier.popular ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setIsLoginMode(true)}
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container-width text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Transform Your Child's Math Education?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of homeschooling families who have discovered the power 
              of AI-driven math education. Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => setIsLoginMode(true)}
                className="text-blue-600 hover:text-blue-700"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600"
              >
                <Clock className="mr-2 h-5 w-5" />
                Schedule Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white section-padding">
        <div className="container-width">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Calculator className="h-6 w-6" />
                <span className="text-lg font-bold">HomeMath Academy</span>
              </div>
              <p className="text-gray-400">
                Empowering Christian homeschooling families with AI-driven math education.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Placement Tests</li>
                <li>Growth Plans</li>
                <li>Progress Tracking</li>
                <li>AI Insights</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Parent Resources</li>
                <li>Contact Us</li>
                <li>Community</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Our Mission</li>
                <li>Testimonials</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 HomeMath Academy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
