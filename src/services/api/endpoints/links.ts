import { fetchWithAuth } from "../client";
import type { Link } from "../../../types";
import type { CreateLinkRequest, CreateLinkResponse } from "../types";

export const getLinks = async (): Promise<Link[]> => {
  return fetchWithAuth<Link[]>("/api/links", { method: "GET" });
};

export const createLink = async (
  data: CreateLinkRequest
): Promise<CreateLinkResponse> => {
  return fetchWithAuth<CreateLinkResponse>("/api/links", {
    method: "POST",
    body: data,
  });
};