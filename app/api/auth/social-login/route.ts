import { NextResponse } from 'next/server';
import { admin } from '@/lib/firebase-admin.config';
import type { NextRequest } from 'next/server';

interface SocialLoginRequest {
  idToken: string;
  provider: string;
  userProfile: {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
    provider: string;
    isNewUser: boolean;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: SocialLoginRequest = await request.json();
    const { idToken, provider, userProfile } = body;

    if (!idToken || !provider || !userProfile) {
      return NextResponse.json(
        { error: 'Dados incompletos para login social' },
        { status: 400 }
      );
    }

    // Verify the ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Check if user exists in Firestore
    const userDoc = await admin.firestore().collection('users').doc(uid).get();
    const userExists = userDoc.exists;

    // User data to store
    const userData = {
      uid: userProfile.uid,
      email: userProfile.email,
      displayName: userProfile.displayName,
      photoURL: userProfile.photoURL || null,
      provider: provider,
      providerData: {
        provider: provider,
        uid: userProfile.uid
      },
      emailVerified: decodedToken.email_verified || false,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
      loginCount: admin.firestore.FieldValue.increment(1)
    };

    if (!userExists) {
      // New user - create document
      await admin.firestore().collection('users').doc(uid).set({
        ...userData,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        onboardingCompleted: false,
        subscription: {
          status: 'trial',
          plan: 'free',
          trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days trial
        },
        preferences: {
          notifications: {
            email: true,
            push: true,
            sms: false
          },
          language: 'pt-BR',
          timezone: 'America/Sao_Paulo'
        },
        gamification: {
          level: 1,
          xp: 0,
          streak: 0,
          badges: ['social_signup'],
          achievements: ['first_login']
        },
        profile: {
          completed: false,
          phone: null,
          birthDate: null,
          profession: null,
          howDidYouFindUs: null
        }
      });

      // Track new user signup
      if (typeof process.env.NEXT_PUBLIC_ANALYTICS_ID !== 'undefined') {
        // Here you would typically send analytics data
        console.log('New social signup tracked', { provider, uid });
      }
    } else {
      // Existing user - update document
      await admin.firestore().collection('users').doc(uid).update(userData);
    }

    // Create session cookie
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });

    const response = NextResponse.json({
      success: true,
      needsOnboarding: !userExists,
      user: {
        uid: userProfile.uid,
        email: userProfile.email,
        displayName: userProfile.displayName,
        photoURL: userProfile.photoURL,
        isNewUser: !userExists
      }
    });

    // Set secure cookie
    response.cookies.set({
      name: 'session',
      value: sessionCookie,
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });

    // Log login activity for security
    await admin.firestore().collection('auth_logs').add({
      uid: uid,
      provider: provider,
      action: 'social_login',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
    });

    return response;

  } catch (error: any) {
    console.error('Social login error:', error);

    return NextResponse.json(
      { error: 'Falha na autenticação social', details: error.message },
      { status: 401 }
    );
  }
}