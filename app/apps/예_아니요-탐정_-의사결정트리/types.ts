export interface Attribute {
  key: string;
  label: string;
}

export interface GameItem {
  id: string;
  name: string;
  emoji: string;
  type: string; // The class label (e.g., 'Mammal', 'Bird')
  attributes: Record<string, boolean>;
}

export interface Dataset {
  id: string;
  name: string;
  description: string;
  items: GameItem[];
  questions: Attribute[];
}

export interface TreeNodeData {
  id: string;
  items: GameItem[];
  filterAttribute?: string; // If undefined, it's a leaf (or undecided)
  yesChild?: TreeNodeData;
  noChild?: TreeNodeData;
  parentId?: string;
  isPure: boolean;
}
