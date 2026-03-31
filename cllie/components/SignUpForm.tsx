"use client"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
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
import { signUp } from "@/lib/actions/auth"
import { ActionState } from "@/lib/types/types"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"



const prevState: ActionState = { success: false, error: null, fieldErrors: null }

export function SignUpForm({ ...props }: React.ComponentProps<typeof Card>) {

    const [state, formAction, isLoading] = useActionState(signUp, prevState)

    useEffect(() => {
        if (state.success) {
            toast.success("User Account created!")
        } else if (!state.success && !state.fieldErrors) {
            toast.error(state.error)
        }
    }, [state])
    return (
        <Card {...props}>
            <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>
                    Enter your information below to create your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form action={formAction}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="name">Full Name</FieldLabel>
                            <Input name="name" type="text" placeholder="Full name" />
                            <p className="text-xs text-red-500 font-semiboldy">{state?.fieldErrors?.name}</p>
                        </Field>
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
                            <FieldLabel htmlFor="phone">Phone</FieldLabel>
                            <Input
                                type="text"
                                name="phone"
                                placeholder="Phone number"
                            />
                            <p className="text-xs text-red-500 font-semiboldy">{state?.fieldErrors?.phone}</p>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="password">Password</FieldLabel>
                            <Input name="password" type="text" />
                            <p className="text-xs text-red-500 font-semiboldy">{state?.fieldErrors?.password}</p>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="confirm-password">
                                Confirm Password
                            </FieldLabel>
                            <Input name="confirm-password" type="password" />
                            <p className="text-xs text-red-500 font-semiboldy">{state?.fieldErrors?.confirmPassword}</p>
                        </Field>

                        <div>
                            <div className="mb-2">Role</div>
                            <select name="role" className="w-full p-2 rounded border">
                                <option>Choose---</option>
                                <option value="tenant">Tenant</option>
                                <option value="manager">Manager</option>
                            </select>
                            <p className="text-xs text-red-500 font-semiboldy">{state?.fieldErrors?.role}</p>
                        </div>

                        <FieldGroup>
                            <Field>
                                <Button type="submit" className="bg-primary-600 text-white"> {isLoading ? <Loader2 className="animate-spin" /> : "Create Account"} </Button>
                                <Button variant="outline" type="button">
                                    Sign up with Google
                                </Button>
                                <FieldDescription className="px-6 text-center">
                                    Already have an account? <a href="signin">Sign in</a>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    )
}
