import { NextResponse } from "next/server"

/**
 * API Route to fetch list of newsletter subscribers
 * 
 * Note: Substack doesn't provide a public API endpoint for subscribers.
 * This route attempts to use the Substack API service if available,
 * but the primary method is to use the Substack Dashboard.
 * 
 * Methods to view subscribers:
 * 1. Substack Dashboard (Recommended):
 *    - Log in to https://substack.com
 *    - Navigate to your publication dashboard
 *    - Click on "Subscribers" tab
 *    - Export as CSV if needed
 * 
 * 2. API (if supported by your API service):
 *    - Requires SUBSTACK_API_KEY in environment
 *    - May not be available depending on API service
 */

export async function GET(request: Request) {
  try {
    // Check if API key is provided
    const apiKey = process.env.SUBSTACK_API_KEY || process.env.NEXT_PUBLIC_SUBSTACK_API_KEY
    
    if (!apiKey) {
      return NextResponse.json(
        { 
          error: "API key not configured",
          message: "To fetch subscribers via API, set SUBSTACK_API_KEY in your environment variables.",
          alternative: "Use the Substack Dashboard to view subscribers: https://substack.com → Your Publication → Subscribers"
        },
        { status: 401 }
      )
    }

    const apiBaseUrl = process.env.SUBSTACK_API_BASE_URL || "https://api.substackapi.dev"
    const substackUrl = process.env.NEXT_PUBLIC_SUBSTACK_URL || "https://yash102244.substack.com"
    
    // Try to fetch subscribers from API (if endpoint exists)
    // Note: This endpoint may not be available in all API services
    try {
      const response = await fetch(`${apiBaseUrl}/subscribers`, {
        headers: {
          "X-API-Key": apiKey,
          "Content-Type": "application/json",
        },
        cache: 'no-store',
      })

      if (response.ok) {
        const data = await response.json()
        return NextResponse.json({
          subscribers: data,
          source: "api",
          count: Array.isArray(data) ? data.length : data?.count || 0,
        })
      }

      // If endpoint doesn't exist (404) or not authorized (403/401)
      if (response.status === 404) {
        return NextResponse.json(
          {
            error: "Subscribers endpoint not available",
            message: "The API service doesn't provide a subscribers endpoint.",
            alternative: "Use the Substack Dashboard: https://substack.com → Your Publication → Subscribers",
            dashboardUrl: substackUrl.replace('.substack.com', '.substack.com/dashboard/subscribers'),
          },
          { status: 404 }
        )
      }

      if (response.status === 403 || response.status === 401) {
        return NextResponse.json(
          {
            error: "API key invalid or insufficient permissions",
            message: "Your API key doesn't have access to subscriber data.",
            alternative: "Use the Substack Dashboard: https://substack.com → Your Publication → Subscribers",
          },
          { status: response.status }
        )
      }

      // Other errors
      const errorText = await response.text()
      return NextResponse.json(
        {
          error: "Failed to fetch subscribers",
          message: errorText || response.statusText,
          alternative: "Use the Substack Dashboard: https://substack.com → Your Publication → Subscribers",
        },
        { status: response.status }
      )
    } catch (apiError: any) {
      // Network or other API errors
      return NextResponse.json(
        {
          error: "API request failed",
          message: apiError.message || "Unable to connect to API service",
          alternative: "Use the Substack Dashboard: https://substack.com → Your Publication → Subscribers",
          dashboardUrl: substackUrl.replace('.substack.com', '.substack.com/dashboard/subscribers'),
        },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error("Error fetching subscribers:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error.message || "An unexpected error occurred",
        alternative: "Use the Substack Dashboard: https://substack.com → Your Publication → Subscribers",
      },
      { status: 500 }
    )
  }
}

