import create from 'zustand';

type Step = {};

type StepsState = {
  steps: Step[];
  setSteps: (steps: Step[]) => void;
};

const useSteps = create<StepsState>(set => ({
  steps: [],
  setSteps(steps) {
    set({ steps });
  },
}));
