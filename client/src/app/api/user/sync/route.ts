// client/src/app/api/user/sync/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { reason } = body;

    const userEmail = user?.emailAddresses?.[0]?.emailAddress;
    const firstName = user?.firstName || '';
    const lastName = user?.lastName || '';
    const fullName = user?.fullName || `${firstName} ${lastName}`.trim() || '';

    const headers = {
      'Content-Type': 'application/json',
      'x-user-id': userId,
      'x-user-email': userEmail || ''
    };

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
    
    console.log(`Syncing user - reason: ${reason || 'manual'}`);
    
    const response = await axios.post(`${backendUrl}/api/user/sync`, {
      clerkId: userId,
      email: userEmail,
      name: fullName,
      firstName: firstName,
      lastName: lastName
    }, {
      headers,
      timeout: 10000
    });

    console.log(`User sync completed - action: ${response.data.data?.action || 'synced'}`);
    return NextResponse.json(response.data);

  } catch (error) {
    console.error('User sync error:', error);
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}