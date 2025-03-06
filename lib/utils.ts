import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const generateHandle = (title: string): string => {
  const latinToEnglishMap: { [key: string]: string } = {
    à: 'a',
    á: 'a',
    â: 'a',
    ã: 'a',
    ä: 'a',
    å: 'a',
    è: 'e',
    é: 'e',
    ê: 'e',
    ë: 'e',
    ì: 'i',
    í: 'i',
    î: 'i',
    ï: 'i',
    ò: 'o',
    ó: 'o',
    ô: 'o',
    õ: 'o',
    ö: 'o',
    ù: 'u',
    ú: 'u',
    û: 'u',
    ü: 'u',
    ñ: 'n',
    ç: 'c',
    ß: 'ss',
    ÿ: 'y',
    œ: 'oe',
    æ: 'ae',
  };

  const normalizedTitle = title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  const handle = normalizedTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
   
    .replace(/[^\x00-\x7F]/g, (char) => latinToEnglishMap[char] || '');

  return handle;
};

