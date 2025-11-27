
export type UserRole = 'OP' | 'SALES';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
}

export enum ResourceStatus {
  SEARCHING = 'SEARCHING',
  PROPOSED = 'PROPOSED', // Added for intermediate state
  CONFIRMED = 'CONFIRMED',
  ISSUE = 'ISSUE',
}

export enum ResourceType {
  HOTEL = 'HOTEL',
  RESTAURANT = 'RESTAURANT',
}

export type MealType = 'LUNCH' | 'DINNER';

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  content: string;
  timestamp: number;
}

export interface HistoryEntry {
  id: string;
  userId: string;
  userName: string;
  field: string;
  oldValue: string;
  newValue: string;
  timestamp: number;
}

export interface Resource {
  id: string;
  tourId: string;
  type: ResourceType;
  date: string; // YYYY-MM-DD
  name: string;
  address: string;
  status: ResourceStatus;
  assignedTo: string; // User ID
  dueDate?: string; // ISO Date string
  
  // Confirmation Flags
  isOpConfirmed?: boolean;
  isSalesConfirmed?: boolean;

  // Hotel Specifics
  priceTwin?: number;
  priceSingle?: number;
  priceTriple?: number;
  amenities?: string[];
  hasElevator?: boolean;
  hasAC?: boolean;
  hasParking?: boolean;
  cancellationDeadline?: string; // 免取时间

  // Restaurant Specifics
  mealType?: MealType;
  avgPrice?: number;
  menuLink?: string;
  cuisineType?: string;

  comments: Comment[];
  history: HistoryEntry[];
  lastUpdated: number;
}

export interface Tour {
  id: string;
  code: string; // e.g., "2025-11-01"
  name: string;
  startDate: string;
  duration: number; // Number of days
  resources: Resource[];
}

export interface Notification {
  id: string;
  resourceId: string;
  tourId: string;
  message: string;
  timestamp: number;
  read: boolean;
}
