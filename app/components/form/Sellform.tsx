"use client";

import { SellProduct, type State } from "@/app/actions";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type JSONContent } from "@tiptap/react";
import { redirect } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { SelectCategory } from "../SelectCategory";
import { Textarea } from "@/components/ui/textarea";
import { TipTapEditor } from "../Editor";
import { UploadDropzone } from "@/app/lib/uploadthing";
import { Submitbutton } from "../SubmitButtons";





export function SellForm() {
    const initialState: State = { message: "", status: undefined};
    const [state, formAction] = useActionState(SellProduct, initialState);
    const [json, setJson] = useState<null | JSONContent >(null);
    const [images, setImages] = useState<null | string[]>(null);
    
    useEffect(() => {
        if(state.status === "success") {
            toast.success(state.message);
            redirect("/");
        }
        else if(state.status === "error") {
            toast.error(state.message);
        }
    }, [state]);

    return (
        <form action={formAction}>
                    <CardHeader>
                        <CardTitle>Sell your product with ease</CardTitle>
                        <CardDescription>Please describe your product here in detail so that it can be sold</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-y-10">
                        <div className="flex flex-col gap-y-2">
                            <Label>Name</Label>
                            <Input 
                            name="name" 
                            type="text" 
                            placeholder="Name of your Product"
                            required
                            minLength={5}
                            />
                            {state?.errors?.["name"]?.[0] && (
                                <p className="text-red-500">{state?.errors?.["name"]?.[0]}</p>
                            )}
                        </div>
                        <div className="flex flex-col gap-y-2">
                            <Label>Category</Label>
                            <SelectCategory />
                            {state?.errors?.["category"]?.[0] && (
                                <p className="text-red-500">{state?.errors?.["category"]?.[0]}</p>
                            )}
                        </div>
                        <div className="flex flex-col gap-y-2">
                            <Label>Price</Label>
                            <Input 
                            placeholder="0" 
                            type="number" 
                            name="price" 
                            required
                            min={1}
                            />
                            {state?.errors?.["price"]?.[0] && (
                                <p className="text-red-500">{state?.errors?.["price"]?.[0]}</p>
                            )}

                        </div>
                        <div className="flex flex-col gap-y-2">
                            <Label>Summary of the Product</Label>
                            <Textarea 
                            name="smallDescription" 
                            placeholder="Please describe your product shortly here" 
                            required
                            minLength={10}
                            />
                            {state?.errors?.["smallDescription"]?.[0] && (
                                <p className="text-red-500">{state?.errors?.["smallDescription"]?.[0]}</p>
                            )}
                        </div>

                        <div className= "flex flex-col gap-y-2">
                            <input 
                            type="hidden" 
                            name="description" 
                            value={JSON.stringify(json)} />
                            <Label>Description</Label>
                            <TipTapEditor json={json} setJson={setJson} />
                            {state?.errors?.["description"]?.[0] && (
                                <p className="text-red-500">{state?.errors?.["description"]?.[0]}</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-y-2">
                            <input 
                            type="hidden" 
                            name="images" 
                            value={JSON.stringify(images)} />
                            <Label>Product Images</Label>
                            <UploadDropzone endpoint="imageUploader" onClientUploadComplete={(res) => {
                                setImages(res.map((item) => item.url));
                                toast.success("Your images have been uploaded");
                            }} 
                            onUploadError={(error: Error) => {
                                toast.error("Something went wrong, please try again");
                            }}
                            />

                        </div>                        

                    </CardContent>
                    <CardFooter className="mt-5">
                        <Submitbutton title="Create your Product"/>
                    </CardFooter>
                </form>
    )
}