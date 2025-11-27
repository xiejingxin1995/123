
export type UserRole = 'OP' | 'SALES';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  content: string;
  timestamp: number;
}

export interface HistoryItem {
  id: string;
  userId: string;
  userName: string;
  field: string;
  oldValue: string | number | boolean | null;
  newValue: string | number | boolean | null;
  timestamp: number;
}

export enum ResourceType {
  HOTEL = 'HOTEL',
  RESTAURANT = 'RESTAURANT',
}

export enum ResourceStatus {
  SEARCHING = 'SEARCHING',   // Yellow
  PROPOSED = 'PROPOSED',     // Blue
  CONFIRMED = 'CONFIRMED',   // Green (Requires Double Confirmation)
  ISSUE = 'ISSUE',           // Red
}

export type MealType = 'LUNCH' | 'DINNER';

export interface Resource {
  id: string;
  tourId: string;
  type: ResourceType;
  date: string; // YYYY-MM-DD
  name: string;
  address: string;
  status: ResourceStatus;
  assignedTo: string; // User ID of OP
  dueDate?: string;
  
  // Hotel Specifics
  priceTwin?: number;
  priceSingle?: number;
  priceTriple?: number;
  amenities?: string[];
  hasElevator?: boolean;
  hasAC?: boolean;
  hasParking?: boolean;
  cancellationDeadline?: string; // ISO String

  // Restaurant Specifics
  mealType?: MealType;
  avgPrice?: number;
  menuLink?: string;
  cuisineType?: string;

  // Confirmation Workflow
  isOpConfirmed: boolean;
  isSalesConfirmed: boolean;

  comments: Comment[];
  history: HistoryItem[];
  lastUpdated: number;
}

export interface Tour {
  id: string;
  code: string; // e.g. #2025-11-01
  name: string;
  startDate: string;
  duration: number; // Days
  resources: Resource[];
}

export interface Notification {
  id: string;
  tourId: string;
  resourceId: string;
  message: string;
  timestamp: number;
  read: boolean;
}
