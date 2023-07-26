import getRawBody from "raw-body";
import { stripe } from "src/pricing/utils/stripe";
import { supabase } from "supabase";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  const signature = req.headers["stripe-signature"];
  const signatureSecret = process.env.STRIPE_SIGNING_SECRET;

  let event;
  try {
    const rawBody = await getRawBody(req, { limit: "2mb" });
    event = stripe.webhooks.constructEvent(rawBody, signature, signatureSecret);
  } catch (error) {
    console.log("webhook signature verification failed");
    return res.status(400).end();
  }

  try {
    switch (event.type) {
      case "customer.subscription.updated":
        console.log("running");
        await updateSubscription(event);
        break;
      case "customer.subscription.deleted":
        console.log("not running");
        await deleteSubscription(event);
        break;
    }

    // console.log(event);
    res.send({ success: true });
  } catch (error) {
    console.log(error.message);
    res.send({ success: false });
  }
}

async function updateSubscription(event) {
  const subscription = event.data.object;
  const stripe_customer_id = subscription.customer;
  const subscription_status = subscription.status;
  const price = subscription.items.data[0].price.id;

  const { data: profile } = await supabase
    .from("profile")
    .select("*")
    .eq("stripe_customer_id", stripe_customer_id)
    .single();

  if (profile) {
    const updatedSubscription = {
      subscription_status,
      price,
    };
    await supabase
      .from("profile")
      .update(updatedSubscription)
      .eq("stripe_customer_id", stripe_customer_id);
  } else {
    const customer = await stripe.customers.retrieve(stripe_customer_id);
    const name = customer.name;
    const email = customer.email;
    const newProfile = {
      name,
      email,
      stripe_customer_id,
      subscription_status,
      price,
    };
    console.log("running too", newProfile);
    await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: newProfile,
    });
    console.log("weird");
    // await supabase.from("profile").insert(newProfile).select();
  }
}

async function deleteSubscription(event) {
  const subscription = event.data.object;
  const stripe_customer_id = subscription.customer;
  const subscription_status = subscription.status;
  const deletedSubscription = {
    subscription_status,
    price: null,
  };

  await supabase
    .from("profile")
    .update(deletedSubscription)
    .eq("stripe_customer_id", stripe_customer_id);
}
