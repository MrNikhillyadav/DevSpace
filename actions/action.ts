'use server'

import prisma from '@/lib/db' 
import { compare, hash } from "bcrypt";

export const updateProfile = async (values) => {
  const { name, email, currentPassword, newPassword } = values;

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    return { error: 'User not found' };
  }

  const isCurrentPasswordValid = await compare(currentPassword, user.password);
  
  if (!isCurrentPasswordValid) {
    return { error: 'Current password is incorrect' };
  }

  const updatedData = {
    name,
    email,
    ...(newPassword && { password: await hash(newPassword, 10) }), 
  };

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: updatedData,
  });

  return { message: 'Profile updated successfully' };
};
