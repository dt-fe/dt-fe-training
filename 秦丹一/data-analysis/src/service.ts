
async function request(url: string) {
  const response = await fetch(url);
  return response.json();
}

export async function getName() {
  const url = `http://120.26.194.171:3000/v1/trade/overall`;
  return request(url)
}

export async function getTrend(id: string, time: string[]) {
  const url = `http://120.26.194.171:3000/v1/trade/overall/${id}?startTime=${time[0]}&endTime=${time[1]}`;
  return request(url)
}
export async function getCategoryData(time: string[]) {
  const url = `http://120.26.194.171:3000/v1/trade/category?startTime=${time[0]}&endTime=${time[1]}`;
  return request(url)
}




