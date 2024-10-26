export interface Barbershop {
  barbershopId: string;
  barbershopName: string;
  barbershopAddress: string;
  barbershopCity: string;
  barbershopState: string;
  barbershopZipCode: string;
  barbershopLatitude: number;
  barbershopLongitude: number;
  userRole: string;
  barberProfiles: {
    userId: string;
    barberRole: string;
    barberName: string;
    userName: string;
  }[];
  barbershopImages: string[];
}
