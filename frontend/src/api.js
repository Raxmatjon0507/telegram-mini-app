import { API_URL } from "./config.js";

function getInitData() {
  if (window.Telegram && window.Telegram.WebApp) {
    return window.Telegram.WebApp.initData || "";
  }
  return "";
}

export async function api(method, path, body = null) {
  const headers = {
    "Content-Type": "application/json",
  };
  const initData = getInitData();
  if (initData) {
    headers["Authorization"] = `Bearer ${initData}`;
  }

  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${API_URL}${path}`, opts);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "API error");
  return data;
}
