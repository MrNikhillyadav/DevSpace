'use server'

import prisma from '@/lib/db'
import { compare, hash } from "bcrypt"
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'

type ProfileUpdateInput = {
  name: string;
  email: string;
  currentPassword: string ;
  newPassword?: string;
}

export const updateProfile = async (values: ProfileUpdateInput) => {
  const { name, email, currentPassword, newPassword } = values

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    
  })

  if (!user) {
    return { error: 'User not found' }
  }

  //@ts-ignore
  const isCurrentPasswordValid = await compare(currentPassword, user.password)
  
  if (!isCurrentPasswordValid) {
    return { error: 'Current password is incorrect' }
  }

  const updatedData: Prisma.UserUpdateInput = {
    name,
    email,
    ...(newPassword && { password: await hash(newPassword, 10) }),
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: updatedData,
  })

  revalidatePath('/profile')
  return { message: 'Profile updated successfully' }
}
