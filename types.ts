import Stripe from "stripe";

export interface Song {
    id: string;
    user_id: string;
    title: string;
    author: string;
    is_public: boolean;
    image_path: string;
    song_path: string;
    created_at: string;
}
export interface Notification {
  id: string
  recipient_id: string
  actor_id: string
  type: 'song_comment' | 'comment_reply' | 'song_like' | 'comment_vote'
  entity_type: 'song' | 'comment'
  entity_id: number // number to match your schema
  parent_entity_id?: number
  vote_value?: number // 1 for upvote, -1 for downvote
  message: string
  read: boolean
  created_at: string
  updated_at: string
  actor: {
    id: string
    pseudo: string | null
    avatar_url: string | null
    bio: string | null
  }
  song?: {
    id: number
    title: string | null
    user_id: string | null
  }
  comment?: {
    id: number
    content: string | null
    user_id: string | null
  }
}

export interface NotificationStats {
  [key: string]: {
    total: number
    unread: number
  }
}

export interface PublicUserDetails {
    id: string;
    full_name?: string;
    pseudo?: string;
    bio?: string;
    avatar_url?: string;
    followers?: number;
    following?: number;
}

export interface Comment {
    id: string;
    user_id: string;
    song_id: string;
    parent_id?: string | null;
    content: string;
    created_at: string;
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