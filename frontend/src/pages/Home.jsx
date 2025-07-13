import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import {
  Search,
  Briefcase,
  Users,
  TrendingUp,
  Building,
  MapPin,
  Clock,
  Star,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Globe,
  Zap,
  Shield,
  Award,
  MessageSquare,
  Target,
  Rocket,
  ChevronDown,
  Play,
  User,
} from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const features = [
    {
      icon: Zap,
      title: "AI-Powered Matching",
      description:
        "Our advanced AI analyzes your skills and preferences to find perfect job matches instantly.",
      color: "from-yellow-500 via-orange-500 to-red-500",
      image:
        "https://images.unsplash.com/photo-1660165458059-57cfb6cc87e5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwdGVjaG5vbG9neXxlbnwwfHx8Ymx1ZXwxNzUyMzA3MjExfDA&ixlib=rb-4.1.0&q=85",
    },
    {
      icon: Globe,
      title: "Global Opportunities",
      description:
        "Access jobs from companies worldwide with remote-friendly positions and international careers.",
      color: "from-green-500 via-teal-500 to-blue-500",
      image:
        "https://images.unsplash.com/photo-1558845759-66c12fb98a1b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwyfHxidXNpbmVzcyUyMGdyb3d0aHxlbnwwfHx8cHVycGxlfDE3NTI0MDEyMDR8MA&ixlib=rb-4.1.0&q=85",
    },
    {
      icon: Shield,
      title: "Verified Companies",
      description:
        "Every company on our platform is thoroughly vetted to ensure legitimate and quality opportunities.",
      color: "from-purple-500 via-pink-500 to-indigo-500",
      image:
        "https://images.pexels.com/photos/8728284/pexels-photo-8728284.jpeg",
    },
    {
      icon: Rocket,
      title: "Career Acceleration",
      description:
        "Fast-track your career with personalized insights, skill recommendations, and growth tracking.",
      color: "from-blue-500 via-indigo-500 to-purple-500",
      image:
        "https://images.unsplash.com/photo-1566598359998-62e83aeea166?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwxfHx3b3Jrc3BhY2V8ZW58MHx8fHB1cnBsZXwxNzUyNDAxMjEyfDA&ixlib=rb-4.1.0&q=85",
    },
  ];

  const stats = [
    {
      number: "25K+",
      label: "Active Jobs",
      icon: Briefcase,
      color: "from-blue-500 to-cyan-500",
    },
    {
      number: "8K+",
      label: "Top Companies",
      icon: Building,
      color: "from-purple-500 to-pink-500",
    },
    {
      number: "120K+",
      label: "Professionals",
      icon: Users,
      color: "from-green-500 to-emerald-500",
    },
    {
      number: "98%",
      label: "Success Rate",
      icon: Award,
      color: "from-orange-500 to-red-500",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Senior Software Engineer",
      company: "TechFlow",
      content:
        "Mentaurra's AI matching is incredible! I found my dream role in just 3 days. The platform understood exactly what I was looking for.",
      rating: 5,
      image:
        "https://images.pexels.com/photos/5475816/pexels-photo-5475816.jpeg",
    },
    {
      name: "Marcus Rodriguez",
      role: "Product Manager",
      company: "InnovateX",
      content:
        "The quality of opportunities on Mentaurra is unmatched. Every company I interviewed with was exactly aligned with my career goals.",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwyfHxmdXR1cmlzdGljJTIwdGVjaG5vbG9neXxlbnwwfHx8Ymx1ZXwxNzUyMzA3MjExfDA&ixlib=rb-4.1.0&q=85",
    },
    {
      name: "Elena Vasquez",
      role: "UX Designer",
      company: "DesignStudio Pro",
      content:
        "I love how Mentaurra showcases not just jobs, but company culture and growth opportunities. It helped me make the perfect career move.",
      rating: 5,
      image:
        "https://images.pexels.com/photos/31094109/pexels-photo-31094109.jpeg",
    },
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Create Your Profile",
      description:
        "Build a comprehensive profile showcasing your skills, experience, and career aspirations.",
      icon: User,
    },
    {
      step: "02",
      title: "Get AI Matches",
      description:
        "Our intelligent system analyzes and matches you with opportunities that fit perfectly.",
      icon: Target,
    },
    {
      step: "03",
      title: "Connect & Apply",
      description:
        "Connect directly with hiring managers and apply to roles with confidence.",
      icon: MessageSquare,
    },
    {
      step: "04",
      title: "Land Your Dream Job",
      description:
        "Get hired faster with our streamlined process and expert career support.",
      icon: Award,
    },
  ];

  const companies = [
    "TechFlow",
    "InnovateX",
    "DesignStudio Pro",
    "FutureCorps",
    "NextGen Solutions",
    "CreativeHub",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20" />

        {/* Floating Elements */}
        <motion.div
          style={{ y: y1 }}
          className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 blur-xl"
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-r from-pink-400 to-orange-500 rounded-full opacity-20 blur-xl"
        />

        {/* Background Image */}
        <div
          className="absolute inset-0 opacity-10 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1544037119-50b88b582067?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwzfHxhYnN0cmFjdCUyMGNhcmVlcnxlbnwwfHx8Ymx1ZXwxNzUyNDAxMTQzfDA&ixlib=rb-4.1.0&q=85')`,
          }}
        />

        <div className="relative max-w-7xl mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              className="inline-flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl px-4 py-2 rounded-full border border-gray-200/50 dark:border-gray-700/50 mb-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI-Powered Career Matching
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Your Dream Career
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Starts Here
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-4xl mx-auto leading-relaxed">
              Join the future of job searching with Mentaurra's intelligent
              platform. Connect with top companies, unlock hidden opportunities,
              and accelerate your career like never before.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Button
                size="lg"
                onClick={() => navigate("/signup")}
                className="text-lg px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 shadow-2xl shadow-purple-500/25 transition-all duration-300 hover:scale-105"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Start Your Journey
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/jobs")}
                className="text-lg px-8 py-4 border-2 backdrop-blur-xl bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-105"
              >
                <Play className="w-5 h-5 mr-2" />
                Explore Opportunities
              </Button>
            </div>

            {/* Quick Search */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="max-w-3xl mx-auto"
            >
              <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border-gray-200/50 dark:border-gray-700/50 shadow-2xl">
                <CardContent className="p-6">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.target);
                      const search = formData.get("search");
                      const location = formData.get("location");
                      const params = new URLSearchParams();
                      if (search) params.set("search", search);
                      if (location) params.set("location", location);
                      navigate(`/jobs?${params.toString()}`);
                    }}
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <input
                          type="text"
                          name="search"
                          placeholder="Job title, skills, or company"
                          className="w-full px-6 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          name="location"
                          placeholder="Location or Remote"
                          className="w-full px-6 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-lg"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105"
                      >
                        <Search className="w-5 h-5" />
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <ChevronDown className="w-6 h-6 text-gray-400" />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center group"
                >
                  <div
                    className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              How{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Mentaurra
              </span>{" "}
              Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Get hired faster with our streamlined, AI-powered process designed
              for modern professionals.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative group"
                >
                  <Card className="h-full text-center p-6 backdrop-blur-xl bg-white/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                    <div className="relative">
                      <div className="text-6xl font-bold text-gray-100 dark:text-gray-800 absolute -top-4 -left-2">
                        {step.step}
                      </div>
                      <div className="relative z-10 w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl">{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-400">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Connection Line */}
                  {index < howItWorks.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 z-20"></div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Mentaurra
              </span>
              ?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Experience the future of job searching with cutting-edge
              technology and personalized career guidance.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <Card className="p-8 h-full backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-500 group-hover:scale-105 overflow-hidden relative">
                    {/* Background Image */}
                    <div
                      className="absolute inset-0 opacity-5 bg-cover bg-center transition-all duration-500 group-hover:opacity-10"
                      style={{ backgroundImage: `url('${feature.image}')` }}
                    />

                    <div className="relative z-10">
                      <div
                        className={`w-20 h-20 mb-6 bg-gradient-to-r ${feature.color} rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                      <CardHeader className="pb-4 px-0">
                        <CardTitle className="text-2xl">
                          {feature.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-0">
                        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                          {feature.description}
                        </p>
                      </CardContent>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Success{" "}
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Stories
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Join thousands of professionals who transformed their careers with
              Mentaurra.
            </p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <Card className="p-8 backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border-gray-200/50 dark:border-gray-700/50 shadow-2xl">
                <div
                  className="w-24 h-24 mx-auto mb-6 rounded-full bg-cover bg-center shadow-xl"
                  style={{
                    backgroundImage: `url('${testimonials[currentTestimonial].image}')`,
                  }}
                />

                <div className="flex justify-center mb-6">
                  {[...Array(testimonials[currentTestimonial].rating)].map(
                    (_, i) => (
                      <Star
                        key={i}
                        className="w-6 h-6 text-yellow-400 fill-current"
                      />
                    )
                  )}
                </div>

                <blockquote className="text-2xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed italic">
                  "{testimonials[currentTestimonial].content}"
                </blockquote>

                <div>
                  <div className="font-bold text-xl text-gray-900 dark:text-white">
                    {testimonials[currentTestimonial].name}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {testimonials[currentTestimonial].role} at{" "}
                    {testimonials[currentTestimonial].company}
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Testimonial Indicators */}
            <div className="flex justify-center mt-8 space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 scale-125"
                      : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-8">
            Trusted by leading companies worldwide
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {companies.map((company, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 0.6, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-xl font-bold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors cursor-default"
              >
                {company}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Join Mentaurra today and discover opportunities that will
              accelerate your professional journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                size="lg"
                onClick={() => navigate("/signup")}
                className="text-lg px-8 py-4 bg-white text-gray-900 hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-2xl"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/jobs")}
                className="text-lg px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-gray-900 transition-all duration-300 hover:scale-105"
              >
                Explore Jobs
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
