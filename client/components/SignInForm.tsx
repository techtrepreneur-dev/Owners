"use client"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useActionState, useEffect } from "react"
import { signIn } from "@/lib/actions/auth"
import { ActionState } from "@/lib/types/types"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"


const prevState: ActionState = { success: false, error: null, fieldErrors: null }

export default function SignInForm() {

    const [state, formAction, isLoading] = useActionState(signIn, prevState)
    const router = useRouter()

    useEffect(() => {
        if (state.success) {
            toast.success("Login successfull!")

            router.replace("/landing")
        } else if (!state.success && !state.fieldErrors) {
            toast.error(state.error)
        }
    }, [state, router])

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Sign in</CardTitle>
            </CardHeader>
            <CardContent>
                <form action={formAction}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input
                                type="email"
                                name="email"
                                placeholder="example@gmail.com"
                            />
                            <p className="text-xs text-red-500 font-semiboldy">{state?.fieldErrors?.email}</p>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="password">Password</FieldLabel>
                            <Input name="password" type="text" />
                            <p className="text-xs text-red-500 font-semiboldy">{state?.fieldErrors?.password}</p>
                        </Field>

                        <FieldGroup>
                            <Field>
                                <Button type="submit" className="bg-primary-600 text-white"> {isLoading ? <Loader2 className="animate-spin" /> : "Sign in"} </Button>
                                <Button variant="outline" type="button">
                                    Sign in with Google
                                </Button>
                                <FieldDescription className="px-6 text-center">
                                    Don't have an account? <a href="/signup">Sign up</a>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    )
}
