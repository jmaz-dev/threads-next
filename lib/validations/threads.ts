import * as z from "zod";

const ThreadValidation = z.object({
 thread: z.string().nonempty({ message: "O campo não pode ficar vazio." }).min(3, { message: "Mínimo 3 caractéres." }),
 accountId: z.string(),
});

const CommentValidation = z.object({
 comment: z.string().nonempty().min(3, { message: "Mínimo 3 caractéres." }),
});

export default ThreadValidation;
