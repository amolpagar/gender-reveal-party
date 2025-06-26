"use server"

import { createServerClient } from "./supabase"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

interface RSVPData {
  name: string
  email: string
  attendance: string
  guests: number
  team: string
}

interface MessageData {
  name: string
  message: string
}

export async function submitRSVP(prevState: any, formData: FormData) {
  try {
    const supabase = createServerClient()

    const rsvpData: RSVPData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      attendance: formData.get("attendance") as string,
      guests: Number.parseInt(formData.get("guests") as string),
      team: formData.get("team") as string,
    }

    // Validate required fields
    if (!rsvpData.name || !rsvpData.email || !rsvpData.attendance) {
      return { success: false, error: "Please fill in all required fields" }
    }

    // Check if email already exists
    const { data: existingRSVP } = await supabase.from("rsvps").select("id").eq("email", rsvpData.email).single()

    if (existingRSVP) {
      return { success: false, error: "An RSVP with this email already exists" }
    }

    // Insert RSVP
    const { data: rsvp, error: rsvpError } = await supabase
      .from("rsvps")
      .insert({
        name: rsvpData.name,
        email: rsvpData.email,
        attendance: rsvpData.attendance,
        number_of_guests: rsvpData.guests,
        team_prediction: rsvpData.team,
      })
      .select()
      .single()

    if (rsvpError) {
      console.error("RSVP Error:", rsvpError)
      return { success: false, error: "Failed to submit RSVP" }
    }

    // Update team votes if team was selected
    if (rsvpData.team && rsvpData.attendance === "Yes") {
      const { error: voteError } = await supabase.rpc("increment_team_vote", {
        team_name: rsvpData.team,
      })

      if (voteError) {
        console.error("Vote Error:", voteError)
      }
    }

    // Send confirmation email
    if (rsvpData.attendance === "Yes") {
      await sendConfirmationEmail(rsvpData)
    }

    return {
      success: true,
      message: `Thank you ${rsvpData.name}! Your RSVP has been confirmed. ${
        rsvpData.attendance === "Yes" ? "Check your email for event details!" : ""
      }`,
    }
  } catch (error) {
    console.error("Submit RSVP Error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function submitMessage(prevState: any, formData: FormData) {
  try {
    const supabase = createServerClient()

    const messageData: MessageData = {
      name: formData.get("name") as string,
      message: formData.get("message") as string,
    }

    if (!messageData.name || !messageData.message) {
      return { success: false, error: "Please fill in all fields" }
    }

    // Randomly assign team for display purposes
    const randomTeam = Math.random() > 0.5 ? "pink" : "blue"

    const { error } = await supabase.from("messages").insert({
      name: messageData.name,
      message: messageData.message,
      team: randomTeam,
    })

    if (error) {
      console.error("Message Error:", error)
      return { success: false, error: "Failed to submit message" }
    }

    return { success: true, message: "Thank you for your message!" }
  } catch (error) {
    console.error("Submit Message Error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

async function sendConfirmationEmail(rsvpData: RSVPData) {
  try {
    const teamEmoji = rsvpData.team === "pink" ? "💖" : "💙"
    const teamText = rsvpData.team === "pink" ? "It's a Girl!" : "It's a Boy!"

    // Use different sender based on environment
    const fromEmail =
      process.env.NODE_ENV === "production"
        ? "Gender Reveal Party <noreply@yourdomain.com>" // Replace with your verified domain
        : "Gender Reveal Party <onboarding@resend.dev>" // Resend's test domain

    await resend.emails.send({
      from: fromEmail,
      to: [rsvpData.email],
      subject: "🎉 RSVP Confirmed - Gender Reveal Party!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #fce7f3 0%, #dbeafe 100%); padding: 20px; border-radius: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #374151; font-size: 32px; margin-bottom: 10px;">🎉 RSVP Confirmed!</h1>
            <p style="color: #6b7280; font-size: 18px;">Thank you for joining our special day!</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 15px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #374151; margin-bottom: 20px;">Hi ${rsvpData.name}! 👋</h2>
            
            <p style="color: #6b7280; line-height: 1.6; margin-bottom: 20px;">
              We're so excited that you'll be joining us for our gender reveal party! Here are the event details:
            </p>
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
              <h3 style="color: #374151; margin-bottom: 15px;">📅 Event Details</h3>
              <p style="margin: 5px 0; color: #6b7280;"><strong>Date:</strong> Saturday, July 15th, 2024</p>
              <p style="margin: 5px 0; color: #6b7280;"><strong>Time:</strong> 3:00 PM - 6:00 PM</p>
              <p style="margin: 5px 0; color: #6b7280;"><strong>Location:</strong> The Johnson Family Backyard</p>
              <p style="margin: 5px 0; color: #6b7280;"><strong>Address:</strong> 123 Maple Street, Hometown</p>
            </div>
            
            <div style="background: ${rsvpData.team === "pink" ? "#fdf2f8" : "#eff6ff"}; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid ${rsvpData.team === "pink" ? "#ec4899" : "#3b82f6"};">
              <h3 style="color: #374151; margin-bottom: 10px;">Your Prediction: ${teamEmoji}</h3>
              <p style="color: #6b7280; margin: 0;">You're on Team ${rsvpData.team === "pink" ? "Pink" : "Blue"} - ${teamText}</p>
            </div>
            
            <div style="background: #f0fdf4; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
              <h3 style="color: #374151; margin-bottom: 10px;">👗 Dress Code</h3>
              <p style="color: #6b7280; margin: 0;">Wear Pink 💖 or Blue 💙 to show your guess!</p>
            </div>
            
            <p style="color: #6b7280; line-height: 1.6;">
              We can't wait to see you there and share this magical moment with you! 
              ${rsvpData.guests > 1 ? `We've noted that you'll be bringing ${rsvpData.guests} guests total.` : ""}
            </p>
          </div>
          
          <div style="text-align: center; color: #9ca3af; font-size: 14px;">
            <p>Made with 💕 for our little miracle</p>
            <p>Questions? Reply to this email or call us at (555) 123-4567</p>
          </div>
        </div>
      `,
    })
  } catch (error) {
    console.error("Email Error:", error)
    // Don't throw error - RSVP should still succeed even if email fails
  }
}

export async function getTeamVotes() {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase.from("team_votes").select("team, count")

    if (error) {
      console.error("Get votes error:", error)
      return { pink: 12, blue: 8 } // fallback data
    }

    const votes = { pink: 0, blue: 0 }
    data?.forEach((vote) => {
      votes[vote.team as keyof typeof votes] = vote.count
    })

    return votes
  } catch (error) {
    console.error("Get team votes error:", error)
    return { pink: 12, blue: 8 } // fallback data
  }
}

export async function getMessages() {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from("messages")
      .select("name, message, team, created_at")
      .order("created_at", { ascending: false })
      .limit(10)

    if (error) {
      console.error("Get messages error:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Get messages error:", error)
    return []
  }
}
