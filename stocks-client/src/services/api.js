import axios from "axios";
const API = process.env.REACT_APP_API_BASE || "http://localhost:5001";

export async function getIntraday(symbol) {
  const res = await axios.get(`${API}/api/stocks/${symbol}/intraday`);
  return res.data?.data ?? [];
}


