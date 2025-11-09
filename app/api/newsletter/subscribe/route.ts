import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      )
    }

    // Get Substack URL from environment
    const substackUrl = process.env.NEXT_PUBLIC_SUBSTACK_URL;

    // Create form data for Substack subscription
    const formData = new FormData()
    formData.append("email", email)
    formData.append("source", "website")

    // Post to Substack's subscription endpoint
    const response = await fetch(`${substackUrl}/api/v1/free`, {
      method: "POST",
      body: formData,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Elysium/1.0)",
      },
    })

    // Check if the request was successful
    if (!response.ok) {
      // Try to get error details
      let errorMessage = "Failed to subscribe to newsletter"
      let errorType = "error"
      
      try {
        const errorData = await response.text()
        console.error("Substack API error:", response.status, errorData)
        
        // Check for specific error cases
        if (response.status === 400 || errorData.toLowerCase().includes("already subscribed")) {
          errorMessage = "You're already subscribed to our newsletter!"
          errorType = "already_subscribed"
        } else if (response.status === 429) {
          errorMessage = "Too many requests. Please try again later."
          errorType = "rate_limit"
        } else if (response.status === 422) {
          errorMessage = "Invalid email address. Please check and try again."
          errorType = "invalid_email"
        }
      } catch (e) {
        // Ignore parsing errors
      }

      return NextResponse.json(
        { 
          error: errorMessage,
          type: errorType,
          alreadySubscribed: errorType === "already_subscribed"
        },
        { status: response.status }
      )
    }

    // Successfully subscribed
    return NextResponse.json(
      { 
        success: true, 
        message: "Successfully subscribed to newsletter" 
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Error subscribing to newsletter:", error)
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    )
  }
}

