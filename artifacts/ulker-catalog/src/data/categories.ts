export interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
  color: string;
  bgColor: string;
}

export const categoryData: Category[] = [
  {
    id: "biscuits",
    name: "Biscuits",
    description: "Classic baked biscuits — from delicate ring-shaped to hearty sandwich varieties.",
    productCount: 5,
    color: "#6B1A2A",
    bgColor: "#F5E6D3",
  },
  {
    id: "chocolate",
    name: "Chocolate",
    description: "Premium chocolate bars and tablets — from silky milk chocolate to intense 70% dark.",
    productCount: 4,
    color: "#3D1A00",
    bgColor: "#F0DFC8",
  },
  {
    id: "wafer",
    name: "Wafer",
    description: "Light, crispy wafer creations filled with hazelnut, vanilla, and cocoa creams.",
    productCount: 4,
    color: "#5C3317",
    bgColor: "#E8D5BE",
  },
  {
    id: "cookies",
    name: "Cookies",
    description: "Indulgent butter cookies and wholesome oat varieties for every preference.",
    productCount: 2,
    color: "#7A5230",
    bgColor: "#DDBC60",
  },
  {
    id: "cake",
    name: "Cake",
    description: "Soft individual cakes and elegant Swiss rolls — the comfort of home baking.",
    productCount: 2,
    color: "#8B3A3A",
    bgColor: "#FAF0D7",
  },
  {
    id: "crackers",
    name: "Crackers",
    description: "Savoury, thin baked crackers — cheddar, sesame, and more.",
    productCount: 2,
    color: "#5A4A1A",
    bgColor: "#F0E8C8",
  },
  {
    id: "candy",
    name: "Candy",
    description: "Playful, fruit-flavoured gummies and chews — a burst of colour and joy.",
    productCount: 2,
    color: "#8B1A3A",
    bgColor: "#FFE8F0",
  },
  {
    id: "snacks",
    name: "Snacks",
    description: "Modern snack crackers inspired by Turkish culinary traditions.",
    productCount: 2,
    color: "#3A6B2A",
    bgColor: "#E8F0D8",
  },
];
