import BigNumber from "bignumber.js";
import service from "../service/service";

const bs58 = require("bs58")

export function fromValue(v:BigNumber|number|string|undefined,n:number){
    if(v){
        return new BigNumber(v).dividedBy(new BigNumber(10).pow(n))
    }
    return new BigNumber(0)
}

export function toValue(v:BigNumber|number|string,n:number){
    return new BigNumber(v).multipliedBy(new BigNumber(10).pow(n))
}

export function ellipsis(v:string) {
    if(!v){
        return
    }
    return v.slice(0,5) + "..." +  v.slice(v.length-5);
}

export function toHex(value: string | BigNumber | number):string{
    return "0x"+new BigNumber(value).toString(16)
}


export function hexToString(v:string|number|BigNumber){
    if(!v){
        return "0";
    }
    return new BigNumber(v).toString(10)
}

export async function convertShotAddress(shotAddress:string){
    const rest:any = await service.rpc("sero_getFullAddress",[[shotAddress]]);
    return rest[shotAddress];
}
//
// export function convertResult(result: any) {
//     if (result instanceof Array) {
//         const resultArray: any = [];
//         result.forEach(function (res: any, i: any) {
//             if (isFinite(i))
//                 resultArray.push(res);
//         });
//         const convert = function (resultArray: any) {
//             return resultArray.map(function (res: any) {
//                 if (res.constructor.name === 'BN') {
//                     res = res.toString(10);
//                 } else if (res instanceof Array) {
//                     res = convert(res);
//                 }
//                 return res;
//             });
//         };
//         return convert(resultArray);
//     }
//     return result
// }
//
// export async function convertAddress(address:string){
//     const rest:any = await service.rpc("sero_getCode",[address,"latest"]);
//     if(rest){
//         // is contract address
//         let hexStr = bs58.decode(address).toString("hex");
//         const rightZeroStr = "0000000000000000000000000000000000000000000000000000000000000000";
//         const hex = "0x"+hexStr + rightZeroStr;
//
//         return bs58.encode(hexToBytes(hex))
//     }
//     return "";
// }
//
// export function hexToBytes(hex:string) {
//     hex = hex.replace(/^0x/i, '');
//     for (var bytes = [], c = 0; c < hex.length; c += 2)
//         bytes.push(parseInt(hex.substr(c, 2), 16));
//     return bytes;
// }



export function isPKr(address:string){
    const b = bs58.decode(address);
    if ( b.length != 96 ){
        return false;
    }
    return true;
}

export function formatDate(d:number) {
    return new Date(d).toLocaleDateString() + " "+ new Date(d).toLocaleTimeString()
}