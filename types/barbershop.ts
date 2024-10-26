export enum BarberRole {
  OWNER = "OWNER",
  BARBER = "BARBER",
}

export enum Role {
  CLIENT = "CLIENT",
  BARBER = "BARBER",
  ADMIN = "ADMIN",
}

export enum AppointmentStatus {
  SCHEDULED = "SCHEDULED",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  REFUNDED = "REFUNDED",
}

export enum AccessRequestStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum PlanType {
  BASIC = "BASIC",
  PROFESSIONAL = "PROFESSIONAL",
}

export interface User {
  id: string;
  email: string;
  username?: string;
  phone?: string;
  password: string;
  role: Role;
  resetToken?: string;
  resetTokenExpiry?: Date;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
  appointments: Appointment[];
  customers: Customer[];
  auditLogs: AuditLog[];
  barberProfiles: BarberProfile[];
  accessRequests: AccessRequest[];
  emailVerified: boolean;
  favoriteBarbershops: FavoriteBarbershop[];
  profileImageUrl?: string;
  subscriptions: Subscription[];
  stripeConnectedAccountId?: string;
}

export interface Barbershop {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  additionalInfo?: string;
  countryCode?: string;
  phoneNumber?: string;
  lat?: number;
  lng?: number;
  createdAt: Date;
  updatedAt: Date;
  customers: Customer[];
  appointments: Appointment[];
  barberProfiles: BarberProfile[];
  services: Service[];
  statistics: Statistic[];
  accessRequests: AccessRequest[];
  barbershopImages: BarbershopImage[];
  favoriteByUsers: FavoriteBarbershop[];
  invitations: Invitation[];
  stripeAccountId?: string;
}

export interface Invitation {
  id: string;
  barbershopId: string;
  barberEmail: string;
  token: string;
  status: AccessRequestStatus;
  createdAt: Date;
  updatedAt: Date;
  barbershop: Barbershop;
}

export interface FavoriteBarbershop {
  id: string;
  userId: string;
  barbershopId: string;
  createdAt: Date;
  user: User;
  barbershop: Barbershop;
}

export interface Customer {
  id: string;
  userId: string;
  barbershopId: string;
  firstVisitDate?: Date;
  lastVisitDate?: Date;
  totalSpent: number;
  appointmentCount: number;
  user: User;
  barbershop: Barbershop;
  appointments: Appointment[];
}

export interface BarberProfile {
  id: string;
  userId: string;
  barbershopId: string;
  role: BarberRole;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  barbershop: Barbershop;
  appointments: Appointment[];
  statistics: Statistic[];
}

export interface Service {
  id: string;
  serviceName: string;
  description: string;
  price: number;
  duration: number;
  createdAt: Date;
  updatedAt: Date;
  barbershopId: string;
  category?: string;
  isActive: boolean;
  deletedAt?: Date;
  appointments: AppointmentService[];
  barbershop: Barbershop;
}

export interface BarbershopImage {
  id: string;
  url: string;
  barbershopId: string;
  barbershop: Barbershop;
  createdAt: Date;
}

export interface Appointment {
  id: string;
  customerId?: string;
  clientId: string;
  barberProfileId: string;
  barbershopId: string;
  appointmentDate: Date;
  status: AppointmentStatus;
  barberProfile: BarberProfile;
  barbershop: Barbershop;
  customer?: Customer;
  client: User;
  services: AppointmentService[];
  payment?: Payment;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppointmentService {
  id: string;
  appointmentId: string;
  serviceId: string;
  appointment: Appointment;
  service: Service;
}

export interface Payment {
  id: string;
  appointmentId: string;
  amount: number;
  currency: string;
  paymentStatus: PaymentStatus;
  stripePaymentId: string;
  createdAt: Date;
  updatedAt: Date;
  appointment: Appointment;
}

export interface Statistic {
  id: string;
  barberProfileId: string;
  barbershopId: string;
  totalAppointments: number;
  totalIncome: number;
  averageRating: number;
  totalReviews: number;
  createdAt: Date;
  updatedAt: Date;
  barberProfile: BarberProfile;
  barbershop: Barbershop;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  changes: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
}

export interface AccessRequest {
  id: string;
  barbershopId: string;
  userId: string;
  status: AccessRequestStatus;
  createdAt: Date;
  updatedAt: Date;
  barbershop: Barbershop;
  user: User;
}

export interface Subscription {
  id: string;
  userId: string;
  stripePriceId: string;
  planType: PlanType;
  status: string;
  startDate: Date;
  endDate?: Date;
  user: User;
}
