import Form from "@/components/verify-email/Form";
import Verified from "@/components/email-verify/Verified";
import { use } from 'react'

function Page({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const tokenParams = use(searchParams)
    const hasToken = tokenParams.token !== undefined;

    return (
        <>
            {hasToken ? <Verified token={tokenParams.token as string} /> : <Form />}
        </>
    );
}

export default Page;