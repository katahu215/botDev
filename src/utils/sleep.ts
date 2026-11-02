export const delay = async (maxMs: number, minMs: number = 1) => {
  return new Promise((resolve) => setTimeout(resolve, Math.random() * (maxMs - minMs) + minMs));
};

export const delayAttack = async () => await delay(1500, 600);
export const delayGo = async () => await delay(700, 400);
export const delayInterface = async () => await delay(500, 300);
