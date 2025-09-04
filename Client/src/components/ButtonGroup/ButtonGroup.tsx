import { cn } from '@/lib/utils'
import { type VariantProps, cva } from 'class-variance-authority'
import type * as React from 'react'

const buttonGroupVariants = cva('flex items-center *:rounded-none', {
    variants: {
        orientation: {
            horizontal: 'flex-row *:first:rounded-s-[15px] *:first:border-r-0 *:first:hover:border-r-2 *:last:rounded-e-[15px] *:last:border-l-0 *:last:hover:border-l-2',
            vertical: 'flex-col *:first:rounded-t-[15px] *:last:rounded-b-[15px]',
        },
    },
    defaultVariants: {
        orientation: 'horizontal',
    },
})

export const ButtonGroup = ({
    className,
    orientation,
    ...props
}: React.ComponentProps<'div'> & VariantProps<typeof buttonGroupVariants>) => {
    return <div className={cn(buttonGroupVariants({ orientation, className }))} {...props} />
}