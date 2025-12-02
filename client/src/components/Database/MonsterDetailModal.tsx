import { useTheme } from "../../contexts/ThemeContext";
import { useState, useMemo, useEffect } from "react";

interface MonsterDetailModalProps {
  monster: any;
  onClose: () => void;
}

// Helper function to get element color classes
const getElementColorClasses = (element: string, theme: string) => {
  const baseElement = (element.split(" ")[0] || element).toLowerCase();
  const isLight = theme === 'light';
  
  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    fire: {
      bg: "bg-red-500/20",
      text: "text-red-400",
      border: "border-red-500/40",
    },
    water: {
      bg: "bg-blue-500/20",
      text: "text-blue-400",
      border: "border-blue-500/40",
    },
    wind: {
      bg: "bg-yellow-500/20",
      text: isLight ? "text-yellow-600" : "text-yellow-400",
      border: "border-yellow-500/40",
    },
    earth: {
      bg: "bg-green-600/20",
      text: isLight ? "text-green-700" : "text-green-500",
      border: "border-green-600/40",
    },
    dark: {
      bg: "bg-[#3e364f]/40",
      text: isLight ? "text-[#64557a]" : "text-[#9f96b0]",
      border: "border-[#544a6b]/50",
    },
    shadow: {
      bg: "bg-[#3e364f]/40",
      text: isLight ? "text-[#64557a]" : "text-[#9f96b0]",
      border: "border-[#544a6b]/50",
    },
    undead: {
      bg: "bg-gray-700/30",
      text: isLight ? "text-gray-600" : "text-gray-300",
      border: "border-gray-600/50",
    },
    poison: {
      bg: "bg-violet-600/20",
      text: "text-violet-400",
      border: "border-violet-600/40",
    },
    neutral: {
      bg: "bg-stone-500/20",
      text: isLight ? "text-stone-600" : "text-stone-300",
      border: "border-stone-500/40",
    },
    holy: {
      bg: "bg-amber-500/20",
      text: isLight ? "text-amber-600" : "text-amber-400",
      border: "border-amber-500/40",
    },
    ghost: {
      bg: isLight ? "bg-[#6b85a3]/20" : "bg-[#4a5d75]/30",
      text: isLight ? "text-[#5a7aa6]" : "text-[#a0b9cf]",
      border: isLight ? "border-[#6b85a3]/40" : "border-[#5a6f8a]/40",
    },
  };
  
  return colorMap[baseElement] || {
    bg: "bg-gray-500/20",
    text: isLight ? "text-gray-600" : "text-gray-300",
    border: "border-gray-500/40",
  };
};

// Helper function to get race icon
const getRaceIcon = (race: string): string => {
  const raceIconMap: Record<string, string> = {
    "Angel": "fa-dove",
    "Brute": "fa-paw",
    "Demi-Human": "fa-user-friends",
    "Demon": "fa-eye",
    "Dragon": "fa-dragon",
    "Fish": "fa-fish",
    "Formless": "fa-shapes",
    "Insect": "fa-bug",
    "Plant": "fa-seedling",
    "Undead": "fa-skull",
  };
  
  return raceIconMap[race] || "fa-question";
};

// Helper function to convert milliseconds string to seconds with 2 significant figures
const msToSeconds = (msString: string | undefined): string => {
  if (!msString) return 'N/A';
  
  // Remove commas and "ms" text, extract number
  const msValue = parseFloat(msString.replace(/,/g, '').replace(/\s*ms/i, ''));
  
  if (isNaN(msValue)) return msString;
  
  // Convert to seconds
  const seconds = msValue / 1000;
  
  // Format to 2 significant figures
  return `${parseFloat(seconds.toPrecision(2))}s`;
};

// Helper function to format attack with K notation
const formatAttack = (attack: string) => {
  if (!attack) return 'N/A';
  return attack.split('~').map(part => {
    const num = parseInt(part.replace(/,/g, ''), 10);
    if (isNaN(num)) return part.trim();
    if (num >= 1000) {
      return parseFloat((num / 1000).toFixed(1)) + 'K';
    }
    return num.toLocaleString();
  }).join('~');
};

type SortDirection = "asc" | "desc";
type DropSortKey = "itemName" | "dropChance";
type SkillSortKey = "name" | "level" | "state";
type MapSortKey = "mapName" | "spawnAmount";

const MonsterDetailModal = ({ monster, onClose }: MonsterDetailModalProps) => {
  const { currentTheme, getTextClass, getSubTextClass } = useTheme();
  const [dropSort, setDropSort] = useState<{ key: DropSortKey; direction: SortDirection }>({ key: "dropChance", direction: "asc" });
  const [skillSort, setSkillSort] = useState<{ key: SkillSortKey; direction: SortDirection } | null>(null);
  const [mapSort, setMapSort] = useState<{ key: MapSortKey; direction: SortDirection }>({ key: "spawnAmount", direction: "desc" });
  
  const isSmallSprite = monster.spriteHeight && monster.spriteHeight < 70;
  const isMediumSprite = monster.spriteHeight && monster.spriteHeight >= 70 && monster.spriteHeight < 110;
  
  const imageScaleClass = isSmallSprite 
    ? 'h-[30%] w-[30%]' 
    : isMediumSprite 
      ? 'h-[60%] w-[60%]' 
      : 'h-full w-full';
      
  const specialNidhoggSize = monster.id === 2022 ? 'scale-[1.3]' : '';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const sortedDrops = useMemo(() => {
    return [...monster.drops].sort((a: any, b: any) => {
      const aValue = dropSort.key === "dropChance" ? parseFloat(a.dropChance) : a.itemName;
      const bValue = dropSort.key === "dropChance" ? parseFloat(b.dropChance) : b.itemName;
      
      if (aValue < bValue) return dropSort.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return dropSort.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [monster.drops, dropSort]);

  const sortedSkills = useMemo(() => {
    if (!skillSort || !monster.skills) return monster.skills || [];
    return [...monster.skills].sort((a: any, b: any) => {
      let aValue = a[skillSort.key];
      let bValue = b[skillSort.key];

      if (skillSort.key === "name") {
          aValue = a.name.includes('@') ? a.name.split('@')[1] : a.name;
          bValue = b.name.includes('@') ? b.name.split('@')[1] : b.name;
      }
      
      if (aValue < bValue) return skillSort.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return skillSort.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [monster.skills, skillSort]);

  const sortedMaps = useMemo(() => {
    if (!monster.maps) return [];
    return [...monster.maps].sort((a: any, b: any) => {
      let aValue = a[mapSort.key];
      let bValue = b[mapSort.key];

      if (mapSort.key === "spawnAmount") {
          aValue = a.spawnAmount || 0;
          bValue = b.spawnAmount || 0;
      }
      
      if (aValue < bValue) return mapSort.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return mapSort.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [monster.maps, mapSort]);

  const handleDropSort = (key: DropSortKey) => {
    setDropSort(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
    }));
  };

  const handleSkillSort = (key: SkillSortKey) => {
    setSkillSort(prev => ({
      key,
      direction: prev?.key === key && prev.direction === "asc" ? "desc" : "asc"
    }));
  };

  const handleMapSort = (key: MapSortKey) => {
    setMapSort(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc" // Default desc could be handled here if needed, but logic mirrors others
    }));
  };

  const getSortIcon = (key: string, currentSort: any) => {
    if (currentSort?.key !== key) return <i className="fa-solid fa-sort text-[10px] opacity-30 ml-1" />;
    return <i className={`fa-solid fa-sort-${currentSort.direction === "asc" ? "up" : "down"} text-[10px] ml-1`} />;
  };

  const getModalClass = () => {
    if (currentTheme === "light")
      return "bg-white border-slate-200 text-slate-900";
    if (currentTheme === "dark")
      return "bg-slate-900 border-slate-700 text-white";
    if (currentTheme === "cute")
      return "bg-[#2a2438] border-pink-500/20 text-pink-100";
    if (currentTheme === "mesi")
      return "bg-[#0000FF] border-[#FFFF00] text-[#FFFF00] border-4";
    return "bg-white border-slate-200";
  };

  const getSectionClass = () => {
    if (currentTheme === "light") return "bg-slate-50 border-slate-200";
    if (currentTheme === "dark") return "bg-slate-800/50 border-slate-700";
    if (currentTheme === "cute") return "bg-pink-900/20 border-pink-500/20";
    if (currentTheme === "mesi")
      return "bg-[#FF00FF] border-[#00FF00] border-2";
    return "bg-slate-50 border-slate-200";
  };

  const getHeaderRowClass = () => {
    if (currentTheme === "light") return "border-slate-200 bg-slate-100";
    if (currentTheme === "dark") return "border-slate-700 bg-slate-800";
    if (currentTheme === "cute") return "border-pink-500/20 bg-pink-900/40";
    if (currentTheme === "mesi") return "border-[#00FF00] bg-[#FF00FF]";
    return "border-slate-200 bg-slate-100";
  };

  return (
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
        onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
        }}
    >
      <div
        className={`relative w-full max-w-6xl max-h-[90vh] flex flex-col overflow-y-auto rounded-xl shadow-2xl border p-6 ${getModalClass()}`}
      >
        {/* Header & Content */}
        <div className="flex flex-col md:flex-row gap-8 mb-8 shrink-0">
            {/* Left Column: Header Info & Image */}
            <div className="flex flex-col items-center gap-6 shrink-0 w-[27rem]">
                {/* Name, ID, Link, Level */}
                <div className="flex flex-col gap-1 self-start w-full">
                    <div className="flex items-center gap-3 flex-wrap">
                        <h2 className={`text-3xl font-bold ${getTextClass()}`}>
                            {monster.name}
                        </h2>
                        {monster.level && (
                            <span className={`px-2 py-1 rounded text-xs font-bold border w-fit ${
                                currentTheme === 'light' ? 'bg-slate-100 border-slate-300 text-slate-600' : 'bg-white/10 border-white/20 text-white/80'
                            }`}>
                                Lv {monster.level}
                            </span>
                        )}
                        <a
                            href={`https://ratemyserver.net/mob_db.php?mob_id=${monster.id}&small=1&back=1`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`px-2 py-1 rounded text-xs font-bold border w-fit flex items-center gap-1 hover:opacity-80 transition-opacity ${
                                currentTheme === 'light' ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                            }`}
                            title="View on RateMyServer"
                        >
                            <span>RMS</span>
                            <i className="fa-solid fa-external-link-alt text-[10px]"></i>
                        </a>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`font-mono opacity-60 text-sm ${getTextClass()}`}>
                            #{monster.id}
                        </span>
                    </div>
                </div>

                {/* Image - Centered in Left Column */}
                <div className="h-64 w-full flex items-center justify-center relative group my-auto p-2">
                    <img
                        src={`https://ratemyserver.net/mobs/${monster.id}.gif`}
                        alt={monster.name}
                        className={`pixelated object-contain ${imageScaleClass} ${specialNidhoggSize}`}
                        style={{ imageRendering: "pixelated" }}
                        onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                    />
                </div>

                {/* HP & Exp (Base/Job) - Moved below GIF */}
                <div className="w-full flex gap-2">
                    {monster.hp !== undefined && (
                        <div className={`flex-1 p-1 rounded border text-center ${getSectionClass()}`}>
                            <div className={`text-[10px] uppercase font-bold opacity-60 ${getSubTextClass()}`}>HP</div>
                            <div className={`font-bold text-sm ${getTextClass()}`}>{monster.hp.toLocaleString()}</div>
                        </div>
                    )}
                    <div className={`flex-1 p-1 rounded border text-center ${getSectionClass()}`}>
                        <div className={`text-[10px] uppercase font-bold opacity-60 ${getSubTextClass()}`}>Exp (Base/Job)</div>
                        <div className={`font-bold text-sm ${getTextClass()}`}>{monster.baseExp} / {monster.jobExp}</div>
                    </div>
                </div>
            </div>

            {/* Right Column: Controls & Stats */}
            <div className="flex-1 flex flex-col max-w-[80%]">
                 {/* Top Controls */}
                 <div className="flex justify-end items-center gap-3 mb-2 min-h-[40px]">
                    {monster.isMVP && (
                        <span className="px-3 py-1 bg-yellow-500/20 text-yellow-600 text-sm font-bold rounded border border-yellow-500/30">
                            MVP
                        </span>
                    )}
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-full hover:bg-black/10 transition-colors ${getTextClass()}`}
                    >
                        <i className="fa-solid fa-times text-xl"></i>
                    </button>
                 </div>

                {/* Basic Info */}
                <div className="grid grid-cols-3 md:grid-cols-3 gap-4 mb-4">
              <div className={`p-3 rounded-lg border text-center ${getSectionClass()}`}>
                <div className={`text-xs uppercase font-bold opacity-60 mb-1 ${getSubTextClass()}`}>Race</div>
                <div className={`font-medium flex items-center justify-center gap-2 ${getTextClass()}`}>
                  <i className={`fa-solid ${getRaceIcon(monster.race)}`}></i>
                  <span>{monster.race}</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg border text-center ${getSectionClass()}`}>
                <div className={`text-xs uppercase font-bold opacity-60 mb-1 ${getSubTextClass()}`}>Element</div>
                <div className={`font-medium inline-block px-2 py-1 rounded border ${getElementColorClasses(monster.element, currentTheme).bg} ${getElementColorClasses(monster.element, currentTheme).text} ${getElementColorClasses(monster.element, currentTheme).border}`}>
                  {monster.element}
                </div>
              </div>
              <div className={`p-3 rounded-lg border text-center ${getSectionClass()}`}>
                <div className={`text-xs uppercase font-bold opacity-60 mb-1 ${getSubTextClass()}`}>Size</div>
                <div className={`font-medium ${getTextClass()}`}>{monster.size}</div>
              </div>
            </div>

            {/* Combat Stats */}
            <div className="grid grid-cols-5 gap-2 mb-4">
                {monster.attack && (
                    <div className={`p-2 rounded border text-center ${getSectionClass()}`}>
                        <div className={`text-[10px] uppercase font-bold opacity-60 ${getSubTextClass()}`}>ATK</div>
                        <div className={`font-bold ${getTextClass()}`}>{formatAttack(monster.attack)}</div>
                    </div>
                )}
                {monster.defense !== undefined && (
                    <div className={`p-2 rounded border text-center ${getSectionClass()}`}>
                        <div className={`text-[10px] uppercase font-bold opacity-60 ${getSubTextClass()}`}>DEF</div>
                        <div className={`font-bold ${getTextClass()}`}>{monster.defense}</div>
                    </div>
                )}
                {monster.magicDefense !== undefined && (
                    <div className={`p-2 rounded border text-center ${getSectionClass()}`}>
                        <div className={`text-[10px] uppercase font-bold opacity-60 ${getSubTextClass()}`}>MDEF</div>
                        <div className={`font-bold ${getTextClass()}`}>{monster.magicDefense}</div>
                    </div>
                )}
                <div className={`p-2 rounded border text-center ${getSectionClass()}`}>
                    <div className={`text-[10px] uppercase font-bold opacity-60 ${getSubTextClass()}`}>Hit (100%)</div>
                    <div className={`font-bold ${getTextClass()}`}>{monster.hit || 'N/A'}</div>
                </div>
                <div className={`p-2 rounded border text-center ${getSectionClass()}`}>
                    <div className={`text-[10px] uppercase font-bold opacity-60 ${getSubTextClass()}`}>Flee (95%)</div>
                    <div className={`font-bold ${getTextClass()}`}>{monster.flee || 'N/A'}</div>
                </div>
            </div>
            
            {/* Split Section: Stats, Battle Info, Elements, Mode */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                {/* 1. Primary Stats */}
                <div>
                    <div className={`text-xs font-bold uppercase opacity-60 mb-2 ${getSubTextClass()}`}>Primary Stats</div>
                    <div className="grid grid-cols-3 gap-1">
                        {Object.entries(monster.stats).map(([stat, value]: [string, any]) => (
                            <div key={stat} className={`p-1 rounded border text-center ${getSectionClass()}`}>
                                <div className={`text-[10px] uppercase font-bold opacity-60 ${getSubTextClass()}`}>{stat}</div>
                                <div className={`font-bold text-sm ${getTextClass()}`}>{value}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Battle Info */}
                <div>
                    <div className={`text-xs font-bold uppercase opacity-60 mb-2 ${getSubTextClass()}`}>Battle Info</div>
                    <div className="grid grid-cols-3 gap-1">
                        <div className={`p-1 rounded border text-center ${getSectionClass()}`}>
                            <div className={`text-[10px] uppercase font-bold opacity-60 ${getSubTextClass()}`}>Atk Range</div>
                            <div className={`font-bold text-sm ${getTextClass()}`}>{monster.attackRange || 'N/A'}</div>
                        </div>
                        <div className={`p-1 rounded border text-center ${getSectionClass()}`}>
                            <div className={`text-[10px] uppercase font-bold opacity-60 ${getSubTextClass()}`}>Spell Range</div>
                            <div className={`font-bold text-sm ${getTextClass()}`}>{monster.spellRange || 'N/A'}</div>
                        </div>
                        <div className={`p-1 rounded border text-center ${getSectionClass()}`}>
                            <div className={`text-[10px] uppercase font-bold opacity-60 ${getSubTextClass()}`}>Sight Range</div>
                            <div className={`font-bold text-sm ${getTextClass()}`}>{monster.visionRange || 'N/A'}</div>
                        </div>
                        <div className={`p-1 rounded border text-center ${getSectionClass()}`}>
                            <div className={`text-[10px] uppercase font-bold opacity-60 ${getSubTextClass()}`}>ASPD</div>
                            <div className={`font-bold text-sm ${getTextClass()}`}>{msToSeconds(monster.attackDelay)}</div>
                        </div>
                        <div className={`p-1 rounded border text-center ${getSectionClass()}`}>
                            <div className={`text-[10px] uppercase font-bold opacity-60 ${getSubTextClass()}`}>Flinch</div>
                            <div className={`font-bold text-sm ${getTextClass()}`}>{msToSeconds(monster.attackMotion)}</div>
                        </div>
                        {monster.speed !== undefined && (
                            <div className={`p-1 rounded border text-center ${getSectionClass()}`}>
                                <div className={`text-[10px] uppercase font-bold opacity-60 ${getSubTextClass()}`}>Walking Speed</div>
                                <div className={`font-bold text-sm ${getTextClass()}`}>{monster.speed}</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. Elemental Weaknesses */}
                <div>
                    {monster.elementalWeaknesses && (
                        <>
                            <div className={`text-xs font-bold uppercase opacity-60 mb-2 ${getSubTextClass()}`}>Elemental Weaknesses</div>
                            <div className="grid grid-cols-5 gap-1">
                                {['Neutral', 'Water', 'Earth', 'Fire', 'Wind', 'Poison', 'Holy', 'Shadow', 'Ghost', 'Undead'].map((element) => {
                                    const value = monster.elementalWeaknesses[element] ?? 100;
                                    let colorClass = getTextClass();
                                    if (value > 100) colorClass = "text-green-500";
                                    if (value < 100) colorClass = "text-red-500";
                                    
                                    return (
                                        <div key={element} className={`p-1 rounded border text-center ${getSectionClass()}`}>
                                            <div className={`text-[10px] uppercase font-bold opacity-60 ${getSubTextClass()}`}>{element}</div>
                                            <div className={`font-bold text-sm ${colorClass}`}>{value}%</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>

                {/* 4. Mode */}
                <div className="relative">
                    {monster.mode && monster.mode.length > 0 && (
                        <div className="absolute inset-0 flex flex-col">
                            <div className={`text-xs font-bold uppercase opacity-60 mb-2 ${getSubTextClass()}`}>Mode</div>
                            <div className={`flex-1 overflow-y-auto rounded border ${getSectionClass()}`}>
                                <table className="w-full text-sm">
                                    <tbody>
                                        {monster.mode.map((m: string, idx: number) => (
                                            <tr key={idx} className={idx < monster.mode.length - 1 ? `border-b ${currentTheme === 'light' ? 'border-slate-200' : 'border-slate-700/50'}` : ''}>
                                                <td className={`px-2 py-1 text-xs ${getTextClass()}`}>
                                                    {m}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
            {/* Maps */}
            <div className="flex flex-col h-full min-h-0">
                <h3 className={`text-xl font-bold mb-4 shrink-0 ${getTextClass()}`}>Locations</h3>
                <div className={`rounded-xl border overflow-hidden flex-1 overflow-y-auto relative min-h-[350px] ${getSectionClass()}`}>
                    <table className="w-full text-sm relative">
                        <thead className="sticky top-0 z-10 bg-inherit">
                            <tr className={`border-b ${getHeaderRowClass()}`}>
                                <th 
                                    className={`p-3 text-left cursor-pointer hover:bg-black/5 transition-colors ${getTextClass()}`}
                                    onClick={() => handleMapSort("mapName")}
                                >
                                    Map {getSortIcon("mapName", mapSort)}
                                </th>
                                <th 
                                    className={`p-3 text-right cursor-pointer hover:bg-black/5 transition-colors ${getTextClass()}`}
                                    onClick={() => handleMapSort("spawnAmount")}
                                >
                                    Spawn {getSortIcon("spawnAmount", mapSort)}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedMaps.length > 0 ? (
                                sortedMaps.map((map: any, idx: number) => (
                                    <tr key={idx} className={`border-b last:border-0 ${currentTheme === 'light' ? 'border-slate-200' : 'border-slate-700/50'}`}>
                                        <td className={`p-3 ${getTextClass()}`}>
                                            {map.rmsMapUrl ? (
                                                <a href={map.rmsMapUrl} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-blue-400 block">
                                                    <div className="font-mono font-bold">{map.mapName}</div>
                                                    <div className="text-[10px] opacity-60">{map.mapDescription || map.mapCode}</div>
                                                </a>
                                            ) : (
                                                <>
                                                    <div className="font-mono font-bold">{map.mapName}</div>
                                                    <div className="text-[10px] opacity-60">{map.mapDescription || map.mapCode}</div>
                                                </>
                                            )}
                                        </td>
                                        <td className={`p-3 text-right font-mono ${getTextClass()}`}>
                                            {map.spawnAmount ? (
                                                <div className="flex flex-col items-end">
                                                    <span>{map.spawnAmount}x</span>
                                                    {map.respawnTime && (
                                                        <span className="text-[10px] opacity-60">{map.respawnTime}m</span>
                                                    )}
                                                </div>
                                            ) : '???'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={2} className={`p-4 text-center opacity-50 ${getTextClass()}`}>No map info available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Drops */}
            <div className="flex flex-col h-full min-h-0">
                <h3 className={`text-xl font-bold mb-4 shrink-0 ${getTextClass()}`}>Drops</h3>
                <div className={`rounded-xl border overflow-hidden flex-1 overflow-y-auto relative min-h-[350px] ${getSectionClass()}`}>
                    <table className="w-full text-sm relative">
                        <thead className="sticky top-0 z-10 bg-inherit">
                            <tr className={`border-b ${getHeaderRowClass()}`}>
                                <th 
                                    className={`p-3 text-left cursor-pointer hover:bg-black/5 transition-colors ${getTextClass()}`}
                                    onClick={() => handleDropSort("itemName")}
                                >
                                    Item {getSortIcon("itemName", dropSort)}
                                </th>
                                <th 
                                    className={`p-3 text-right cursor-pointer hover:bg-black/5 transition-colors ${getTextClass()}`}
                                    onClick={() => handleDropSort("dropChance")}
                                >
                                    Chance {getSortIcon("dropChance", dropSort)}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedDrops.map((drop: any, idx: number) => (
                                <tr key={idx} className={`border-b last:border-0 ${currentTheme === 'light' ? 'border-slate-200' : 'border-slate-700/50'}`}>
                                    <td className={`p-3 ${getTextClass()}`}>
                                        <div className="flex items-center gap-2">
                                            <a 
                                                href={`https://ratemyserver.net/item_db.php?item_id=${drop.itemId}&small=1&back=1`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 hover:underline hover:text-blue-400"
                                            >
                                                <img 
                                                    src={drop.itemName.toLowerCase().endsWith('card') ? "https://ratemyserver.net/items/small/card.gif" : `https://ratemyserver.net/items/small/${drop.itemId}.gif`}
                                                    alt={drop.itemName}
                                                    className="w-6 h-6 object-contain pixelated"
                                                    onError={(e) => ((e.target as HTMLImageElement).src = "https://ratemyserver.net/items/small/0.gif")}
                                                />
                                                <span>{drop.itemName}</span>
                                            </a>
                                            {drop.isMVP && (
                                                <span className="text-[10px] bg-yellow-500/20 text-yellow-600 px-1 rounded border border-yellow-500/30">MVP</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className={`p-3 text-right font-mono ${getTextClass()}`}>{drop.dropChance}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Skills & Info */}
            <div className="flex flex-col h-full min-h-0 space-y-6">
                {monster.skills && monster.skills.length > 0 && (
                    <div className="flex flex-col h-full min-h-0">
                        <h3 className={`text-xl font-bold mb-4 shrink-0 ${getTextClass()}`}>Skills</h3>
                        <div className={`rounded-xl border overflow-hidden flex-1 overflow-y-auto relative min-h-[350px] ${getSectionClass()}`}>
                             <table className="w-full text-sm relative">
                                <thead className="sticky top-0 z-10 bg-inherit">
                                    <tr className={`border-b ${getHeaderRowClass()}`}>
                                        <th 
                                            className={`p-3 text-left cursor-pointer hover:bg-black/5 transition-colors ${getTextClass()}`}
                                            onClick={() => handleSkillSort("name")}
                                        >
                                            Skill {getSortIcon("name", skillSort)}
                                        </th>
                                        <th 
                                            className={`p-3 text-center cursor-pointer hover:bg-black/5 transition-colors ${getTextClass()}`}
                                            onClick={() => handleSkillSort("level")}
                                        >
                                            Level {getSortIcon("level", skillSort)}
                                        </th>
                                        <th 
                                            className={`p-3 text-right cursor-pointer hover:bg-black/5 transition-colors ${getTextClass()}`}
                                            onClick={() => handleSkillSort("state")}
                                        >
                                            State {getSortIcon("state", skillSort)}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedSkills.map((skill: any, idx: number) => (
                                        <tr key={idx} className={`border-b last:border-0 ${currentTheme === 'light' ? 'border-slate-200' : 'border-slate-700/50'}`}>
                                            <td className={`p-3 ${getTextClass()}`}>
                                                <div className="font-medium">{skill.name.includes('@') ? skill.name.split('@')[1] : skill.name}</div>
                                            </td>
                                            <td className={`p-3 text-center font-mono ${getTextClass()}`}>{skill.level}</td>
                                            <td className={`p-3 text-right ${getTextClass()}`}>
                                                <span className={`px-2 py-0.5 rounded text-xs border ${
                                                    skill.state === 'Idle' ? 'bg-slate-500/10 border-slate-500/20 text-slate-500' :
                                                    skill.state === 'Attack' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                                                    skill.state === 'Chase' ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' :
                                                    'bg-blue-500/10 border-blue-500/20 text-blue-500'
                                                }`}>
                                                    {skill.state}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default MonsterDetailModal;

