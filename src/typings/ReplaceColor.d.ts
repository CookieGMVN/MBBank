declare module "replace-color" {
    import Jimp from "jimp";

    export default function replaceColor(data: replaceData): Promise<Jimp>;

    interface replaceData {
        image: string | Buffer | object,
        colors: {
            type: string,
            targetColor: string | Array<string>,
            replaceColor: string | Array<string>,
        },
        formula?: string,
        deltaE?: number,
        callback?: CallableFunction
    }
}