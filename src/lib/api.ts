import axios, { AxiosResponse } from "axios";

const api = axios.create({
  baseURL: "http://localhost:5252/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {

  const requireAuth = config.headers?.["requireAuth"];
  if (requireAuth) {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers!["Authorization"] = `Bearer ${token}`;
    }
    delete (config.headers as any).requireAuth;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error || error.message || "Sunucu hatası";
    return Promise.reject(new Error(message));
  }
);

export interface City {
  city_id: string;
  city_name: string;
}

export interface Flight {
  flight_id: string;
  from_city_id: string;
  to_city_id: string;
  departure_time: string;
  arrival_time: string;
  price: number;
  seats_total: number;
  seats_available: number;
}

export interface Ticket {
  ticket_id: string;
  passenger_name: string;
  passenger_surname: string;
  passenger_email: string;
  flight_id: string;
  seat_number: string | null;
  flight?: Flight;
}

export async function getAllCities(): Promise<City[]> {
  const res: AxiosResponse<City[]> = await api.get("/city");
  return res.data;
}

export async function getCityById(id: string): Promise<City> {
  const res: AxiosResponse<City> = await api.get(`/city/${id}`);
  return res.data;
}

export async function createCity(payload: {
  city_id: string;
  city_name: string;
}): Promise<City> {
  const res: AxiosResponse<City> = await api.post("/city", payload, {
    headers: { requireAuth: "true" },
  });
  return res.data;
}

export async function updateCity(
  id: string,
  payload: { city_name: string }
): Promise<City> {
  const res: AxiosResponse<City> = await api.put(`/city/${id}`, payload, {
    headers: { requireAuth: "true" },
  });
  return res.data;
}

export async function deleteCity(id: string): Promise<void> {
  await api.delete(`/city/${id}`, {
    headers: { requireAuth: "true" },
  });
}


export async function getAllFlights(): Promise<Flight[]> {
  const res: AxiosResponse<Flight[]> = await api.get("/flight");
  return res.data;
}

export async function getFlightById(id: string): Promise<Flight> {
  const res: AxiosResponse<Flight> = await api.get(`/flight/${id}`);
  return res.data;
}

export async function createFlight(payload: {
  flight_id: string;
  from_city_id: string;
  to_city_id: string;
  departure_time: string;
  arrival_time: string;
  price: number;
  seats_total: number;
  seats_available: number;
}): Promise<Flight> {
  const res: AxiosResponse<Flight> = await api.post("/flight", payload, {
    headers: { requireAuth: "true" },
  });
  return res.data;
}

export async function updateFlight(
  id: string,
  payload: {
    from_city_id: string;
    to_city_id: string;
    departure_time: string;
    arrival_time: string;
    price: number;
    seats_total: number;
    seats_available: number;
  }
): Promise<Flight> {
  const res: AxiosResponse<Flight> = await api.put(`/flight/${id}`, payload, {
    headers: { requireAuth: "true" },
  });
  return res.data;
}

export async function deleteFlight(id: string): Promise<void> {
  await api.delete(`/flight/${id}`, {
    headers: { requireAuth: "true" },
  });
}


export async function getAllTickets(): Promise<Ticket[]> {
  const res: AxiosResponse<Ticket[]> = await api.get("/ticket", {
    headers: { requireAuth: "true" },
  });
  return res.data;
}

export async function getTicketsByEmail(email: string): Promise<Ticket[]> {
  const res: AxiosResponse<Ticket[]> = await api.get(`/ticket/${email}`);
  return res.data;
}

export async function bookTicket(payload: {
  passenger_name: string;
  passenger_surname: string;
  passenger_email: string;
  flight_id: string;
  seat_number?: string;
}): Promise<Ticket> {
  const res: AxiosResponse<Ticket> = await api.post("/ticket", payload);
  return res.data;
}


export async function registerAdmin(payload: {
  username: string;
  password: string;
}): Promise<{ id: number; username: string; token: string }> {
  const res: AxiosResponse<{ id: number; username: string; token: string }> =
    await api.post("/admin/register", payload);
  return res.data;
}

export async function loginAdmin(payload: {
  username: string;
  password: string;
}): Promise<{ message: string; token: string }> {
  const res: AxiosResponse<{ message: string; token: string }> =
    await api.post("/admin/login", payload);
  return res.data;
}
