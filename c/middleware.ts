import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('session-token');

    // If there is no token and the user is trying to access the dashboard
    if (!token && (request.nextUrl.pathname.startsWith('/tenants') || request.nextUrl.pathname.startsWith('/managers'))) {

        // Construct the login URL and redirect them
        const signInUrl = new URL('/signin', request.url);

        return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next(); // Continue if authenticated
}