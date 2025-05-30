export type Hello = {
  message: string
};

export type Error = {
  type: string;
  message: string | Record<string, string>;
}
