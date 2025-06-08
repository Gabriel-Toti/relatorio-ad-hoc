
export const get = (url: string) => fetch(url, {
    method: `GET`,
    headers: {
      'Content-Type': 'application/json',
    },
}).then((res) => res.json());
export const post = (body: any) => (url: string) =>
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then((res) => res.json());

