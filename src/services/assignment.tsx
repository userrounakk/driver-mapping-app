"use server";

import { BASE_URL } from "@/const/const";

const baseUrl = BASE_URL + "/assignment";

async function sendResponse(response: any) {
  if (response.ok) {
    const res = await response.json();
    console.log("[RESPONSE] -->", res);
    return {
      error: false,
      response: res,
    };
  }
  if (!response.ok) {
    const error = await response.json();
    console.log("[ERROR] -->", error);
    return {
      error: true,
      status: response.status,
      message: error,
    };
  }
}

export async function createAssignment(token: string, data: string) {
  try {
    const response = await fetch(`${baseUrl}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `${token}`,
      },
      body: data,
    });
    return await sendResponse(response);
  } catch (error: any) {
    console.log("Error =>", error);
    return {
      error: true,
      status: 500,
      message: error.message,
    };
  }
}

export const search = async (token: string, query: string): Promise<any> => {
  try {
    const response = await fetch(`${baseUrl}/search?model=${query}`, {
      method: "GET",
      headers: {
        authorization: `${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    return await sendResponse(response);
  } catch (error: any) {
    console.log("Error =>", error);
    return {
      error: true,
      status: 500,
      message: error.message,
    };
  }
};

export const getAssignment = async (
  token: string,
  page: number = 1
): Promise<any> => {
  try {
    const response = await fetch(`${baseUrl}/driver/list?page=`, {
      method: "GET",
      headers: {
        authorization: `${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    return await sendResponse(response);
  } catch (error: any) {
    console.log("Error =>", error);
    return {
      error: true,
      status: 500,
      message: error.message,
    };
  }
};

export const assign = async (token: string, id: string): Promise<any> => {
  try {
    const response = await fetch(`${baseUrl}/assign/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `${token}`,
      },
    });
    return await sendResponse(response);
  } catch (error: any) {
    console.log("Error =>", error);
    return {
      error: true,
      status: 500,
      message: error.message,
    };
  }
};
export const reject = async (token: string, id: string): Promise<any> => {
  try {
    const response = await fetch(`${baseUrl}/reject/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `${token}`,
      },
    });
    return await sendResponse(response);
  } catch (error: any) {
    console.log("Error =>", error);
    return {
      error: true,
      status: 500,
      message: error.message,
    };
  }
};

export const getDrivers = async (
  token: string,
  coordinates: any,
  radius: number = 10
): Promise<any> => {
  try {
    console.log(coordinates);

    const response = await fetch(`${baseUrl}/drivers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `${token}`,
      },
      body: JSON.stringify({
        lat: coordinates.lat,
        lng: coordinates.lng,
        radius,
      }),
    });
    return await sendResponse(response);
  } catch (error: any) {
    console.log("Error =>", error);
    return {
      error: true,
      status: 500,
      message: error.message,
    };
  }
};
