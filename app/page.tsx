"use client";

//app/page.tsx

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white">
      <nav
        className={`fixed w-full z-10 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-800">
            Trimio
          </Link>
          <div className="hidden md:flex space-x-4">
            <Link
              href="#features"
              className="text-gray-600 hover:text-gray-900"
            >
              Features
            </Link>
            <Link
              href="#testimonials"
              className="text-gray-600 hover:text-gray-900"
            >
              Testimonials
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-gray-900">
              Pricing
            </Link>
            <Link href="#contact" className="text-gray-600 hover:text-gray-900">
              Contact
            </Link>
          </div>
          <Button asChild>
            <Link href="/auth">Sign Up</Link>
          </Button>
        </div>
      </nav>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="pt-32 pb-16 text-center"
      >
        <h1 className="text-5xl font-bold mb-6">
          Revolutionize Your Barbershop
        </h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Streamline appointments, manage clients, and grow your business with
          Trimio - the all-in-one platform for modern barbers.
        </p>
        <Button size="lg" asChild>
          <Link href="/auth">Get Started Free</Link>
        </Button>
        <div className="mt-12">
          <Image
            src="/images/trimio-ilustration-1.svg"
            alt="Trimio dashboard illustration"
            width={600}
            height={400}
            className="mx-auto rounded-lg shadow-lg"
          />
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-16 bg-gray-50"
        id="features"
      >
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Easy Scheduling",
                description:
                  "Manage appointments with a user-friendly calendar interface.",
              },
              {
                title: "Client Management",
                description:
                  "Keep track of client preferences and history for personalized service.",
              },
              {
                title: "Analytics Dashboard",
                description:
                  "Gain insights into your business performance with detailed reports.",
              },
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-16"
        id="testimonials"
      >
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center">
            What Barbers Say
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                name: "John Doe",
                role: "Master Barber",
                quote:
                  "Trimio has transformed how I manage my barbershop. It's a game-changer!",
              },
              {
                name: "Jane Smith",
                role: "Salon Owner",
                quote:
                  "The ease of use and powerful features make Trimio an essential tool for my business.",
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <p className="mb-4 italic">{testimonial.quote}</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-16 bg-gray-50"
        id="pricing"
      >
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Simple Pricing
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                plan: "Basic",
                price: "$29",
                features: [
                  "Appointment Scheduling",
                  "Client Management",
                  "Basic Analytics",
                ],
              },
              {
                plan: "Pro",
                price: "$59",
                features: [
                  "All Basic Features",
                  "Advanced Analytics",
                  "Marketing Tools",
                  "Priority Support",
                ],
              },
              {
                plan: "Enterprise",
                price: "Custom",
                features: [
                  "All Pro Features",
                  "Custom Integrations",
                  "Dedicated Account Manager",
                ],
              },
            ].map((tier, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md text-center"
              >
                <h3 className="text-xl font-semibold mb-4">{tier.plan}</h3>
                <p className="text-3xl font-bold mb-6">
                  {tier.price}
                  <span className="text-sm font-normal">/month</span>
                </p>
                <ul className="mb-6 space-y-2">
                  {tier.features.map((feature, fIndex) => (
                    <li key={fIndex}>{feature}</li>
                  ))}
                </ul>
                <Button className="w-full">Choose Plan</Button>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-16"
      >
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
          <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-12">
            <Image
              src="/images/trimio-ilustration-4.png"
              alt="Trimio dashboard"
              width={400}
              height={300}
              className="rounded-lg shadow-md"
            />
            <div className="max-w-md">
              <h3 className="text-2xl font-semibold mb-4">
                Effortless Management
              </h3>
              <p className="mb-4">
                Trimios intuitive dashboard puts everything you need at your
                fingertips. Manage appointments, track client preferences, and
                analyze your business performance - all in one place.
              </p>
              <Button>See Demo</Button>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-16 bg-gray-50"
        id="contact"
      >
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center">Get In Touch</h2>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <form className="w-full md:w-1/2 max-w-lg">
              <div className="mb-4">
                <label htmlFor="name" className="block mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="message" className="block mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full p-2 border rounded"
                  required
                ></textarea>
              </div>
              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
            <div className="w-full md:w-1/2 mt-8 md:mt-0">
              <Image
                src="/images/trimio-ilustration-2.svg"
                alt="Contact illustration"
                width={400}
                height={300}
                className="mx-auto"
              />
            </div>
          </div>
        </div>
      </motion.section>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-2xl font-bold">Trimio</h3>
              <p>Empowering barbers worldwide</p>
            </div>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-gray-300">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-gray-300">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-gray-300">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p>&copy; 2024 Trimio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
