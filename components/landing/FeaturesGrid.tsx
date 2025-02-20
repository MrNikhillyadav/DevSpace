import React from 'react';
import { FeatureCard } from './FeatureCard';
import { Code, Terminal, Users } from 'lucide-react';

export  const FeaturesGrid = () => (
    <div className="container mx-auto px-4 pb-24 grid grid-cols-1 md:grid-cols-3 gap-6">
      <FeatureCard 
        icon={Terminal}
        title="Technical Writing"
        description="Share in-depth technical tutorials and coding experiences"
        stats="2.5k+ Technical Articles"
      />
      <FeatureCard 
        icon={Code}
        title="Code Snippets"
        description="Interactive code snippets with syntax highlighting"
        stats="50k+ Code Examples"
      />
      <FeatureCard 
        icon={Users}
        title="Developer Community"
        description="Connect with fellow developers and get feedback"
        stats="100k+ Active Writers"
      />
    </div>
  );