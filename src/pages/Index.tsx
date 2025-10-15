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
    love: 50,
    level: 5
  });
  const [coins, setCoins] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showWardrobe, setShowWardrobe] = useState(false);
  const [currentOutfit, setCurrentOutfit] = useState(0);
  const [animationEffect, setAnimationEffect] = useState<string | null>(null);
  const [isHurt, setIsHurt] = useState(false);
  const [isHappy, setIsHappy] = useState(false);
  const [isEating, setIsEating] = useState(false);
  const [isLilyPet, setIsLilyPet] = useState(false);
  const [ownedOutfits, setOwnedOutfits] = useState<number[]>([0]);
  const [isDead, setIsDead] = useState(false);
  const [showDeathAnimation, setShowDeathAnimation] = useState(false);

  const outfits = [
    {
      id: 0,
      name: "Оригинальный облик",
      image: "https://cdn.poehali.dev/files/44cafd08-2350-4055-96a2-31af2762a139.png",
      cost: 0
    },
    {
      id: 1,
      name: "Affogato Lily",
      image: "https://cdn.poehali.dev/files/b6501871-2570-423c-9f15-80a4fc710028.jpg",
      cost: 100
    }
  ];

  useEffect(() => {
    if (isDead) return;
    
    const interval = setInterval(() => {
      setStats(prev => {
        // Проверяем сколько характеристик уже на нуле
        const zeroCount = [prev.happiness, prev.energy, prev.hunger, prev.love].filter(v => v === 0).length;
        
        // Если 2 или больше характеристик на нуле - ускоряем падение в 3 раза
        const multiplier = zeroCount >= 2 ? 3 : 1;
        
        return {
          ...prev,
          hunger: Math.max(0, prev.hunger - (1.5 * multiplier)),
          energy: Math.max(0, prev.energy - (0.8 * multiplier)),
          happiness: Math.max(0, prev.happiness - (0.5 * multiplier)),
          love: Math.max(0, prev.love - (0.4 * multiplier))
        };
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isDead]);

  useEffect(() => {
    if (stats.happiness === 0 && stats.energy === 0 && stats.hunger === 0 && stats.love === 0) {
      setShowDeathAnimation(true);
      
      setTimeout(() => {
        setIsDead(true);
        setShowDeathAnimation(false);
      }, 15000);
      
      toast({
        title: "💀 Affogato Cookie погиб...",
        description: "Все характеристики достигли нуля",
        variant: "destructive"
      });
    }
    
    // Предупреждения при низких характеристиках
    const zeroCount = [stats.happiness, stats.energy, stats.hunger, stats.love].filter(v => v === 0).length;
    
    if (zeroCount >= 2 && !isDead) {
      toast({
        title: "🚨 КРИТИЧЕСКОЕ СОСТОЯНИЕ!",
        description: "Две характеристики на нуле! Остальные падают быстрее!",
        variant: "destructive"
      });
    }
    
    if (stats.happiness <= 20 && stats.happiness > 0 && !isDead) {
      toast({
        title: "⚠️ Низкое счастье!",
        description: "Affogato Cookie грустит...",
        variant: "destructive"
      });
    }
    if (stats.energy <= 15 && stats.energy > 0 && !isDead) {
      toast({
        title: "⚠️ Критически мало энергии!",
        description: "Affogato Cookie очень устал...",
        variant: "destructive"
      });
    }
    if (stats.hunger <= 10 && stats.hunger > 0 && !isDead) {
      toast({
        title: "⚠️ Сильный голод!",
        description: "Affogato Cookie нужно покормить срочно!",
        variant: "destructive"
      });
    }
    if (stats.love <= 15 && stats.love > 0 && !isDead) {
      toast({
        title: "⚠️ Мало любви!",
        description: "Affogato Cookie чувствует себя одиноко...",
        variant: "destructive"
      });
    }
  }, [stats, isDead]);

  const showEffect = (effect: string) => {
    setAnimationEffect(effect);
    setTimeout(() => setAnimationEffect(null), 1500);
  };

  const feedCookie = () => {
    if (stats.love <= 10) {
      toast({
        title: "Отказ! 💔",
        description: "Affogato Cookie слишком обижен и отказывается есть...",
        variant: "destructive"
      });
      return;
    }
    
    if (coins >= 10) {
      setCoins(prev => prev - 10);
      setIsEating(true);
      setStats(prev => ({
        ...prev,
        hunger: Math.min(100, prev.hunger + 25),
        happiness: Math.min(100, prev.happiness + 5)
      }));
      toast({
        title: "Ням-ням! 🍰",
        description: "Affogato Cookie доволен вкусным угощением!",
      });
      setTimeout(() => setIsEating(false), 3000);
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
    if (stats.love <= 10) {
      toast({
        title: "Отказ! 💔",
        description: "Affogato Cookie отворачивается и не хочет общаться...",
        variant: "destructive"
      });
      return;
    }
    
    showEffect("pet");
    
    // Для Affogato Lily используем специальную эмоцию
    if (currentOutfit === 1) {
      setIsLilyPet(true);
      setTimeout(() => setIsLilyPet(false), 3000);
    } else {
      setIsHappy(true);
      setTimeout(() => setIsHappy(false), 3000);
    }
    
    setStats(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 20),
      love: Math.min(100, prev.love + 25)
    }));
    toast({
      title: "Мурр~ 💕",
      description: "Affogato Cookie обожает, когда его гладят! +25 любви",
    });
  };

  const hitCookie = () => {
    showEffect("hit");
    setIsHurt(true);
    setStats(prev => ({
      ...prev,
      happiness: Math.max(0, prev.happiness - 30),
      energy: Math.max(0, prev.energy - 10),
      love: Math.max(0, prev.love - 20)
    }));
    toast({
      title: "Ой! 😢",
      description: "Affogato Cookie очень расстроен... -20 любви",
      variant: "destructive"
    });
    setTimeout(() => setIsHurt(false), 3000);
  };

  const changeOutfit = (outfitId: number) => {
    const outfit = outfits.find(o => o.id === outfitId);
    if (!outfit) return;

    if (!ownedOutfits.includes(outfitId)) {
      if (coins < outfit.cost) {
        toast({
          title: "Недостаточно монет! 💰",
          description: `Нужно ${outfit.cost} монет для покупки`,
          variant: "destructive"
        });
        return;
      }
      setCoins(prev => prev - outfit.cost);
      setOwnedOutfits(prev => [...prev, outfitId]);
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

  const resetGame = () => {
    setStats({
      happiness: 75,
      energy: 60,
      hunger: 40,
      love: 50,
      level: 5
    });
    setCoins(100);
    setCurrentOutfit(0);
    setOwnedOutfits([0]);
    setIsDead(false);
    setShowDeathAnimation(false);
    setIsPlaying(false);
    setIsHurt(false);
    setIsHappy(false);
    setIsEating(false);
    setIsLilyPet(false);
    toast({
      title: "🔄 Игра перезапущена!",
      description: "Affogato Cookie вернулся к жизни!",
    });
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
                  {showDeathAnimation ? (
                    <div className="w-full h-full relative">
                      <img
                        src="https://cdn.poehali.dev/projects/afdc2bb2-bccd-4e69-909f-fb181d7ea94c/files/bf928157-988b-457e-8a6d-b62cb192d785.jpg"
                        alt="Надгробие"
                        className="w-full h-full object-cover animate-fade-in"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="text-center space-y-4">
                          <p className="text-white font-black text-3xl drop-shadow-2xl animate-pulse">💀</p>
                          <p className="text-white font-black text-xl drop-shadow-2xl">Affogato Cookie...</p>
                        </div>
                      </div>
                    </div>
                  ) : isDead ? (
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                      <div className="text-center space-y-4 animate-pulse">
                        <div className="text-9xl">🪦</div>
                        <p className="text-white font-black text-2xl">R.I.P.</p>
                        <p className="text-gray-400 font-bold text-lg">Affogato Cookie</p>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={
                        currentOutfit === 0 ? (
                          isHurt 
                            ? "https://cdn.poehali.dev/files/5b7ebc9b-a617-436d-82ac-f23dd416b910.png" 
                            : isHappy 
                            ? "https://cdn.poehali.dev/files/7c390821-37f8-4c81-982f-f0d25b707ae4.png"
                            : isEating
                            ? "https://cdn.poehali.dev/files/2c8c69c3-2e60-472d-8051-5cb717c7c514.jpg"
                            : outfits[0].image
                        ) : currentOutfit === 1 && isLilyPet
                        ? "https://cdn.poehali.dev/files/8c3145a1-26c5-4cc8-bb50-26f633df1bbf.jpg"
                        : outfits[currentOutfit].image
                      }
                      alt="Affogato Cookie"
                      className="w-full h-full object-cover"
                    />
                  )}
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

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-foreground flex items-center gap-2">
                        💕 Любовь
                      </span>
                      <span className="font-black text-pink-500">{Math.round(stats.love)}%</span>
                    </div>
                    <Progress value={stats.love} className={`h-3 ${getStatusColor(stats.love)}`} />
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-4 border-secondary/30 shadow-xl bg-gradient-to-br from-white to-secondary/5">
                <h3 className="text-2xl font-black mb-4 flex items-center gap-2">
                  <Icon name="Sparkles" className="text-secondary" />
                  Действия
                </h3>
                
                {showDeathAnimation ? (
                  <div className="flex flex-col items-center gap-6 py-8">
                    <div className="text-center space-y-2 animate-pulse">
                      <div className="text-6xl mb-4">⏳</div>
                      <p className="text-xl font-black text-gray-600">Прощание с Affogato Cookie...</p>
                      <p className="text-sm text-foreground/70">Анимация прощания...</p>
                    </div>
                  </div>
                ) : isDead ? (
                  <div className="flex flex-col items-center gap-6 py-8">
                    <div className="text-center space-y-2">
                      <p className="text-xl font-black text-red-600">💀 Персонаж погиб</p>
                      <p className="text-sm text-foreground/70">Все характеристики достигли нуля...</p>
                    </div>
                    <Button
                      onClick={resetGame}
                      className="bg-gradient-to-r from-green-500 to-green-700 hover:scale-110 transition-all font-black text-xl py-8 px-12 rounded-2xl border-4 border-foreground/20 shadow-2xl text-white"
                    >
                      <Icon name="RotateCcw" size={24} />
                      Начать заново
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={feedCookie}
                      disabled={stats.love <= 10}
                      className="bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-all font-bold text-base py-6 rounded-xl border-4 border-foreground/20 shadow-lg text-foreground disabled:opacity-50 disabled:grayscale"
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
                      disabled={stats.love <= 10}
                      className="bg-gradient-to-r from-pink-400 to-pink-600 hover:scale-105 transition-all font-bold text-base py-6 rounded-xl border-4 border-foreground/20 shadow-lg text-white disabled:opacity-50 disabled:grayscale"
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
                )}
              </Card>

              <Card className="p-6 border-4 border-accent/30 shadow-xl bg-gradient-to-br from-accent/5 to-white">
                <h3 className="text-xl font-black mb-3 flex items-center gap-2">
                  <Icon name="Info" className="text-accent" />
                  Советы по уходу
                </h3>
                <ul className="space-y-2 text-sm font-medium text-foreground/80">
                  <li className="flex items-start gap-2">
                    <span className="text-pink-500">•</span>
                    <span>Гладьте печеньку для повышения любви</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary">•</span>
                    <span>Играйте, чтобы зарабатывать монеты</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>Не бейте печеньку - любовь падает!</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500">•</span>
                    <span>Покупайте новые скины в гардеробе</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Dialog open={showWardrobe} onOpenChange={setShowWardrobe}>
        <DialogContent className="max-w-3xl border-4 border-primary/30">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              👔 Гардероб Affogato Cookie
            </DialogTitle>
            <DialogDescription className="text-center text-foreground/70 font-medium">
              Выбери стильный наряд для своей печеньки!
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid md:grid-cols-2 gap-6 p-4">
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
                <div className="p-6 text-center space-y-3">
                  <h4 className="font-black text-xl">{outfit.name}</h4>
                  {ownedOutfits.includes(outfit.id) ? (
                    <div className="bg-gradient-to-r from-green-400 to-green-600 px-6 py-3 rounded-full inline-block">
                      <span className="font-black text-white text-lg">✓ Куплено</span>
                    </div>
                  ) : outfit.cost === 0 ? (
                    <div className="bg-gradient-to-r from-blue-400 to-blue-600 px-6 py-3 rounded-full inline-block">
                      <span className="font-black text-white text-lg">🎁 Бесплатно</span>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-r from-secondary to-primary px-6 py-3 rounded-full inline-block border-2 border-foreground/20">
                      <span className="font-black text-foreground text-lg">💰 {outfit.cost}</span>
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