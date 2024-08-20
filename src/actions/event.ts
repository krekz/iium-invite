"use server"

type Input = {
    formData: FormData,
    userId: string
}

export const createPost = async (input: Input) => {

    const { formData, userId } = input;

    try {
        if (!userId) throw Error("You must be logged in to do that");

        //post logic here

    } catch (error) {
        console.log(error)
    }
}

export const deletePost = async () => {
    //delete actions
}