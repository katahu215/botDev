export type ClassValue = string | undefined | null | false | 0 | boolean;

export const buildClassName = (...classes: ClassValue[]): string => classes.filter(Boolean).join(" ");
