export interface Deployment {
    project: string;
    build: number;
    action?: string;
    region: "eu-west-1";
}
export interface Action {
    action: string;
    path: string;
    compress: string;
}
