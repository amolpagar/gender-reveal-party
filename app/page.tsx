"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useTheme } from "next-themes"
import { MapPin, Users, Gift, MessageCircle, Calendar, Camera, Star, Crown, Cake, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { submitRSVP, submitMessage, getTeamVotes, getMessages } from "@/lib/actions"
import { useActionState } from "react"

export default function GenderRevealParty() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [teamVotes, setTeamVotes] = useState({ pink: 12, blue: 8 })
  const [messages, setMessages] = useState([
    { name: "Sarah M.", message: "So excited for you both! 💕", team: "pink" },
    { name: "Mike R.", message: "Team Blue all the way! 💙", team: "blue" },
    { name: "Emma L.", message: "Can't wait to find out! 🎉", team: "pink" },
  ])
  const [currentPhoto, setCurrentPhoto] = useState(0)
  const [musicPlaying, setMusicPlaying] = useState(false)
  const [balloonClicked, setBalloonClicked] = useState<number | null>(null)
  const [activeSection, setActiveSection] = useState("hero")

  // Memoize the event date to prevent re-creation on every render
  const eventDate = useMemo(() => new Date("2025-06-28T17:00:00"), [])

  const photos = [
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
  ]

  const balloonHints = [
    "The nursery theme is already picked! 🌟",
    "Baby's first outfit is ready! 👶",
    "The name starts with a vowel! 📝",
    "Due date is in summer! ☀️",
    "Baby loves to kick during music! 🎵",
  ]

  const schedule = [
    { time: "5:00 PM", event: "Arrival & Mingling", icon: Users },
    { time: "5:30 PM", event: "Games & Activities", icon: Star },
    { time: "6:00 PM", event: "Food & Refreshments", icon: Cake },
    { time: "6:30 PM", event: "The Big Reveal!", icon: Gift },
    { time: "7:00 PM", event: "Celebration & Photos", icon: Camera },
  ]

  const [rsvpState, rsvpAction, rsvpPending] = useActionState(submitRSVP, null)
  const [messageState, messageAction, messagePending] = useActionState(submitMessage, null)

  // Memoize the countdown calculation function
  const calculateTimeLeft = useCallback(() => {
    const now = new Date().getTime()
    const distance = eventDate.getTime() - now

    if (distance > 0) {
      return {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      }
    } else {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }
  }, [eventDate])

  // Handle theme mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load initial data - only run once
  useEffect(() => {
    const loadData = async () => {
      try {
        const votes = await getTeamVotes()
        setTeamVotes(votes)

        const msgs = await getMessages()
        setMessages(
          msgs.map((msg) => ({
            name: msg.name,
            message: msg.message,
            team: msg.team,
          })),
        )
      } catch (error) {
        console.error("Error loading data:", error)
      }
    }

    if (mounted) {
      loadData()
    }
  }, [mounted]) // Only depend on mounted state

  // Countdown timer - FIXED with proper dependencies
  useEffect(() => {
    // Set initial time
    setTimeLeft(calculateTimeLeft())

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [calculateTimeLeft]) // Only depend on the memoized function

  // Scroll handler - memoized to prevent re-creation
  const handleScroll = useCallback(() => {
    const sections = ["hero", "invitation", "rsvp", "messages"]
    const scrollPosition = window.scrollY + 100

    for (const section of sections) {
      const element = document.getElementById(section)
      if (element) {
        const { offsetTop, offsetHeight } = element
        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          setActiveSection(section)
          break
        }
      }
    }
  }, [])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  const nextPhoto = useCallback(() => {
    setCurrentPhoto((prev) => (prev + 1) % photos.length)
  }, [photos.length])

  const prevPhoto = useCallback(() => {
    setCurrentPhoto((prev) => (prev - 1 + photos.length) % photos.length)
  }, [photos.length])

  // Prevent hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 transition-colors duration-300">
      {/* Sticky Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg z-50 border-b border-pink-100 dark:border-gray-700">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex justify-center flex-1 space-x-6 text-sm">
              {[
                { id: "hero", label: "Home" },
                { id: "invitation", label: "Details" },
                { id: "rsvp", label: "RSVP" },
                { id: "messages", label: "Messages" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-3 py-2 rounded-full transition-all duration-300 font-medium ${
                    activeSection === item.id
                      ? "bg-pink-200 dark:bg-pink-800 text-pink-800 dark:text-pink-200"
                      : "text-gray-600 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-pink-50 dark:hover:bg-gray-800"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="ml-4 p-2"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-yellow-500" />
              ) : (
                <Moon className="h-4 w-4 text-gray-600" />
              )}
            </Button>
          </div>
        </div>
      </nav>

      {/* Floating Confetti Animation */}
      <div className="fixed inset-0 pointer-events-none z-10">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute animate-bounce ${
              i % 2 === 0 ? "text-pink-300 dark:text-pink-400" : "text-blue-300 dark:text-blue-400"
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          >
            {i % 4 === 0 ? "💕" : i % 4 === 1 ? "💙" : i % 4 === 2 ? "🎈" : "⭐"}
          </div>
        ))}
      </div>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center justify-center relative pt-20">
        <div className="text-center space-y-8 px-4 max-w-4xl mx-auto">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
              He or She?
            </h1>
            <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Come See!
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-medium">
              Join us for the big reveal! 🎉
            </p>
          </div>

          {/* Countdown Timer - FIXED! */}
          <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div
                key={unit}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-pink-100 dark:border-gray-700"
              >
                <div className="text-2xl md:text-3xl font-bold text-pink-600 dark:text-pink-400">
                  {value.toString().padStart(2, "0")}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">{unit}</div>
              </div>
            ))}
          </div>

          <Button
            onClick={() => scrollToSection("rsvp")}
            className="bg-gradient-to-r from-pink-400 to-blue-400 hover:from-pink-500 hover:to-blue-500 text-white px-8 py-4 text-xl rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            RSVP Now 💕
          </Button>

          {/* Decorative Elements */}
          <div className="absolute top-20 left-10 text-6xl animate-bounce text-pink-300 dark:text-pink-400">🎈</div>
          <div
            className="absolute top-32 right-10 text-4xl animate-bounce text-blue-300 dark:text-blue-400"
            style={{ animationDelay: "1s" }}
          >
            🧸
          </div>
          <div
            className="absolute bottom-20 left-20 text-5xl animate-bounce text-pink-300 dark:text-pink-400"
            style={{ animationDelay: "2s" }}
          >
            👶
          </div>
          <div
            className="absolute bottom-32 right-20 text-4xl animate-bounce text-blue-300 dark:text-blue-400"
            style={{ animationDelay: "0.5s" }}
          >
            🍼
          </div>
        </div>
      </section>

      {/* Invitation Section */}
      <section id="invitation" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl border-2 border-pink-100 dark:border-gray-700 rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-pink-100 to-blue-100 dark:from-pink-900/30 dark:to-blue-900/30 text-center py-8">
              <CardTitle className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                You're Invited! 💌
              </CardTitle>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                We can't wait to share this magical moment with our favorite people! Join us as we discover whether our
                little bundle of joy will be wearing pink or blue! Your presence will make this day even more special.
                💕
              </p>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 p-4 bg-pink-50 dark:bg-pink-900/20 rounded-2xl">
                    <Calendar className="text-pink-500 w-8 h-8" />
                    <div>
                      <h3 className="font-bold text-gray-800 dark:text-gray-100">Date & Time</h3>
                      <p className="text-gray-600 dark:text-gray-300">Monday, July 28th, 2025</p>
                      <p className="text-gray-600 dark:text-gray-300">5:00 PM - 7:00 PM</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                    <MapPin className="text-blue-500 w-8 h-8" />
                    <div>
                      <h3 className="font-bold text-gray-800 dark:text-gray-100">Location</h3>
                      <p className="text-gray-600 dark:text-gray-300">1406 Westchester Rd</p>
                      <p className="text-gray-600 dark:text-gray-300">Buffalo Grove, 60089, IL</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-gradient-to-br from-pink-50 to-blue-50 dark:from-pink-900/20 dark:to-blue-900/20 rounded-2xl border-2 border-dashed border-pink-200 dark:border-gray-600">
                    <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center">
                      <Crown className="w-5 h-5 mr-2 text-yellow-500" />
                      Dress Code
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-center text-lg font-medium">
                      Wear Pink 💖 or Blue 💙 to show your guess!
                    </p>
                  </div>

                  <Button
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-2xl"
                    onClick={() =>
                      window.open(
                        "https://www.google.com/maps/search/?api=1&query=1406+Westchester+Rd+Buffalo+Grove+IL+60089",
                        "_blank",
                      )
                    }
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    View on Google Maps
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* RSVP Section */}
      <section
        id="rsvp"
        className="py-20 px-4 bg-gradient-to-r from-pink-50 to-blue-50 dark:from-pink-900/10 dark:to-blue-900/10"
      >
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              RSVP & Make Your Guess! 🎯
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">Let us know you're coming and pick your team!</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* RSVP Form */}
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl rounded-3xl border-2 border-pink-100 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-gray-800 dark:text-gray-100">Your RSVP</CardTitle>
              </CardHeader>
              <CardContent>
                <form action={rsvpAction} className="space-y-4">
                  <Input
                    name="name"
                    placeholder="Your Name"
                    className="rounded-xl border-pink-200 dark:border-gray-600 focus:border-pink-400 dark:focus:border-pink-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                  />
                  <Input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    className="rounded-xl border-pink-200 dark:border-gray-600 focus:border-pink-400 dark:focus:border-pink-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                  />

                  <div className="space-y-3">
                    <label className="font-medium text-gray-700 dark:text-gray-300">Will you attend?</label>
                    <div className="flex space-x-4">
                      {["Yes", "No", "Maybe"].map((option) => (
                        <label key={option} className="flex items-center space-x-2 cursor-pointer">
                          <input type="radio" name="attendance" value={option} className="text-pink-500" required />
                          <span className="text-gray-700 dark:text-gray-300">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">Number of Guests</label>
                    <Input
                      type="number"
                      name="guests"
                      min="1"
                      max="10"
                      defaultValue="1"
                      className="rounded-xl border-pink-200 dark:border-gray-600 focus:border-pink-400 dark:focus:border-pink-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="font-medium text-gray-700 dark:text-gray-300">Pick Your Team!</label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className="cursor-pointer">
                        <input type="radio" name="team" value="pink" className="sr-only" />
                        <div className="p-4 rounded-2xl border-2 text-center transition-all border-pink-200 dark:border-pink-700 hover:border-pink-300 dark:hover:border-pink-600 bg-white dark:bg-gray-700">
                          <div className="text-2xl mb-2">💖</div>
                          <div className="font-bold text-pink-600 dark:text-pink-400">Team Pink</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">It's a Girl!</div>
                        </div>
                      </label>

                      <label className="cursor-pointer">
                        <input type="radio" name="team" value="blue" className="sr-only" />
                        <div className="p-4 rounded-2xl border-2 text-center transition-all border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600 bg-white dark:bg-gray-700">
                          <div className="text-2xl mb-2">💙</div>
                          <div className="font-bold text-blue-600 dark:text-blue-400">Team Blue</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">It's a Boy!</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={rsvpPending}
                    className="w-full bg-gradient-to-r from-pink-400 to-blue-400 hover:from-pink-500 hover:to-blue-500 text-white py-3 rounded-xl"
                  >
                    {rsvpPending ? "Submitting..." : "Submit RSVP 🎉"}
                  </Button>

                  {rsvpState && (
                    <div
                      className={`mt-4 p-3 rounded-xl text-center ${
                        rsvpState.success
                          ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                          : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                      }`}
                    >
                      {rsvpState.success ? rsvpState.message : rsvpState.error}
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Vote Counter */}
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl rounded-3xl border-2 border-blue-100 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-gray-800 dark:text-gray-100">
                  Current Predictions 📊
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-pink-50 dark:bg-pink-900/20 rounded-2xl">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">💖</div>
                      <div>
                        <div className="font-bold text-pink-600 dark:text-pink-400">Team Pink</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">It's a Girl!</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">{teamVotes.pink}</div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">💙</div>
                      <div>
                        <div className="font-bold text-blue-600 dark:text-blue-400">Team Blue</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">It's a Boy!</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{teamVotes.blue}</div>
                  </div>
                </div>

                {/* Vote Percentage Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-pink-600 dark:text-pink-400">
                      Pink: {Math.round((teamVotes.pink / (teamVotes.pink + teamVotes.blue)) * 100)}%
                    </span>
                    <span className="text-blue-600 dark:text-blue-400">
                      Blue: {Math.round((teamVotes.blue / (teamVotes.pink + teamVotes.blue)) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-pink-400 to-pink-500 h-full transition-all duration-500"
                      style={{ width: `${(teamVotes.pink / (teamVotes.pink + teamVotes.blue)) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="text-center p-4 bg-gradient-to-r from-pink-50 to-blue-50 dark:from-pink-900/20 dark:to-blue-900/20 rounded-2xl">
                  <div className="text-lg font-bold text-gray-800 dark:text-gray-100">Total Votes</div>
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {teamVotes.pink + teamVotes.blue}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Message Board */}
      <section
        id="messages"
        className="py-20 px-4 bg-gradient-to-r from-pink-50 to-blue-50 dark:from-pink-900/10 dark:to-blue-900/10"
      >
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">Message Board 💌</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">Leave your congratulations and predictions!</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Message Form */}
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl rounded-3xl border-2 border-pink-100 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-gray-800 dark:text-gray-100">Leave a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form action={messageAction} className="space-y-4">
                  <Input
                    name="name"
                    placeholder="Your Name"
                    className="rounded-xl border-pink-200 dark:border-gray-600 focus:border-pink-400 dark:focus:border-pink-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                  />
                  <Textarea
                    name="message"
                    placeholder="Your message or prediction..."
                    className="rounded-xl border-pink-200 dark:border-gray-600 focus:border-pink-400 dark:focus:border-pink-400 min-h-[100px] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                  />
                  <Button
                    type="submit"
                    disabled={messagePending}
                    className="w-full bg-gradient-to-r from-pink-400 to-blue-400 hover:from-pink-500 hover:to-blue-500 text-white py-3 rounded-xl"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {messagePending ? "Posting..." : "Post Message"}
                  </Button>

                  {messageState && (
                    <div
                      className={`mt-4 p-3 rounded-xl text-center ${
                        messageState.success
                          ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                          : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                      }`}
                    >
                      {messageState.success ? messageState.message : messageState.error}
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Messages Display */}
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl rounded-3xl border-2 border-blue-100 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-gray-800 dark:text-gray-100">Recent Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-2xl ${
                        msg.team === "pink"
                          ? "bg-pink-50 dark:bg-pink-900/20 border-l-4 border-pink-400"
                          : "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-bold text-gray-800 dark:text-gray-100">{msg.name}</div>
                        <div className="text-xl">{msg.team === "pink" ? "💖" : "💙"}</div>
                      </div>
                      <div className="text-gray-600 dark:text-gray-300">{msg.message}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-pink-100 to-blue-100 dark:from-pink-900/20 dark:to-blue-900/20 py-12 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="space-y-6">
            <div className="text-3xl">💕</div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Thank You!</h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We're so grateful to have you in our lives and can't wait to celebrate this special moment with you. Your
              love and support mean the world to us!
            </p>
            <div className="text-sm text-gray-500 dark:text-gray-400">Made with 💕 for our little miracle</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
