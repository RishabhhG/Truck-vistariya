export const HOST = import.meta.env.VITE_SERVER_URL;
export const AUTH_ROUTE = "api/auth";

export const SIGNUP_ROUTE = `${AUTH_ROUTE}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTE}/signin`;

//Logout route not written
export const LOG_OUT = `${AUTH_ROUTE}/`;

export const CLIENT_ROUTE = "api/client";
export const CREATE_CLIENT = `${CLIENT_ROUTE}/`;
export const GET_ALL_CLIENTS = `${CLIENT_ROUTE}/`;
export const GET_CLIENT_BY_ID = `${CLIENT_ROUTE}/:client`;
export const UPDATE_CLIENT = `${CLIENT_ROUTE}/:client`;

export const SHIPMENT_ROUTE = "api/shipment";
export const CREATE_SHIPMENT = `${SHIPMENT_ROUTE}/`;
export const GET_ALL_SHIPMENTS = `${SHIPMENT_ROUTE}/`;
export const GET_SHIPMENT_BY_ID = `${SHIPMENT_ROUTE}/:shipmentId`;
export const UPDATE_SHIPMENT = `${SHIPMENT_ROUTE}/:shipmentId`;
export const DELETE_SHIPMENT = `${SHIPMENT_ROUTE}/:shipmentId`;

export const TRUCK_ROUTE = "api/truck";
export const CREATE_TRUCK = `${TRUCK_ROUTE}/`;
export const GET_ALL_TRUCKS = `${TRUCK_ROUTE}/`;
export const GET_AVAILABLE_TRUCK = `${TRUCK_ROUTE}/available`;
export const GET_MAINTENANCE_TRUCKS = `${TRUCK_ROUTE}/maintenance`;
export const GET_TRUCK_BY_FILTER = `${TRUCK_ROUTE}/filter`;
export const GET_TRUCK_BY_ID = `${TRUCK_ROUTE}/:truckId`;
export const UPDATE_TRUCK = `${TRUCK_ROUTE}/:truckId`;
export const DELETE_TRUCK = `${TRUCK_ROUTE}/:truckId`;

export const DRIVER_ROUTE = `api/driver`;
export const CREATE_DRIVER = `${DRIVER_ROUTE}/`;
export const GET_AVAILABLE_DRIVERS = `${DRIVER_ROUTE}/available`;
export const GET_DRIVER_BY_ID = `${DRIVER_ROUTE}/:driverId`;
export const UPDATE_DRIVER = `${DRIVER_ROUTE}/:driverId`;
export const DELETE_DRIVER = `${DRIVER_ROUTE}/:driverId`;
export const GET_ALL_DRIVERS = `${DRIVER_ROUTE}/`;

export const BILLING_ROUTE = "api/billing";
export const CREATE_BILL = `${BILLING_ROUTE}/`;
export const GET_ALL_BILLS = `${BILLING_ROUTE}/`;
export const GET_BILL_BY_ID = `${BILLING_ROUTE}/:id`;
export const UPDATE_BILL = `${BILLING_ROUTE}/:id`;
export const DELETE_BILL = `${BILLING_ROUTE}/:id`;
export const UPDATE_BILL_STATUS = `${BILLING_ROUTE}/:id/payment-status`;
export const GET_OUTSTANDING_AMOUNT = `${BILLING_ROUTE}/outstanding/:clientId`;
export const GET_BILL_BY_PAYMENT_STATUS = `${BILLING_ROUTE}/status/:status`;
export const GET_BILL_BY_CLIENT = `${BILLING_ROUTE}/client/:clientId`;
export const BILL_OVERDUE = `${BILLING_ROUTE}/overdue`;
export const PAID_BILL = `${BILLING_ROUTE}/:id/mark-paid`;
