// components/NotificationCard.tsx
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface NotificationCardProps {
  avatarSrc: string | null;
  message: string;
  time: string;
}


const NotificationCard = ({ avatarSrc, message, time }: NotificationCardProps) => {
    const letters = ['M','P','Q','S','R','A','Z','J','C','B','D']

  return (
    <div className="flex items-start space-x-3 p-2 hover:bg-gray-100 cursor-pointer rounded transition">
      <Avatar>
        <AvatarImage src={avatarSrc || undefined} />
        <AvatarFallback>{avatarSrc ? '' :  `${letters[Math.floor(Math.random())]}`}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p className="text-xs">{message}</p>
        <span className="text-xs text-gray-400">{time}</span>
      </div>
    </div>
  );
};

export default NotificationCard;
