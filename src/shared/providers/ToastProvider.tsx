'use client'
import { Toaster } from "../componets/ui";

export function ToastProvider(){
    return <Toaster position="bottom-right"  duration={5000}/>
}