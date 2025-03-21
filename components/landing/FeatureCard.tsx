import { Card } from '@/components/ui/card';
import { IconType } from 'react-icons';

interface FeatureCardProps {
  icon: IconType;
  title: string;
  description: string;
  stats: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, stats }) => (
  <Card className="bg-zinc-800/50 border-zinc-700 p-4 md:p-6">
    <div className="flex flex-col md:flex-row items-start md:gap-4">
      <div className="p-2 bg-primary/20 rounded-lg">
        <Icon className=" md:w-6 md:h-6 text-indigo-400" />
      </div>
      <div>
        <h3 className="text-white text-lg font-semibold mb-2">{title}</h3>
        <p className="text-zinc-400 mb-4">{description}</p>
        <div className="text-zinc-300 font-medium">{stats}</div>
      </div>
    </div>
  </Card>
);
