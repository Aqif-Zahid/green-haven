import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "../lib/db";
import { Button } from "@/components/ui/button";
import { CreateStripeAccountLink } from "../actions";
import { Submitbutton } from "../components/SubmitButtons";

async function getData(sellerId: string) {
    const data = await prisma.user.findUnique({
        where: {
            id: sellerId,
        }, select: {
            stripeConnectedLinked: true,
        }
    });

    return data;
}


export default async function BillinRoute() {
    const{getUser} = getKindeServerSession()
    const user = await getUser();

    if(!user) {
        throw new Error("Unauthorized");
    }
    const data = await getData(user.id);
    return (
        <section className="max-w-7xl mx-auto px-4 md:px-8">
            <Card>
                <CardHeader>
                    <CardTitle>Billing</CardTitle>
                    <CardDescription>Find all your details regarding your payments</CardDescription>
                </CardHeader>
                <CardContent>
                    {data?.stripeConnectedLinked === false && (
                        <form action={CreateStripeAccountLink}>
                            <Submitbutton title="Link your Account to Stripe" />
                        </form>
                    )}
                </CardContent>
            </Card>
        </section>
    )
}