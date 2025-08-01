import Stripe from "stripe";
import {createClient} from "@supabase/supabase-js";

import {Database} from "@/types_db";
import { Price, Product } from "@/types";

import {stripe} from "./stripe";
import { toDateTime } from "./helpers";

export const supabaseAdmin = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY ?? ""
);

const upsertProductRecord = async (product: Stripe.Product) => {
    const ProductData: Product = {
        id: product.id,
        active: product.active ?? false,
        name: product.name ?? null,
        description: product.description ?? undefined,
        images: product.images?.[0] ?? null,
        metadata: product.metadata ?? {}
    };

    const { error } = await supabaseAdmin.from("products").upsert([ProductData])

    if (error) {
        throw error;
    }

    console.log("Product upserted:", ProductData.id);
};

const upsertPriceRecord = async (price: Stripe.Price) => {
    const PriceData: Price = {
        id: price.id,
        product_id: typeof price.product === 'string' ? price.product : '',
        active: price.active,
        description: price.nickname ?? undefined,
        unit_amount: price.unit_amount ?? undefined,
        currency: price.currency,
        type: price.type ?? undefined,
        interval: price.recurring?.interval ?? undefined,
        interval_count: price.recurring?.interval_count ?? undefined,
        trial_period_days: price.recurring?.trial_period_days ?? null,
        metadata: price.metadata ?? {},
    };
    

    const { error } = await supabaseAdmin.from("prices").upsert([PriceData]);

    if (error) {
        throw error;
    }

    console.log("Price upserted:", PriceData.id);
}

const createOrRetrieveCustomer = async ({
    uuid,
    email
}: {
    uuid: string;
    email: string;
}) => {
    const { data, error } = await supabaseAdmin
        .from("customers")
        .select("stripe_customer_id")
        .eq("id", uuid)
        .single();
    
    let customerData: { metadata: { supabase_uuid: string }; email?: string } | undefined;

    if (error || !data?.stripe_customer_id) {
        customerData = {
            metadata: { supabase_uuid: uuid }
        };
        if (email) {
            customerData.email = email;
        }
        const customer = await stripe.customers.create(customerData);
        const { error: supabaseError } = await supabaseAdmin
            .from("customers")
            .insert([{ id: uuid, stripe_customer_id: customer.id }]);

        if (supabaseError) {
            throw supabaseError;
        }

        console.log("Customer created:", customer.id);
        return customer.id;
    }

    return data.stripe_customer_id;
};

const copyBillingDetailsToCustomer = async (
    uuid: string,
    payment_method: Stripe.PaymentMethod) => {
        const customer = payment_method.customer as string;
        const { name, phone, address } = payment_method.billing_details;

        if (!name || !address || !phone) return;

        // @ts-ignore
        await stripe.customers.update(customer, { name, phone, address });
        const { error } = await supabaseAdmin
            .from("users")
            .update({
                billing_address: {...address},
                payment_method: {...payment_method[payment_method.type]}
            })
            .eq("id", uuid);
        
        if (error) {
            throw error;
        }
    };

    const manageSubscriptionStatusChange = async (
        subsscriptionId: string,
        customerId: string,
        createAction = false
    ) => {
        const { data: customerData, error: noCustomerError } = await supabaseAdmin
            .from("customers")
            .select("id")
            .eq("stripe_customer_id", customerId)
            .single();
        
        if (noCustomerError){
            throw noCustomerError;
        }

        const {id: uuid} = customerData!;

        const subscription = await stripe.subscriptions.retrieve(subsscriptionId, {
            expand: ["default_payment_method", "latest_invoice"]
        }) as Stripe.Subscription;

        const subscriptionData : Database["public"]["Tables"]["subscriptions"]["Insert"] = {
            id: subscription.id,
            user_id: uuid,
            price_id: subscription.items.data[0].price.id,
            //@ts-ignore
            status: subscription.status,
            cancel_at: subscription.cancel_at ? toDateTime(subscription.cancel_at).toISOString() : null,
            cancel_at_period_end: subscription.cancel_at_period_end,
            canceled_at: subscription.canceled_at ? toDateTime(subscription.canceled_at).toISOString() : null,
            created: toDateTime(subscription.created).toISOString(),
            current_period_start: toDateTime(subscription.items.data[0].current_period_start).toISOString(),
            current_period_end: toDateTime(subscription.items.data[0].current_period_end).toISOString(),
            ended_at: subscription.ended_at ? toDateTime(subscription.ended_at).toISOString() : null,
            trial_start: subscription.trial_start ? toDateTime(subscription.trial_start).toISOString() : null,
            trial_end: subscription.trial_end ? toDateTime(subscription.trial_end).toISOString() : null,
            //@ts-ignore
            quantity: subscription.quantity,
            metadata: subscription.metadata
        };

        const { error } = await supabaseAdmin
            .from("subscriptions")
            .upsert([subscriptionData]);

        if (error) {
            throw error;
        }
        console.log(`Subscription upserted: [${subscription.id}] for user ${uuid}`);

        if (createAction && subscription.default_payment_method) {
            await copyBillingDetailsToCustomer(uuid, subscription.default_payment_method as Stripe.PaymentMethod);
        }
    };

export {
    upsertProductRecord,
    upsertPriceRecord,
    createOrRetrieveCustomer,
    manageSubscriptionStatusChange
};