import API from "./api";

export const addToFavorites = async (jobId) => {
  const res = await API.post("/favorites/", { job_id: jobId });
  return res.data;
};

export const removeFromFavorites = async (jobId) => {
  const res = await API.delete(`/favorites/${jobId}`);
  return res.data;
};

export const getFavorites = async () => {
  const res = await API.get("/favorites/");
  return res.data;
};

export const checkFavorite = async (jobId) => {
  const res = await API.get(`/favorites/check/${jobId}`);
  return res.data;
};
