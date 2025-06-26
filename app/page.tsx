"use client"

import { useState, useEffect } from "react"
import {
  Heart,
  MapPin,
  Users,
  Baby,
  Gift,
  Music,
  MessageCircle,
  Calendar,
  Camera,
  BombIcon as Balloon,
  Star,
  Crown,
  Cake,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { submitRSVP, submitMessage, getTeamVotes, getMessages } from "@/lib/actions"
import { useActionState } from "react"

export default function GenderRevealParty() {
  const [timeLeft, setTimeLeft] = useState({ days: 1, hours: 15, minutes: 30, seconds: 30 })
  const [teamVotes, setTeamVotes] = useState({ pink: 12, blue: 8 })
  const [messages, setMessages] = useState([
    { name: "Sarah M.", message: "So excited for you both! 💕", team: "pink" },
    { name: "Mike R.", message: "Team Blue all the way! 💙", team: "blue" },
    { name: "Emma L.", message: "Can't wait to find out! 🎉", team: "pink" },
  ])
  const [newMessage, setNewMessage] = useState({ name: "", message: "" })
  const [currentPhoto, setCurrentPhoto] = useState(0)
  const [musicPlaying, setMusicPlaying] = useState(false)
  const [balloonClicked, setBalloonClicked] = useState<number | null>(null)
  const [activeSection, setActiveSection] = useState("hero")

  const eventDate = new Date("2024-07-15T15:00:00")
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
    { time: "3:00 PM", event: "Arrival & Mingling", icon: Users },
    { time: "3:30 PM", event: "Games & Activities", icon: Star },
    { time: "4:00 PM", event: "Food & Refreshments", icon: Cake },
    { time: "4:30 PM", event: "The Big Reveal!", icon: Gift },
    { time: "5:00 PM", event: "Celebration & Photos", icon: Camera },
  ]

  // Replace the existing rsvpData state and handleRSVP function
  const [rsvpState, rsvpAction, rsvpPending] = useActionState(submitRSVP, null)
  const [messageState, messageAction, messagePending] = useActionState(submitMessage, null)

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
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
    }

    loadData()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = eventDate.getTime() - now

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "invitation", "rsvp", "games", "photos", "schedule", "messages", "reveal"]
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
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const nextPhoto = () => {
    setCurrentPhoto((prev) => (prev + 1) % photos.length)
  }

  const prevPhoto = () => {
    setCurrentPhoto((prev) => (prev - 1 + photos.length) % photos.length)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Sticky Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md shadow-lg z-50 border-b border-pink-100">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-center space-x-6 text-sm">
            {[
              { id: "hero", label: "Home" },
              { id: "invitation", label: "Details" },
              { id: "rsvp", label: "RSVP" },
              { id: "games", label: "Games" },
              { id: "photos", label: "Photos" },
              { id: "schedule", label: "Schedule" },
              { id: "messages", label: "Messages" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-3 py-2 rounded-full transition-all duration-300 font-medium ${
                  activeSection === item.id
                    ? "bg-pink-200 text-pink-800"
                    : "text-gray-600 hover:text-pink-600 hover:bg-pink-50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Floating Confetti Animation */}
      <div className="fixed inset-0 pointer-events-none z-10">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute animate-bounce ${i % 2 === 0 ? "text-pink-300" : "text-blue-300"}`}
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
            <p className="text-xl md:text-2xl text-gray-600 font-medium">Join us for the big reveal! 🎉</p>
          </div>

          {/* Countdown Timer */}
          <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div key={unit} className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-pink-100">
                <div className="text-2xl md:text-3xl font-bold text-pink-600">{value}</div>
                <div className="text-sm text-gray-600 capitalize">{unit}</div>
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
          <div className="absolute top-20 left-10 text-6xl animate-bounce text-pink-300">🎈</div>
          <div
            className="absolute top-32 right-10 text-4xl animate-bounce text-blue-300"
            style={{ animationDelay: "1s" }}
          >
            🧸
          </div>
          <div
            className="absolute bottom-20 left-20 text-5xl animate-bounce text-pink-300"
            style={{ animationDelay: "2s" }}
          >
            👶
          </div>
          <div
            className="absolute bottom-32 right-20 text-4xl animate-bounce text-blue-300"
            style={{ animationDelay: "0.5s" }}
          >
            🍼
          </div>
        </div>
      </section>

      {/* Invitation Section */}
      <section id="invitation" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-2 border-pink-100 rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-pink-100 to-blue-100 text-center py-8">
              <CardTitle className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">You're Invited! 💌</CardTitle>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                We can't wait to share this magical moment with our favorite people! Join us as we discover whether our
                little bundle of joy will be wearing pink or blue! Your presence will make this day even more special.
                💕
              </p>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 p-4 bg-pink-50 rounded-2xl">
                    <Calendar className="text-pink-500 w-8 h-8" />
                    <div>
                      <h3 className="font-bold text-gray-800">Date & Time</h3>
                      <p className="text-gray-600">Saturday, July 28th, 2025</p>
                      <p className="text-gray-600">4:00 PM - 6:00 PM</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-2xl">
                    <MapPin className="text-blue-500 w-8 h-8" />
                    <div>
                      <h3 className="font-bold text-gray-800">Location</h3>
                      <p className="text-gray-600">The Johnson Family Backyard</p>
                      <p className="text-gray-600">123 Maple Street, Hometown</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-gradient-to-br from-pink-50 to-blue-50 rounded-2xl border-2 border-dashed border-pink-200">
                    <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                      <Crown className="w-5 h-5 mr-2 text-yellow-500" />
                      Dress Code
                    </h3>
                    <p className="text-gray-600 text-center text-lg font-medium">
                      Wear Pink 💖 or Blue 💙 to show your guess!
                    </p>
                  </div>

                  <Button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-2xl">
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
      <section id="rsvp" className="py-20 px-4 bg-gradient-to-r from-pink-50 to-blue-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">RSVP & Make Your Guess! 🎯</h2>
            <p className="text-xl text-gray-600">Let us know you're coming and pick your team!</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* RSVP Form */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-xl rounded-3xl border-2 border-pink-100">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-gray-800">Your RSVP</CardTitle>
              </CardHeader>
              <CardContent>
                <form action={rsvpAction} className="space-y-4">
                  <Input
                    name="name"
                    placeholder="Your Name"
                    className="rounded-xl border-pink-200 focus:border-pink-400"
                    required
                  />
                  <Input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    className="rounded-xl border-pink-200 focus:border-pink-400"
                    required
                  />

                  <div className="space-y-3">
                    <label className="font-medium text-gray-700">Will you attend?</label>
                    <div className="flex space-x-4">
                      {["Yes", "No", "Maybe"].map((option) => (
                        <label key={option} className="flex items-center space-x-2 cursor-pointer">
                          <input type="radio" name="attendance" value={option} className="text-pink-500" required />
                          <span className="text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700 mb-2">Number of Guests</label>
                    <Input
                      type="number"
                      name="guests"
                      min="1"
                      max="10"
                      defaultValue="1"
                      className="rounded-xl border-pink-200 focus:border-pink-400"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="font-medium text-gray-700">Pick Your Team!</label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className="cursor-pointer">
                        <input type="radio" name="team" value="pink" className="sr-only" />
                        <div className="p-4 rounded-2xl border-2 text-center transition-all border-pink-200 hover:border-pink-300">
                          <div className="text-2xl mb-2">💖</div>
                          <div className="font-bold text-pink-600">Team Pink</div>
                          <div className="text-sm text-gray-600">It's a Girl!</div>
                        </div>
                      </label>

                      <label className="cursor-pointer">
                        <input type="radio" name="team" value="blue" className="sr-only" />
                        <div className="p-4 rounded-2xl border-2 text-center transition-all border-blue-200 hover:border-blue-300">
                          <div className="text-2xl mb-2">💙</div>
                          <div className="font-bold text-blue-600">Team Blue</div>
                          <div className="text-sm text-gray-600">It's a Boy!</div>
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
                        rsvpState.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                      }`}
                    >
                      {rsvpState.success ? rsvpState.message : rsvpState.error}
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Vote Counter */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-xl rounded-3xl border-2 border-blue-100">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-gray-800">Current Predictions 📊</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-pink-50 rounded-2xl">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">💖</div>
                      <div>
                        <div className="font-bold text-pink-600">Team Pink</div>
                        <div className="text-sm text-gray-600">It's a Girl!</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-pink-600">{teamVotes.pink}</div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">💙</div>
                      <div>
                        <div className="font-bold text-blue-600">Team Blue</div>
                        <div className="text-sm text-gray-600">It's a Boy!</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{teamVotes.blue}</div>
                  </div>
                </div>

                {/* Vote Percentage Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-pink-600">
                      Pink: {Math.round((teamVotes.pink / (teamVotes.pink + teamVotes.blue)) * 100)}%
                    </span>
                    <span className="text-blue-600">
                      Blue: {Math.round((teamVotes.blue / (teamVotes.pink + teamVotes.blue)) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-pink-400 to-pink-500 h-full transition-all duration-500"
                      style={{ width: `${(teamVotes.pink / (teamVotes.pink + teamVotes.blue)) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="text-center p-4 bg-gradient-to-r from-pink-50 to-blue-50 rounded-2xl">
                  <div className="text-lg font-bold text-gray-800">Total Votes</div>
                  <div className="text-3xl font-bold text-purple-600">{teamVotes.pink + teamVotes.blue}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Games Section */}
      <section id="games" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Fun & Games! 🎮</h2>
            <p className="text-xl text-gray-600">Play some games while we wait for the big reveal!</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Balloon Game */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-xl rounded-3xl border-2 border-pink-100">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-gray-800 flex items-center justify-center">
                  <Balloon className="w-6 h-6 mr-2 text-pink-500" />
                  Pop a Balloon for a Hint!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[...Array(6)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setBalloonClicked(i)}
                      className={`text-4xl p-4 rounded-2xl transition-all transform hover:scale-110 ${
                        i % 2 === 0 ? "hover:bg-pink-50" : "hover:bg-blue-50"
                      }`}
                    >
                      🎈
                    </button>
                  ))}
                </div>
                {balloonClicked !== null && (
                  <div className="p-4 bg-gradient-to-r from-pink-50 to-blue-50 rounded-2xl text-center">
                    <div className="text-lg font-medium text-gray-800">
                      {balloonHints[balloonClicked % balloonHints.length]}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Baby Name Poll */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-xl rounded-3xl border-2 border-blue-100">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-gray-800 flex items-center justify-center">
                  <Baby className="w-6 h-6 mr-2 text-blue-500" />
                  Guess the Baby Names!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="text-center font-medium text-gray-700">If it's a girl...</div>
                  <div className="grid grid-cols-2 gap-2">
                    {["Emma", "Olivia", "Sophia", "Isabella"].map((name) => (
                      <button
                        key={name}
                        className="p-2 bg-pink-50 hover:bg-pink-100 rounded-xl text-pink-700 font-medium transition-colors"
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-center font-medium text-gray-700">If it's a boy...</div>
                  <div className="grid grid-cols-2 gap-2">
                    {["Liam", "Noah", "Oliver", "Ethan"].map((name) => (
                      <button
                        key={name}
                        className="p-2 bg-blue-50 hover:bg-blue-100 rounded-xl text-blue-700 font-medium transition-colors"
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-center text-sm text-gray-500 mt-4">
                  Click your favorites! Results will be revealed at the party 🎉
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Photo Carousel */}
      <section id="photos" className="py-20 px-4 bg-gradient-to-r from-pink-50 to-blue-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Our Journey 📸</h2>
            <p className="text-xl text-gray-600">Precious moments leading up to this special day</p>
          </div>

          <Card className="bg-white/90 backdrop-blur-sm shadow-xl rounded-3xl border-2 border-pink-100 overflow-hidden">
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={photos[currentPhoto] || "/placeholder.svg"}
                  alt={`Memory ${currentPhoto + 1}`}
                  className="w-full h-96 object-cover"
                />

                <button
                  onClick={prevPhoto}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-all"
                >
                  ←
                </button>

                <button
                  onClick={nextPhoto}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-all"
                >
                  →
                </button>

                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {photos.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPhoto(i)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        i === currentPhoto ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="p-6 text-center">
                <Button
                  onClick={() => setMusicPlaying(!musicPlaying)}
                  className={`${
                    musicPlaying ? "bg-green-500 hover:bg-green-600" : "bg-purple-500 hover:bg-purple-600"
                  } text-white px-6 py-3 rounded-2xl transition-all`}
                >
                  <Music className="w-4 h-4 mr-2" />
                  {musicPlaying ? "Pause Music 🎵" : "Play Lullaby 🎵"}
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  {musicPlaying ? "Playing: Brahms Lullaby" : "Click to play background music"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Schedule Section */}
      <section id="schedule" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Event Schedule ⏰</h2>
            <p className="text-xl text-gray-600">Here's what we have planned for our special day!</p>
          </div>

          <Card className="bg-white/90 backdrop-blur-sm shadow-xl rounded-3xl border-2 border-pink-100">
            <CardContent className="p-8">
              <div className="space-y-6">
                {schedule.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-6 p-4 rounded-2xl bg-gradient-to-r from-pink-50 to-blue-50 border border-pink-100"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-blue-400 rounded-full flex items-center justify-center">
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="font-bold text-lg text-gray-800">{item.event}</div>
                      <div className="text-gray-600">{item.time}</div>
                    </div>
                    {index === 3 && <div className="text-2xl animate-pulse">🎉</div>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Message Board */}
      <section id="messages" className="py-20 px-4 bg-gradient-to-r from-pink-50 to-blue-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Message Board 💌</h2>
            <p className="text-xl text-gray-600">Leave your congratulations and predictions!</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Message Form */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-xl rounded-3xl border-2 border-pink-100">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-gray-800">Leave a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form action={messageAction} className="space-y-4">
                  <Input
                    name="name"
                    placeholder="Your Name"
                    className="rounded-xl border-pink-200 focus:border-pink-400"
                    required
                  />
                  <Textarea
                    name="message"
                    placeholder="Your message or prediction..."
                    className="rounded-xl border-pink-200 focus:border-pink-400 min-h-[100px]"
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
                        messageState.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                      }`}
                    >
                      {messageState.success ? messageState.message : messageState.error}
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Messages Display */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-xl rounded-3xl border-2 border-blue-100">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-gray-800">Recent Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-2xl ${
                        msg.team === "pink"
                          ? "bg-pink-50 border-l-4 border-pink-400"
                          : "bg-blue-50 border-l-4 border-blue-400"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-bold text-gray-800">{msg.name}</div>
                        <div className="text-xl">{msg.team === "pink" ? "💖" : "💙"}</div>
                      </div>
                      <div className="text-gray-600">{msg.message}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Reveal Section */}
      <section id="reveal" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl rounded-3xl border-2 border-purple-100 text-center">
            <CardContent className="p-12">
              <div className="space-y-8">
                <div className="text-6xl animate-pulse">🎁</div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800">The Big Reveal!</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  This section will be updated with the exciting news after our party! Make sure to check back to see if
                  your prediction was correct! 🎉
                </p>
                <div className="p-6 bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 rounded-2xl border-2 border-dashed border-purple-200">
                  <div className="text-2xl font-bold text-purple-600 mb-2">Coming Soon...</div>
                  <div className="text-gray-600">The moment we've all been waiting for!</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-pink-100 to-blue-100 py-12 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="space-y-6">
            <div className="text-3xl">💕</div>
            <h3 className="text-2xl font-bold text-gray-800">Thank You!</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're so grateful to have you in our lives and can't wait to celebrate this special moment with you. Your
              love and support mean the world to us!
            </p>
            <div className="flex justify-center space-x-6">
              <Button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-2xl">
                <Gift className="w-4 h-4 mr-2" />
                Gift Registry
              </Button>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-2xl">
                <Heart className="w-4 h-4 mr-2" />
                Follow Us
              </Button>
            </div>
            <div className="text-sm text-gray-500">Made with 💕 for our little miracle</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
