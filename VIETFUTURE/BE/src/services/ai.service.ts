import axios from "axios";

export const askAIService = async (
    message: string
) => {

    try {
        const response = await axios.post(

            "https://openrouter.ai/api/v1/chat/completions",

            {
                model:
                    "deepseek/deepseek-r1:free",

                messages: [

                    {
                        role: "system",

                        content: `
                        Bạn là AI tư vấn nghề nghiệp CNTT cho sinh viên Việt Nam.

                        Trả lời ngắn gọn dễ hiểu.
                        `
                    },

                    {
                        role: "user",
                        content: message
                    }
                ]
            },

            {
                headers: {

                    Authorization:
                        `Bearer ${process.env.OPENROUTER_API_KEY}`,

                    "Content-Type":
                        "application/json"
                }
            }
        );

        return response.data
            .choices[0]
            .message.content;

    } catch (error: any) {

        console.log(
            "OPENROUTER ERROR:",
            JSON.stringify(
                error.response?.data,
                null,
                2
            )
        );

        return "AI đang bận";
    }
};