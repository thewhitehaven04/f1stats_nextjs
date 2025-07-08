"use server"

import { redirect } from "next/navigation"

export const action = async (formData: FormData) => {
    redirect(formData.get("year") as string)
}