import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Users, Clock, Target } from "lucide-react";

export default function HeroStats() {
  const [animatedValues, setAnimatedValues] = useState({
    startups: 0,
    funding: 0,
    time: 0,
    success: 0
  });

  const finalValues = {
    startups: 2847,
    funding: 127.5,
    time: 89,
    success: 94
  };

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setAnimatedValues({
        startups: Math.floor(finalValues.startups * easeOut),
        funding: Math.floor(finalValues.funding * easeOut * 10) / 10,
        time: Math.floor(finalValues.time * easeOut),
        success: Math.floor(finalValues.success * easeOut)
      });

      if (step >= steps) {
        clearInterval(timer);
        setAnimatedValues(finalValues);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const stats = [
    {
      icon: Users,
      value: animatedValues.startups.toLocaleString(),
      label: "Startups Launched",
      suffix: "+",
      color: "text-blue-600"
    },
    {
      icon: TrendingUp,
      value: `$${animatedValues.funding}M`,
      label: "Funding Raised",
      suffix: "+",
      color: "text-emerald-600"
    },
    {
      icon: Clock,
      value: `${animatedValues.time}%`,
      label: "Faster Time to Market",
      suffix: "",
      color: "text-purple-600"
    },
    {
      icon: Target,
      value: `${animatedValues.success}%`,
      label: "Success Rate",
      suffix: "",
      color: "text-cyan-600"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-white/80 backdrop-blur-sm border-white/20 hover:bg-white/90 transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className={`w-12 h-12 ${stat.color.replace('text-', 'bg-').replace('-600', '-100')} rounded-full flex items-center justify-center mx-auto mb-3`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div className={`text-2xl font-bold ${stat.color} mb-1`}>
              {stat.value}{stat.suffix}
            </div>
            <div className="text-sm text-slate-600 font-medium">
              {stat.label}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}