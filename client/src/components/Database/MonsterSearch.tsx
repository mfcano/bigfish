import { useState, useEffect, useMemo, useRef } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import MonsterDetailModal from "./MonsterDetailModal";

interface Drop {
  itemId: number;
  itemName: string;
  dropChance: string;
  isMVP: boolean;
}

interface Monster {
  id: number;
  name: string;
  isMVP: boolean;
  size: string;
  race: string;
  element: string;
  baseExp: number;
  jobExp: number;
  stats: {
    STR: number;
    AGI: number;
    VIT: number;
    INT: number;
    DEX: number;
    LUK: number;
  };
  hp?: number;
  level?: number;
  attack?: string;
  defense?: number;
  magicDefense?: number;
  speed?: number;
  attackRange?: number;
  spellRange?: number;
  visionRange?: number;
  delayMotion?: string;
  drops: Drop[];
  skills?: any[];
  spriteWidth?: number;
  spriteHeight?: number;
  hit?: number;
  flee?: number;
  elementalWeaknesses?: Record<string, number>;
  mode?: string[];
  maps?: {
    mapName: string;
    mapCode?: string;
    spawnAmount?: number;
    respawnTime?: number;
    rmsMapUrl?: string;
    mapDescription?: string;
  }[];
}

type SortOption = "id" | "level" | "baseExp" | "jobExp" | "name";
type SortDirection = "asc" | "desc";

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

const FilterDropdown = ({ label, options, selected, onChange }: { label: string, options: string[], selected: string[], onChange: (val: string[]) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentTheme, getTextClass } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getSectionClass = () => {
    if (currentTheme === "light") return "bg-white border-slate-200"; // Dropdown usually needs solid bg or blur
    if (currentTheme === "dark") return "bg-slate-800 border-slate-700";
    if (currentTheme === "cute") return "bg-[#2a2438] border-pink-500/20";
    if (currentTheme === "mesi") return "bg-[#0000FF] border-[#FFFF00] border-2";
    return "bg-white border-slate-200";
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(s => s !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3 py-2 rounded border flex items-center justify-between gap-2 w-full min-w-[140px] ${getSectionClass()} ${getTextClass()}`}
      >
        <span className="truncate">{selected.length > 0 ? `${label} (${selected.length})` : `${label} (All)`}</span>
        <i className={`fa-solid fa-chevron-${isOpen ? 'up' : 'down'} text-xs opacity-50`}></i>
      </button>
      
      {isOpen && (
        <div className={`absolute top-full left-0 mt-1 w-full min-w-[200px] max-h-60 overflow-y-auto rounded-lg border shadow-xl z-50 p-2 ${getSectionClass()}`}>
          {options.map((opt: string) => (
            <label key={opt} className={`flex items-center gap-2 p-2 rounded hover:bg-black/5 cursor-pointer ${getTextClass()}`}>
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => toggleOption(opt)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="truncate">{opt}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

const MonsterSearch = () => {
  const { currentTheme, getTextClass, getSubTextClass } = useTheme();
  
  const getSectionClass = () => {
    if (currentTheme === "light") return "bg-slate-50 border-slate-200";
    if (currentTheme === "dark") return "bg-slate-800/50 border-slate-700";
    if (currentTheme === "cute") return "bg-pink-900/20 border-pink-500/20";
    if (currentTheme === "mesi") return "bg-[#FF00FF] border-[#00FF00] border-2";
    return "bg-slate-50 border-slate-200";
  };

  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<{
    race: string[];
    element: string[];
    size: string[];
    isMVP: boolean;
    hideDummies: boolean;
    hideZeroExp: boolean;
    minLevel: string;
    maxLevel: string;
  }>({
    race: [],
    element: [],
    size: [],
    isMVP: false,
    hideDummies: true,
    hideZeroExp: true,
    minLevel: "",
    maxLevel: "",
  });
  const [sort, setSort] = useState<{ key: SortOption; direction: SortDirection }>({
    key: "level",
    direction: "asc",
  });
  const [page, setPage] = useState(1);
  const itemsPerPage = 24;
  const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null);

  useEffect(() => {
    fetch("/data/monsters.json?v=1")
      .then((res) => res.json())
      .then((data) => {
        setMonsters(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load monsters", err);
        setLoading(false);
      });
  }, []);

  const races = useMemo(() => {
    const r = new Set(monsters.map((m) => m.race));
    return Array.from(r).sort() as string[];
  }, [monsters]);

  const elements = useMemo(() => {
    const e = new Set(monsters.map((m) => m.element.split(" ")[0]));
    return Array.from(e).sort() as string[];
  }, [monsters]);

  const sizes = useMemo(() => {
    const s = new Set(monsters.map((m) => m.size));
    return Array.from(s).sort() as string[];
  }, [monsters]);

  const filteredMonsters = useMemo(() => {
    return monsters.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.id.toString().includes(searchTerm);
      const matchesRace = filters.race.length === 0 || filters.race.includes(m.race);
      const matchesElement =
        filters.element.length === 0 || filters.element.some(e => m.element.startsWith(e));
      const matchesSize = filters.size.length === 0 || filters.size.includes(m.size);
      const matchesMvp = !filters.isMVP || m.isMVP;
      const matchesDummies = !filters.hideDummies || (m.skills && m.skills.length > 0);
      const matchesZeroExp = !filters.hideZeroExp || (m.baseExp !== 0 || m.jobExp !== 0);

      // Range filters
      const minLevel = filters.minLevel ? parseInt(filters.minLevel) : 0;
      const maxLevel = filters.maxLevel ? parseInt(filters.maxLevel) : Infinity;
      const level = m.level || 0;
      const matchesLevel = level >= minLevel && level <= maxLevel;

      return (
        matchesSearch &&
        matchesRace &&
        matchesElement &&
        matchesSize &&
        matchesMvp &&
        matchesDummies &&
        matchesZeroExp &&
        matchesLevel
      );
    });
  }, [monsters, searchTerm, filters]);

  const sortedMonsters = useMemo(() => {
    return [...filteredMonsters].sort((a, b) => {
      let aValue: any = a[sort.key] || 0;
      let bValue: any = b[sort.key] || 0;

      // Special handling for string comparison if needed, though mostly numbers here
      if (sort.key === 'name') {
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (aValue < bValue) return sort.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sort.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredMonsters, sort]);

  const paginatedMonsters = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return sortedMonsters.slice(start, start + itemsPerPage);
  }, [sortedMonsters, page]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, filters, sort]);

  const getInputClass = () => {
    if (currentTheme === "light")
      return "bg-white border-slate-300 text-slate-900 focus:border-blue-500";
    if (currentTheme === "dark")
      return "bg-slate-800 border-slate-700 text-white focus:border-blue-500";
    if (currentTheme === "cute")
      return "bg-pink-900/20 border-pink-500/30 text-pink-100 focus:border-pink-500";
    if (currentTheme === "mesi")
      return "bg-[#0000FF] border-[#FFFF00] text-[#FFFF00] placeholder-yellow-200";
    return "bg-white border-slate-300";
  };

  const getCardClass = () => {
    if (currentTheme === "light")
      return "bg-white border-slate-200 hover:border-blue-400 shadow-sm hover:shadow-md";
    if (currentTheme === "dark")
      return "bg-slate-900 border-slate-800 hover:border-blue-500 shadow-sm hover:shadow-md";
    if (currentTheme === "cute")
      return "bg-[#2a2438] border-pink-500/20 hover:border-pink-400 hover:shadow-[0_0_15px_rgba(236,72,153,0.3)]";
    if (currentTheme === "mesi")
      return "bg-[#0000FF] border-4 border-[#FFFF00] rounded-none shadow-none";
    return "bg-white border-slate-200";
  };

  const handleSort = (key: SortOption) => {
    setSort(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
    }));
  };

  const resetFilters = () => {
    setFilters({
      race: [],
      element: [],
      size: [],
      isMVP: false,
      hideDummies: true,
      hideZeroExp: true,
      minLevel: "",
      maxLevel: "",
    });
    setSort({ key: "level", direction: "asc" });
    setSearchTerm("");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className={`text-3xl font-bold ${getTextClass()}`}>
            Monster Database
          </h2>
          <div className={`text-sm ${getSubTextClass()}`}>
            {filteredMonsters.length} Monsters Found
          </div>
        </div>

        <div
          className={`p-4 rounded-xl border ${
            currentTheme === "light"
              ? "bg-slate-50 border-slate-200"
              : currentTheme === "dark"
              ? "bg-slate-800/50 border-slate-700"
              : currentTheme === "cute"
              ? "bg-pink-900/10 border-pink-500/20"
              : "bg-[#0000FF] border-[#FFFF00]"
          }`}
        >
          <div className="flex flex-col gap-4">
            
            {/* Row 1: Search & Toggles */}
            <div className="flex flex-col lg:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className={`text-xs font-bold uppercase mb-1 block ${getSubTextClass()}`}>Search</label>
                <div className="relative">
                    <i className={`fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 opacity-50 ${getTextClass()}`}></i>
                    <input 
                        type="text" 
                        placeholder="Search by Name or ID..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full pl-10 pr-3 py-2 rounded-lg border outline-none transition-all ${getInputClass()}`} 
                    />
                </div>
              </div>
              
              <div className="flex gap-6 pb-2 shrink-0 items-center">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                   <input 
                        type="checkbox" 
                        checked={filters.isMVP}
                        onChange={(e) => setFilters({ ...filters, isMVP: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                    /> 
                   <span className={getTextClass()}>MVP Only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                   <input 
                        type="checkbox" 
                        checked={filters.hideDummies}
                        onChange={(e) => setFilters({ ...filters, hideDummies: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                    /> 
                   <span className={getTextClass()}>Hide Event Mob</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                   <input 
                        type="checkbox" 
                        checked={filters.hideZeroExp}
                        onChange={(e) => setFilters({ ...filters, hideZeroExp: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                    /> 
                   <span className={getTextClass()}>Hide 0 EXP</span>
                </label>
                <button
                    onClick={resetFilters}
                    className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                        currentTheme === 'light' ? 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-600' :
                        currentTheme === 'dark' ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300' :
                        currentTheme === 'cute' ? 'bg-pink-500/10 border-pink-500/20 hover:bg-pink-500/20 text-pink-300' :
                        'bg-red-600 text-white border-2 border-white'
                    }`}
                >
                    Reset Filters
                </button>
              </div>
            </div>

            {/* Row 2: Filters Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {/* Race */}
                <div className="flex flex-col gap-1">
                    <label className={`text-xs font-bold uppercase mb-1 block ${getSubTextClass()}`}>Race</label>
                    <FilterDropdown 
                        label="Race"
                        options={races} 
                        selected={filters.race} 
                        onChange={(val) => setFilters({ ...filters, race: val })} 
                    />
                </div>
                {/* Element */}
                <div className="flex flex-col gap-1">
                    <label className={`text-xs font-bold uppercase mb-1 block ${getSubTextClass()}`}>Element</label>
                    <FilterDropdown 
                        label="Element"
                        options={elements} 
                        selected={filters.element} 
                        onChange={(val) => setFilters({ ...filters, element: val })} 
                    />
                </div>
                {/* Size */}
                <div className="flex flex-col gap-1">
                    <label className={`text-xs font-bold uppercase mb-1 block ${getSubTextClass()}`}>Size</label>
                    <FilterDropdown 
                        label="Size"
                        options={sizes} 
                        selected={filters.size} 
                        onChange={(val) => setFilters({ ...filters, size: val })} 
                    />
                </div>
                
                {/* Sort */}
                <div className="flex flex-col gap-1">
                    <label className={`text-xs font-bold uppercase mb-1 block ${getSubTextClass()}`}>Sort By</label>
                    <div className="flex gap-1">
                        <select
                            value={sort.key}
                            onChange={(e) => handleSort(e.target.value as SortOption)}
                            className={`flex-1 px-3 py-2 rounded-l-lg border-y border-l outline-none transition-all ${getInputClass()}`}
                        >
                            <option value="id">ID</option>
                            <option value="name">Name</option>
                            <option value="level">Level</option>
                            <option value="baseExp">Base Exp</option>
                            <option value="jobExp">Job Exp</option>
                        </select>
                        <button
                            onClick={() => setSort(prev => ({ ...prev, direction: prev.direction === 'asc' ? 'desc' : 'asc' }))}
                            className={`px-3 py-2 rounded-r-lg border transition-all ${getInputClass()}`}
                        >
                            <i className={`fa-solid fa-sort-${sort.direction === 'asc' ? 'amount-up' : 'amount-down'}`}></i>
                        </button>
                    </div>
                </div>

                {/* Level Range (Span 2 cols) */}
                <div className="col-span-2">
                     <label className={`text-xs font-bold uppercase mb-1 block ${getSubTextClass()}`}>Level Range</label>
                     <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="Min"
                            value={filters.minLevel}
                            onChange={(e) => setFilters({ ...filters, minLevel: e.target.value })}
                            className={`w-full px-3 py-2 rounded-lg border outline-none transition-all ${getInputClass()}`}
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            value={filters.maxLevel}
                            onChange={(e) => setFilters({ ...filters, maxLevel: e.target.value })}
                            className={`w-full px-3 py-2 rounded-lg border outline-none transition-all ${getInputClass()}`}
                        />
                     </div>
                </div>
            </div>

          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {paginatedMonsters.map((monster) => (
          <MonsterCard
            key={monster.id}
            monster={monster}
            currentTheme={currentTheme}
            getCardClass={getCardClass}
            getTextClass={getTextClass}
            getSubTextClass={getSubTextClass}
            onClick={() => setSelectedMonster(monster)}
          />
        ))}
      </div>

      {/* Pagination */}
      {filteredMonsters.length > itemsPerPage && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`px-4 py-2 rounded ${
              page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-opacity-80"
            } ${
                currentTheme === 'mesi' 
                ? 'bg-[#FF00FF] text-[#FFFF00] font-bold border-2 border-[#00FF00]' 
                : 'bg-blue-600 text-white'
            }`}
          >
            Prev
          </button>
          <span className={`px-4 py-2 ${getTextClass()}`}>
            Page {page} of {Math.ceil(filteredMonsters.length / itemsPerPage)}
          </span>
          <button
            onClick={() =>
              setPage((p) =>
                Math.min(
                  Math.ceil(filteredMonsters.length / itemsPerPage),
                  p + 1
                )
              )
            }
            disabled={
              page >= Math.ceil(filteredMonsters.length / itemsPerPage)
            }
            className={`px-4 py-2 rounded ${
              page >= Math.ceil(filteredMonsters.length / itemsPerPage)
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-opacity-80"
            } ${
                currentTheme === 'mesi' 
                ? 'bg-[#FF00FF] text-[#FFFF00] font-bold border-2 border-[#00FF00]' 
                : 'bg-blue-600 text-white'
            }`}
          >
            Next
          </button>
        </div>
      )}

      {selectedMonster && (
        <MonsterDetailModal
          monster={selectedMonster}
          onClose={() => setSelectedMonster(null)}
        />
      )}
    </div>
  );
};

const MonsterCard = ({
  monster,
  currentTheme,
  getCardClass,
  getTextClass,
  getSubTextClass,
  onClick,
}: any) => {
  return (
    <div
      onClick={onClick}
      className={`relative p-4 rounded-xl border transition-all duration-200 flex flex-col cursor-pointer ${getCardClass()}`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className={`font-bold text-lg leading-tight ${getTextClass()}`}>
            {monster.name}
          </h3>
          <div className={`flex items-center gap-2 text-xs font-mono opacity-70 ${getTextClass()}`}>
            <span>ID: {monster.id}</span>
            {monster.level && (
                <>
                    <span>•</span>
                    <span>Lv {monster.level}</span>
                </>
            )}
          </div>
        </div>
        {monster.isMVP && (
          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-600 text-xs font-bold rounded border border-yellow-500/30">
            MVP
          </span>
        )}
      </div>

      {/* Image Area */}
      <div className="h-64 flex items-center justify-center mb-4 relative group overflow-hidden">
        <img
          src={`https://ratemyserver.net/mobs/${monster.id}.gif`}
          alt={monster.name}
          className="pixelated max-h-full max-w-full object-contain transform transition-transform group-hover:scale-[1.8] scale-150"
          style={{ imageRendering: "pixelated" }}
          onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs mb-4">
        <div className={getSubTextClass()}>
          <span className="opacity-60">HP:</span> {monster.hp ? monster.hp.toLocaleString() : '???'}
        </div>
        <div className={`flex items-center gap-1.5 ${getSubTextClass()}`}>
          <span className="opacity-60">Race:</span>
          <i className={`fa-solid ${getRaceIcon(monster.race)} text-xs`}></i>
          <span>{monster.race}</span>
        </div>
          <div className={getSubTextClass()}>
            <span className="opacity-60">Elem:</span>{" "}
            <span className={`px-1.5 py-0.5 rounded text-xs font-semibold border ${getElementColorClasses(monster.element, currentTheme).bg} ${getElementColorClasses(monster.element, currentTheme).text} ${getElementColorClasses(monster.element, currentTheme).border}`}>
              {monster.element}
            </span>
          </div>
        <div className={getSubTextClass()}>
          <span className="opacity-60">Size:</span> {monster.size}
        </div>
        <div className={`col-span-2 ${getSubTextClass()}`}>
          <span className="opacity-60">Exp:</span> {monster.baseExp}/{monster.jobExp}
        </div>
      </div>
    </div>
  );
};

export default MonsterSearch;
