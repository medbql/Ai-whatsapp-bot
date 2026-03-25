import { Suspense } from "react";
import CallBackClient from "./callbackClient";


export default function CallbackPage() {
    return(
        <Suspense fallback={'loading'}>
            <CallBackClient />
        </Suspense>
    )
}