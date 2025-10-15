import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Index() {
  const { toast } = useToast();
  const [stats, setStats] = useState({
    happiness: 75,
    energy: 60,
    hunger: 40,
    level: 5
  });
  const [coins, setCoins] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showWardrobe, setShowWardrobe] = useState(false);
  const [currentOutfit, setCurrentOutfit] = useState(0);
  const [animationEffect, setAnimationEffect] = useState<string | null>(null);

  const outfits = [
    {
      id: 0,
      name: "Оригинальный облик",
      image: "https://cdn.poehali.dev/files/44cafd08-2350-4055-96a2-31af2762a139.png",
      cost: 0
    },
    {
      id: 1,
      name: "Классический наряд",
      image: "https://cdn.poehali.dev/projects/afdc2bb2-bccd-4e69-909f-fb181d7ea94c/files/1483b987-73b9-4cb2-a471-1f1e02e651b1.jpg",
      cost: 0
    },
    {
      id: 2,
      name: "Королевский костюм",
      image: "https://cdn.poehali.dev/projects/afdc2bb2-bccd-4e69-909f-fb181d7ea94c/files/f0d89dcd-4617-4e9e-96d9-c184d8cea2aa.jpg",
      cost: 50
    },
    {
      id: 3,
      name: "Современный стиль",
      image: "https://cdn.poehali.dev/projects/afdc2bb2-bccd-4e69-909f-fb181d7ea94c/files/8e03f8c0-3b3a-42bc-9257-a9dde9366659.jpg",
      cost: 30
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        hunger: Math.max(0, prev.hunger - 1),
        energy: Math.max(0, prev.energy - 0.5),
        happiness: Math.max(0, prev.happiness - 0.3)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const showEffect = (effect: string) => {
    setAnimationEffect(effect);
    setTimeout(() => setAnimationEffect(null), 1500);
  };

  const feedCookie = () => {
    if (coins >= 10) {
      setCoins(prev => prev - 10);
      setStats(prev => ({
        ...prev,
        hunger: Math.min(100, prev.hunger + 25),
        happiness: Math.min(100, prev.happiness + 5)
      }));
      toast({
        title: "Ням-ням! 🍰",
        description: "Affogato Cookie доволен вкусным угощением!",
      });
    } else {
      toast({
        title: "Недостаточно монет! 💰",
        description: "Нужно 10 монет для покупки еды",
        variant: "destructive"
      });
    }
  };

  const playCookie = () => {
    if (stats.energy < 20) {
      toast({
        title: "Слишком устал 😴",
        description: "Affogato Cookie нужен отдых!",
        variant: "destructive"
      });
      return;
    }

    setIsPlaying(true);
    setStats(prev => ({
      ...prev,
      energy: Math.max(0, prev.energy - 20),
      happiness: Math.min(100, prev.happiness + 15)
    }));
    setCoins(prev => prev + 15);

    toast({
      title: "Ура! Игра началась! 🎮",
      description: "+15 монет за весёлую игру!",
    });

    setTimeout(() => setIsPlaying(false), 2000);
  };

  const restCookie = () => {
    setStats(prev => ({
      ...prev,
      energy: Math.min(100, prev.energy + 30),
      happiness: Math.min(100, prev.happiness + 10)
    }));
    toast({
      title: "Отдых полезен! 😌",
      description: "Affogato Cookie восстановил энергию",
    });
  };

  const petCookie = () => {
    showEffect("pet");
    setStats(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 20)
    }));
    toast({
      title: "Мурр~ 💕",
      description: "Affogato Cookie обожает, когда его гладят!",
    });
  };

  const hitCookie = () => {
    showEffect("hit");
    setStats(prev => ({
      ...prev,
      happiness: Math.max(0, prev.happiness - 30),
      energy: Math.max(0, prev.energy - 10)
    }));
    toast({
      title: "Ой! 😢",
      description: "Affogato Cookie очень расстроен...",
      variant: "destructive"
    });
  };

  const changeOutfit = (outfitId: number) => {
    const outfit = outfits.find(o => o.id === outfitId);
    if (!outfit) return;

    if (outfit.cost > 0 && coins < outfit.cost) {
      toast({
        title: "Недостаточно монет! 💰",
        description: `Нужно ${outfit.cost} монет для покупки`,
        variant: "destructive"
      });
      return;
    }

    if (outfit.cost > 0 && currentOutfit !== outfitId) {
      setCoins(prev => prev - outfit.cost);
    }

    setCurrentOutfit(outfitId);
    setShowWardrobe(false);
    setStats(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 10)
    }));
    
    toast({
      title: "Модно! ✨",
      description: `Affogato Cookie надел ${outfit.name}!`,
    });
  };

  const getMoodEmoji = () => {
    if (stats.happiness > 70) return "😊";
    if (stats.happiness > 40) return "😐";
    return "😢";
  };

  const getStatusColor = (value: number) => {
    if (value > 60) return "bg-green-500";
    if (value > 30) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-yellow-50 to-purple-100">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b-4 border-primary shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl md:text-4xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            🍪 Affogato Cookie
          </h1>
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-secondary to-primary px-4 py-2 rounded-full border-4 border-foreground/20 shadow-lg">
              <span className="font-black text-foreground text-xl">💰 {coins}</span>
            </div>
            <div className="bg-gradient-to-r from-primary to-accent px-4 py-2 rounded-full border-4 border-foreground/20 shadow-lg">
              <span className="font-black text-foreground text-xl">⭐ Ур. {stats.level}</span>
            </div>
          </div>
        </div>
      </div>

      <section className="pt-32 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <Card className="p-8 border-4 border-primary/30 shadow-2xl bg-gradient-to-br from-white to-primary/5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 animate-pulse"></div>
              <div className="relative">
                <div className="text-center mb-6">
                  <div className="inline-block bg-gradient-to-r from-primary to-secondary px-6 py-2 rounded-full border-4 border-foreground/20 shadow-lg mb-4">
                    <span className="font-bold text-foreground text-2xl">{getMoodEmoji()} Настроение</span>
                  </div>
                </div>

                <div className={`relative mx-auto w-full max-w-md aspect-square rounded-3xl overflow-hidden border-8 border-white shadow-2xl ${isPlaying ? 'animate-bounce-slow' : 'animate-float'}`}>
                  <img
                    src={outfits[currentOutfit].image}
                    alt="Affogato Cookie"
                    className="w-full h-full object-cover"
                  />
                  {isPlaying && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30 flex items-center justify-center">
                      <span className="text-6xl animate-bounce">🎮</span>
                    </div>
                  )}
                  {animationEffect === 'pet' && (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center animate-fade-in">
                      <span className="text-8xl animate-bounce">💕</span>
                    </div>
                  )}
                  {animationEffect === 'hit' && (
                    <div className="absolute inset-0 bg-red-500/30 flex items-center justify-center animate-fade-in">
                      <span className="text-8xl animate-bounce">💢</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 text-center">
                  <h2 className="text-3xl font-black mb-2">Affogato Cookie</h2>
                  <p className="text-foreground/70 font-medium">{outfits[currentOutfit].name}</p>
                </div>
              </div>
            </Card>

            <div className="space-y-6">
              <Card className="p-6 border-4 border-primary/30 shadow-xl bg-white">
                <h3 className="text-2xl font-black mb-4 flex items-center gap-2">
                  <Icon name="Heart" className="text-primary" />
                  Характеристики
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-foreground flex items-center gap-2">
                        😊 Счастье
                      </span>
                      <span className="font-black text-primary">{Math.round(stats.happiness)}%</span>
                    </div>
                    <Progress value={stats.happiness} className={`h-3 ${getStatusColor(stats.happiness)}`} />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-foreground flex items-center gap-2">
                        ⚡ Энергия
                      </span>
                      <span className="font-black text-secondary">{Math.round(stats.energy)}%</span>
                    </div>
                    <Progress value={stats.energy} className={`h-3 ${getStatusColor(stats.energy)}`} />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-foreground flex items-center gap-2">
                        🍰 Сытость
                      </span>
                      <span className="font-black text-accent">{Math.round(stats.hunger)}%</span>
                    </div>
                    <Progress value={stats.hunger} className={`h-3 ${getStatusColor(stats.hunger)}`} />
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-4 border-secondary/30 shadow-xl bg-gradient-to-br from-white to-secondary/5">
                <h3 className="text-2xl font-black mb-4 flex items-center gap-2">
                  <Icon name="Sparkles" className="text-secondary" />
                  Действия
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={feedCookie}
                    className="bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-all font-bold text-base py-6 rounded-xl border-4 border-foreground/20 shadow-lg text-foreground"
                  >
                    <Icon name="Cake" size={20} />
                    Покормить
                  </Button>

                  <Button
                    onClick={playCookie}
                    disabled={stats.energy < 20}
                    className="bg-gradient-to-r from-secondary to-accent hover:scale-105 transition-all font-bold text-base py-6 rounded-xl border-4 border-foreground/20 shadow-lg text-foreground disabled:opacity-50"
                  >
                    <Icon name="Gamepad2" size={20} />
                    Играть
                  </Button>

                  <Button
                    onClick={restCookie}
                    className="bg-gradient-to-r from-accent to-primary hover:scale-105 transition-all font-bold text-base py-6 rounded-xl border-4 border-foreground/20 shadow-lg text-white"
                  >
                    <Icon name="Moon" size={20} />
                    Отдохнуть
                  </Button>

                  <Button
                    onClick={petCookie}
                    className="bg-gradient-to-r from-pink-400 to-pink-600 hover:scale-105 transition-all font-bold text-base py-6 rounded-xl border-4 border-foreground/20 shadow-lg text-white"
                  >
                    <Icon name="Heart" size={20} />
                    Погладить
                  </Button>

                  <Button
                    onClick={hitCookie}
                    className="bg-gradient-to-r from-red-500 to-red-700 hover:scale-105 transition-all font-bold text-base py-6 rounded-xl border-4 border-foreground/20 shadow-lg text-white"
                  >
                    <Icon name="Zap" size={20} />
                    Ударить
                  </Button>

                  <Button
                    onClick={() => setShowWardrobe(true)}
                    className="bg-gradient-to-r from-purple-500 to-purple-700 hover:scale-105 transition-all font-bold text-base py-6 rounded-xl border-4 border-foreground/20 shadow-lg text-white"
                  >
                    <Icon name="Shirt" size={20} />
                    Гардероб
                  </Button>
                </div>
              </Card>

              <Card className="p-6 border-4 border-accent/30 shadow-xl bg-gradient-to-br from-accent/5 to-white">
                <h3 className="text-xl font-black mb-3 flex items-center gap-2">
                  <Icon name="Info" className="text-accent" />
                  Советы по уходу
                </h3>
                <ul className="space-y-2 text-sm font-medium text-foreground/80">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Гладьте печеньку для повышения счастья</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary">•</span>
                    <span>Играйте, чтобы зарабатывать монеты</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>Не бейте печеньку - это очень плохо!</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500">•</span>
                    <span>Покупайте новые наряды в гардеробе</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Dialog open={showWardrobe} onOpenChange={setShowWardrobe}>
        <DialogContent className="max-w-4xl border-4 border-primary/30">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              👔 Гардероб Affogato Cookie
            </DialogTitle>
            <DialogDescription className="text-center text-foreground/70 font-medium">
              Выбери стильный наряд для своей печеньки!
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid md:grid-cols-3 gap-4 p-4">
            {outfits.map((outfit) => (
              <Card
                key={outfit.id}
                className={`cursor-pointer transition-all hover:scale-105 border-4 ${
                  currentOutfit === outfit.id ? 'border-primary shadow-2xl' : 'border-primary/20'
                }`}
                onClick={() => changeOutfit(outfit.id)}
              >
                <div className="aspect-square overflow-hidden rounded-t-xl">
                  <img
                    src={outfit.image}
                    alt={outfit.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 text-center">
                  <h4 className="font-black text-lg mb-2">{outfit.name}</h4>
                  {outfit.cost > 0 ? (
                    <div className="bg-gradient-to-r from-secondary to-primary px-4 py-2 rounded-full inline-block border-2 border-foreground/20">
                      <span className="font-black">💰 {outfit.cost}</span>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-r from-green-400 to-green-600 px-4 py-2 rounded-full inline-block">
                      <span className="font-black text-white">✓ Базовый</span>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <footer className="py-6 px-4 border-t-4 border-primary/30 bg-white/50">
        <div className="container mx-auto text-center">
          <p className="text-foreground/60 font-medium">
            🍪 Заботься о своём Affogato Cookie каждый день!
          </p>
        </div>
      </footer>
    </div>
  );
}