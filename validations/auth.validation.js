import vine from '@vinejs/vine'

export const registerSchema = vine.object({
  name: vine.string().minLength(3).maxLength(255),
  email: vine.string().email(),
  password: vine.string().minLength(8).maxLength(32).confirmed(),
});
