import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ??'', {
    apiVersion: '2025-06-30.basil',
    appInfo: {
        name: 'Spotify Clone',
        version: '1.0.0'
    }
    });