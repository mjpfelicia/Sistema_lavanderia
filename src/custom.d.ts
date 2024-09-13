declare module "*.jpg";
declare module "*.png";
declare module "*.jpeg";
declare module "*.gif";
declare module '*.css' {
    const classes: { [key: string]: string };
    export default classes;
  }
  