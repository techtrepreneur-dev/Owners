"use client"
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ActionState, createApplication } from "@/lib/actions/application";
import { useAppSelector } from "@/state/store";
import { Loader2 } from "lucide-react";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

const prevState: ActionState = { success: false, error: null, fieldErrors: null }

const ApplicationModal = ({ propertyId, open, closeModal }) => {

    const authUser = useAppSelector((state) => state.global.authUser);
    const [state, formAction, isPending] = useActionState(createApplication, prevState)

    useEffect(() => {
        if (state.success) {
            toast.success("Application submitted")
        } else if (!state.success && state.error !== null) {
            toast.error(state.error)
        }
    }, [state])



    return (
        <Dialog open={open} onOpenChange={() => closeModal(false)}>
            <DialogContent className="bg-white">
                <DialogHeader className="mb-4">
                    <DialogTitle>Submit Application for this Property</DialogTitle>
                </DialogHeader>

                <form action={formAction} className="space-y-5">

                    <input type="hidden" name="tenantId" value={authUser.id} />
                    <input type="hidden" name="propertyId" value={propertyId} />
                    <input type="hidden" name="status" value="Pending" />
                    <div>
                        <label className='text-sm font-semibold mb-2 block'>Name</label>
                        <Input type="text" name='name' className="border-0 shadow text-sm" placeholder="Enter your full name" />
                        {state.fieldErrors?.name && <p className="text-xs mt-2 md:max-w-[250px] font-semibold text-red-400">{state.fieldErrors.name}</p>}
                    </div>

                    <div>
                        <label className='text-sm font-semibold mb-2 block'>Email</label>
                        <Input type="email" name="email" className="border-0 shadow text-sm" placeholder="e.g email@gmail.com" />
                        {state.fieldErrors?.email && <p className="text-xs mt-2 md:max-w-[250px] font-semibold text-red-400">{state.fieldErrors.email}</p>}
                    </div>

                    <div>
                        <label className='text-sm font-semibold mb-2 block'>Phone number</label>
                        <Input type="text" name="phone" className="border-0 shadow text-sm" placeholder="e.g 09055.." />
                        {state.fieldErrors?.phoneNumber && <p className="text-xs mt-2 md:max-w-[250px] font-semibold text-red-400">{state.fieldErrors.phoneNumber}</p>}
                    </div>

                    <div className="mb-2">
                        <label className='text-sm font-semibold mb-2 block'>Message</label>
                        <Textarea placeholder="Additional information ?" className="border-0 shadow text-sm" name="message" />
                        {state.fieldErrors?.message && <p className="text-xs mt-2 md:max-w-[250px] font-semibold text-red-400">{state.fieldErrors.message}</p>}
                    </div>
                    <Button type="submit" className="bg-primary-700 text-white w-full">
                        {isPending ? <Loader2 className="animate-spin" /> : "Submit application"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ApplicationModal;