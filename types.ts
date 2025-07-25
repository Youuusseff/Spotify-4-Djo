import Stripe from "stripe";

export interface Song {
    id: string;
    user_id: string;
    title: string;
    author: string;
    is_public: boolean;
    image_path: string;
    song_path: string;
}

export interface PublicUserDetails {
    id: string;
    full_name?: string;
    pseudo?: string;
    bio?: string;
    avatar_url?: string;
}

export interface UserDetails {
    id: string;
    first_name: string;
    last_name: string;
    full_name?: string;
    pseudo?: string;
    bio?: string;
    avatar_url?: string;
    billing_address?: Stripe.Address;
    payment_method?: Stripe.PaymentMethod[Stripe.PaymentMethod.Type];
}


export interface Product {
    id: string;
    active?: boolean;
    name?: string;
    description?: string;
    images?: string | null;
    metadata?: Stripe.Metadata;
}

export interface Price {
    id: string;
    product_id?: string;
    active?: boolean;
    description?: string;
    unit_amount?: number;
    currency?: string;
    type?: Stripe.Price.Type;
    interval?: Stripe.Price.Recurring.Interval;
    interval_count?: number;
    trial_period_days?: number | null;
    metadata?: Stripe.Metadata;
    product?: Product;
}

export interface ProductWithPrice extends Product {
    prices?: Price[];
}


export interface Subscription {
    id: string;
    user_id: string;
    status?: Stripe.Subscription.Status;
    metadata?: Stripe.Metadata;
    price_id?: string;
    quantity?: number;
    cancel_at_period_end?: boolean;
    created: string;
    current_period_start: string;
    current_period_end: string;
    ended_at?: string;
    cancel_at?: string;
    canceled_at?: string;
    trial_start?: string;
    trial_end?: string;
    prices?: Price;
}