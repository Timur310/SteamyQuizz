import { cn } from "@/lib/utils"

type Props = {
  imageUrl: string
  caption: string
  className?: string
  onClick?: () => void
}

export default function ImageCard({ imageUrl, caption, className, onClick }: Props) {
  return (
    <figure
      onClick={onClick}
      className={cn(
        "w-[250px] overflow-hidden rounded-base border-2 border-border bg-main font-base shadow-shadow",
        className,
      )}
    >
      <img className="w-full" src={imageUrl} alt="image" />
      <figcaption className="border-t-2 text-main-foreground border-border p-4">
        {caption}
      </figcaption>
    </figure>
  )
}
