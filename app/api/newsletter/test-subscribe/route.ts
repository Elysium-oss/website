import { NextResponse } from "next/server"

/**
 * Debug endpoint to test subscription functionality
 * This helps verify if subscriptions are working correctly
 * 
 * Usage: POST /api/newsletter/test-subscribe
 * Body: { "email": "test@example.com" }
 */
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

    const normalizedEmail = email.toLowerCase().trim()
    const substackUrl = process.env.NEXT_PUBLIC_SUBSTACK_URL || "https://yash102244.substack.com"

    // Use URLSearchParams for proper form encoding
    const params = new URLSearchParams()
    params.append("email", normalizedEmail)
    params.append("source", "website")

    console.log(`[Test Subscribe] Testing subscription for: ${normalizedEmail}`)
    console.log(`[Test Subscribe] Substack URL: ${substackUrl}`)
    console.log(`[Test Subscribe] Endpoint: ${substackUrl}/api/v1/free`)
    console.log(`[Test Subscribe] Request body: ${params.toString()}`)

    // Make the request
    const startTime = Date.now()
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
    const duration = Date.now() - startTime

    const responseText = await response.text()
    let parsedResponse = null
    
    try {
      parsedResponse = JSON.parse(responseText)
    } catch {
      // Not JSON, keep as text
    }

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      duration: `${duration}ms`,
      email: normalizedEmail,
      substackUrl,
      endpoint: `${substackUrl}/api/v1/free`,
      response: {
        raw: responseText.substring(0, 1000), // First 1000 chars
        parsed: parsedResponse,
        headers: Object.fromEntries(response.headers.entries()),
      },
      interpretation: {
        isSuccess: response.ok && (response.status === 200 || response.status === 201),
        requiresConfirmation: responseText.toLowerCase().includes("check your email") || 
                             responseText.toLowerCase().includes("confirmation"),
        alreadySubscribed: responseText.toLowerCase().includes("already subscribed") ||
                          responseText.toLowerCase().includes("already exists"),
        note: response.ok 
          ? "Subscription request was accepted. User must confirm via email before appearing in subscriber list."
          : "Subscription request was rejected. Check error details above."
      }
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Test failed",
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

