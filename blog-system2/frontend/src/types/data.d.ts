declare module "*.json" {
  const value: unknown;
  export default value;
}

declare module "*.md" {
  const content: string;
  export default content;
}
