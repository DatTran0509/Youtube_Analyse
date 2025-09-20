// client/src/app/api/result/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import axios from 'axios';

export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params trước khi sử dụng
    const { id } = await params;
    
    const { userId } = await auth();
  
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Analysis ID is required' },
        { status: 400 }
      );
    }

    // Gửi userId qua header
    const headers = {
      'x-user-id': userId
    };


    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://0.0.0.0:8080';
    const url = `${backendUrl}/api/result/${id}`;
  

    const response = await axios.get(url, {
      headers,
      timeout: 30000
    });
    return NextResponse.json(response.data);

  } catch (error) {
    console.error('Result API error:', error);
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}