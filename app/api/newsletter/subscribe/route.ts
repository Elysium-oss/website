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

    // Normalize email (lowercase, trim)
    const normalizedEmail = email.toLowerCase().trim()

    // Get Substack URL from environment
    const substackUrl = process.env.NEXT_PUBLIC_SUBSTACK_URL || "https://yash102244.substack.com";

    // Substack's /api/v1/free endpoint expects URL-encoded form data
    // Use URLSearchParams instead of FormData for proper encoding
    const params = new URLSearchParams()
    params.append("email", normalizedEmail)
    params.append("source", "website")

    console.log(`[Newsletter] Attempting to subscribe: ${normalizedEmail}`)
    console.log(`[Newsletter] Substack URL: ${substackUrl}`)
    console.log(`[Newsletter] Endpoint: ${substackUrl}/api/v1/free`)

    // Post to Substack's subscription endpoint
    const response = await fetch(`${substackUrl}/api/v1/free`, {
      method: "POST",
      body: params.toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": `${substackUrl}/`,
        "Origin": substackUrl,
        "Accept": "application/json, text/plain, */*",
      },
    })

    // Get response text first to see what Substack returns
    const responseText = await response.text()
    console.log(`[Newsletter] Substack response status: ${response.status}`)
    console.log(`[Newsletter] Substack response body: ${responseText.substring(0, 500)}`)

    // Check if the request was successful
    if (!response.ok) {
      // Try to get error details
      let errorMessage = "Failed to subscribe to newsletter"
      let errorType = "error"
      
      try {
        // Try to parse as JSON if possible
        let parsedError: any = null
        try {
          parsedError = JSON.parse(responseText)
        } catch {
          // Not JSON, use as text
        }
        
        console.error(`[Newsletter] Substack API error: ${response.status}`)
        console.error(`[Newsletter] Substack error response:`, parsedError || responseText)
        
        // Extract error message from parsed JSON if available
        if (parsedError && parsedError.error) {
          errorMessage = parsedError.error
        } else if (parsedError && typeof parsedError === 'string') {
          errorMessage = parsedError
        } else if (responseText) {
          errorMessage = responseText.substring(0, 200)
        }
        
        // Check for specific error cases
        const lowerErrorData = (parsedError?.error || responseText || "").toLowerCase()
        if (response.status === 400) {
          if (lowerErrorData.includes("already subscribed") || lowerErrorData.includes("already exists")) {
            errorMessage = "You're already subscribed to our newsletter!"
            errorType = "already_subscribed"
          } else if (lowerErrorData.includes("valid email") || lowerErrorData.includes("invalid email")) {
            errorMessage = parsedError?.error || "Invalid email address. Please check and try again."
            errorType = "invalid_email"
          } else {
            // Use the actual error from Substack
            errorMessage = parsedError?.error || errorMessage
            errorType = "invalid_request"
          }
        } else if (response.status === 429) {
          errorMessage = "Too many requests. Please try again later."
          errorType = "rate_limit"
        } else if (response.status === 422) {
          errorMessage = parsedError?.error || "Invalid email address. Please check and try again."
          errorType = "invalid_email"
        } else if (response.status === 403) {
          errorMessage = "Subscription not allowed. Please contact support."
          errorType = "forbidden"
        }
      } catch (e) {
        console.error(`[Newsletter] Error parsing error response:`, e)
      }

      return NextResponse.json(
        { 
          error: errorMessage,
          type: errorType,
          alreadySubscribed: errorType === "already_subscribed",
          debug: process.env.NODE_ENV === 'development' ? {
            status: response.status,
            responseText: responseText.substring(0, 200)
          } : undefined
        },
        { status: response.status }
      )
    }

    // Check if response indicates success
    // Substack may return HTML or JSON, both can indicate success
    const lowerResponse = responseText.toLowerCase()
    const isSuccess = response.status === 200 || 
                     response.status === 201 || 
                     lowerResponse.includes("success") ||
                     lowerResponse.includes("check your email") ||
                     lowerResponse.includes("confirmation")

    if (isSuccess) {
      console.log(`[Newsletter] Successfully subscribed: ${normalizedEmail}`)
      return NextResponse.json(
        { 
          success: true, 
          message: "Successfully subscribed! Please check your email to confirm your subscription.",
          email: normalizedEmail
        },
        { status: 200 }
      )
    }

    // If we get here, response was OK but unclear
    console.warn(`[Newsletter] Unclear response for ${normalizedEmail}: ${response.status} - ${responseText.substring(0, 200)}`)
    return NextResponse.json(
      { 
        success: true, 
        message: "Subscription request received. Please check your email to confirm.",
        email: normalizedEmail,
        warning: "Response format was unexpected, but request was accepted"
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("[Newsletter] Error subscribing to newsletter:", error)
    return NextResponse.json(
      { 
        error: "Internal server error. Please try again later.",
        message: error.message || "An unexpected error occurred"
      },
      { status: 500 }
    )
  }
}

