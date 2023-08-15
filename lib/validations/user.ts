import * as z from "zod";

import React from "react";

const UserValidation = z.object({
 profile_photo: z.string().url().nonempty(),
 name: z.string().min(3, { message: "Mínimo 3 caractéres" }).max(30, { message: "Máximo 30 caractéres" }),
 username: z.string().min(3, { message: "Mínimo 3 caractéres" }).max(30, { message: "Máximo 30 caractéres" }),
 bio: z.string().min(3, { message: "Mínimo 3 caractéres" }).max(1000, { message: "Máximo 1000 caractéres" }),
});

export default UserValidation;
