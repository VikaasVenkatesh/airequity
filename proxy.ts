import { NextResponse, type NextRequest } from "next/server"

// AirEquity — no auth required, pass all requests through
export function proxy(_request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}
