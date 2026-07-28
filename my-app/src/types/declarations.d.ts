declare module '@/assets/Data/governorates' {
  interface Governorate { id: number; name: string }
  export const governorates: Governorate[];
}

declare module '@/assets/Data/regions' {
  interface Region { id: number; regionName: string; governorateId: number }
  export const regions: Region[];
}

declare module '@/assets/Data/countries' {
  interface Country { id: number; name: string }
  export const countries: Country[];
}

declare module '@/assets/Data/colors' {
  interface Color { id: number; name: string }
  export const colors: Color[];
}

declare module '@/components/ui/button' {
  import type { ButtonHTMLAttributes, ReactNode } from 'react';
  const Button: React.ForwardRefExoticComponent<
    ButtonHTMLAttributes<HTMLButtonElement> & {
      variant?: string;
      size?: string;
      asChild?: boolean;
      children?: ReactNode;
    }
  >;
  export { Button };
}

declare module '@/components/ui/card' {
  import type { HTMLAttributes, ReactNode } from 'react';
  const Card: React.ForwardRefExoticComponent<HTMLAttributes<HTMLDivElement> & { children?: ReactNode }>;
  const CardHeader: React.ForwardRefExoticComponent<HTMLAttributes<HTMLDivElement> & { children?: ReactNode }>;
  const CardTitle: React.ForwardRefExoticComponent<HTMLAttributes<HTMLHeadingElement> & { children?: ReactNode }>;
  const CardDescription: React.ForwardRefExoticComponent<HTMLAttributes<HTMLParagraphElement> & { children?: ReactNode }>;
  const CardContent: React.ForwardRefExoticComponent<HTMLAttributes<HTMLDivElement> & { children?: ReactNode }>;
  const CardFooter: React.ForwardRefExoticComponent<HTMLAttributes<HTMLDivElement> & { children?: ReactNode }>;
  export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
}

declare module '@/components/ui/input' {
  import type { InputHTMLAttributes } from 'react';
  const Input: React.ForwardRefExoticComponent<InputHTMLAttributes<HTMLInputElement>>;
  export { Input };
}

declare module '@/components/ui/label' {
  import type { LabelHTMLAttributes, ReactNode } from 'react';
  const Label: React.ForwardRefExoticComponent<LabelHTMLAttributes<HTMLLabelElement> & { children?: ReactNode }>;
  export { Label };
}

declare module '@/components/ui/textarea' {
  import type { TextareaHTMLAttributes } from 'react';
  const Textarea: React.ForwardRefExoticComponent<TextareaHTMLAttributes<HTMLTextAreaElement>>;
  export { Textarea };
}

declare module '@/components/ui/dialog' {
  import type { ReactNode, HTMLAttributes, ButtonHTMLAttributes } from 'react';
  const Dialog: React.ForwardRefExoticComponent<{ open?: boolean; onOpenChange?: (open: boolean) => void; children?: ReactNode }>;
  const DialogContent: React.ForwardRefExoticComponent<HTMLAttributes<HTMLDivElement> & { children?: ReactNode }>;
  const DialogHeader: React.ForwardRefExoticComponent<HTMLAttributes<HTMLDivElement> & { children?: ReactNode }>;
  const DialogTitle: React.ForwardRefExoticComponent<HTMLAttributes<HTMLHeadingElement> & { children?: ReactNode }>;
  const DialogClose: React.ForwardRefExoticComponent<ButtonHTMLAttributes<HTMLButtonElement> & { children?: ReactNode }>;
  const DialogPortal: React.ForwardRefExoticComponent<{ children?: ReactNode }>;
  const DialogOverlay: React.ForwardRefExoticComponent<HTMLAttributes<HTMLDivElement>>;
  const DialogTrigger: React.ForwardRefExoticComponent<{ children?: ReactNode }>;
  const DialogDescription: React.ForwardRefExoticComponent<HTMLAttributes<HTMLParagraphElement> & { children?: ReactNode }>;
  const DialogFooter: React.ForwardRefExoticComponent<HTMLAttributes<HTMLDivElement> & { children?: ReactNode }>;
  export {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose,
    DialogPortal, DialogOverlay, DialogTrigger, DialogDescription, DialogFooter
  };
}

declare module '@/components/ui/separator' {
  import type { HTMLAttributes } from 'react';
  const Separator: React.ForwardRefExoticComponent<HTMLAttributes<HTMLDivElement> & { orientation?: 'horizontal' | 'vertical'; decorative?: boolean }>;
  export { Separator };
}

declare module '@/components/ui/switch' {
  import type { ButtonHTMLAttributes } from 'react';
  const Switch: React.ForwardRefExoticComponent<ButtonHTMLAttributes<HTMLButtonElement> & { checked?: boolean; onCheckedChange?: (checked: boolean) => void }>;
  export { Switch };
}

declare module '@/components/ui/toast' {
  import type { ReactNode } from 'react';
  interface ToastProps {
    open: boolean;
    type: string;
    message: string;
    handleCloseCallBack?: () => void;
  }
  const Toast: React.FC<ToastProps>;
  export default Toast;
}

declare module '@/components/ui/Avatar' {
  import type { HTMLAttributes, ReactNode } from 'react';
  const Avatar: React.ForwardRefExoticComponent<HTMLAttributes<HTMLDivElement> & { children?: ReactNode }>;
  const AvatarImage: React.ForwardRefExoticComponent<HTMLAttributes<HTMLImageElement> & { src?: string; alt?: string }>;
  const AvatarFallback: React.ForwardRefExoticComponent<HTMLAttributes<HTMLDivElement> & { children?: ReactNode }>;
  export { Avatar, AvatarImage, AvatarFallback };
}
