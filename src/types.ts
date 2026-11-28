export interface PartyState {
  blockedMonsterIds: number[];
  totalCount: number;
}

export interface SessionDrops {
  items: Record<string, number>;
  monsters: Record<number, number>;
}

export interface UserPermissions {
  isAdmin: boolean;
  isVip: boolean;
}

export interface GameSessionState {
  isEnabled: boolean;
  isMobile: boolean;

  userId: number;
  userName: string;
  permissions: UserPermissions;
  locationId: number;

  monstersTeam: PartyState;
  drops: SessionDrops;

  battleState: any;
  activeMonster: any;
  opponentMonster: any;

  isBattleFinished: boolean;
  isAgroLocation: boolean;
  isGiveMonsters: boolean; // isBackMonster   нужно ли сбрасывать мобов в пц
  itemCooldown: number; /// таймер для некст предмета
}

//

export type Monster = {
  id: number;
  name: string;
  cat: number;
};

export type ComboStep =
  | {
      type: "swap";
      id: number;
    }
  | {
      type: "attack";
      id: number;
      status: number;
      attempts: number;
    };

interface ComboConfig {
  steps: ComboStep[];
  isHeal: boolean;
}

export interface UserSettings {
  isDarkTheme: boolean;

  battle: {
    attackSkillId: number;
    finishSkillId: number;
    finishTargetMonsterId: number;
  };

  leveling: {
    skillId: number;
    targetMonsterId: number;
    maxLevel: number;
  };

  catch: {
    skillId: number;
    weatherSkillId: number;
    statusSkillId: number;
    targetMonsterId: number;
    ballId: number;
    genderFilter: number[];
    butterflyFilter: number[];
    semantFilter: number[];
    shine: {
      isEnabled: boolean;
      useSuperBall: boolean;
    };
  };

  survival: {
    minHpPercent: number;
    minPpPercent: number;
    useArenaHeal: boolean;
  };

  alerts: {
    isEnabled: boolean;
    isStopBotOnAlert: boolean;
  };

  automation: {
    autoItemId: number;
    shutdownDelayMin: number;
  };

  halloween: {
    usePay: boolean;
    useCandy: boolean;
  };
  combo: Record<number, ComboConfig>;
}
