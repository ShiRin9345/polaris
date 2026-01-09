import { showMinimap } from "@replit/codemirror-minimap";

const createMinimap = () => {
  const dom = document.createElement("div");
  return { dom };
};

export const minimap = () => [
  showMinimap.compute(["doc"], (state) => {
    if (state.doc.lines < 10) return null;
    return {
      create: createMinimap,
    };
  }),
];
