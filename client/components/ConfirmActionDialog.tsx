'use client'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"


export function ConfirmActionDialog({ state, text, action }) {


    return (
        <Dialog open={state.open} onOpenChange={state.action}>
            <DialogTrigger render={<Button variant="outline">Open Dialog</Button>} />
            <DialogContent className="sm:max-w-sm border-primary-600 sand-500">
                <DialogHeader>
                    <DialogTitle>{text.header}</DialogTitle>
                    <DialogDescription>
                        {text.description}
                        <span className="font-semibold text-center mt-3 block">Are you sure?</span>
                    </DialogDescription>
                </DialogHeader>


                {/* <DialogClose render={<Button variant="outline">Cancel</Button>} /> */}
                <div className="flex gap-4 justify-center! items-center">
                    <button
                        onClick={() => action()}
                        className="px-3 py-1.5 border-2 border-primary-300 rounded text-xs cursor-pointer">Yes</button>
                    <button
                        onClick={() => state.action(false)}
                        className="px-3 py-1.5 border-2 border-primary-300 rounded text-xs cursor-pointer">No</button> </div>
            </DialogContent>
        </Dialog>
    )
}
