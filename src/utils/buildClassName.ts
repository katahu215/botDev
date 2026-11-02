export type ClassValue = string | undefined | null | false | 0;

export const buildClassName = (...classes: ClassValue[]): string => classes.filter(Boolean).join(" ");
