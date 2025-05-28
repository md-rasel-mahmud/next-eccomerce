import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FC } from "react";

const AvatarGroup: FC<{
  data?: {
    name: string;
    image: string;
  }[];
}> = ({ data }) => {
  return (
    <div className="flex -space-x-4">
      {data?.map((user, index) => (
        <Avatar key={index} className="border-2 border-white dark:border-black">
          <AvatarImage
            className="object-cover object-top"
            src={user?.image}
            alt={user?.name}
          />
          <AvatarFallback>
            {user?.name?.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ))}

      {data && data.length > 3 && (
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium bg-muted text-muted-foreground border-2 border-white dark:border-black z-10">
          +{data.length - 3}
        </div>
      )}
    </div>
  );
};
export default AvatarGroup;
