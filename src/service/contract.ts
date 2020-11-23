import * as config from './config'
import service from "./service";
import BigNumber from "bignumber.js";
import * as utils from "../common/utils";
import {fromValue} from "../common/utils";

const serojs = require("serojs")
const seropp = require("sero-pp")

export interface Params {
    from?: string
    to: string
    cy?: string
    value?: string
    gas?: string
    gasPrice?: string
    data?: string
    gas_price?:any
}

export interface Info {
    id: number
    referrer: string
    partnersCount: number
    x3Income:BigNumber
    x6Income:BigNumber
    activeS3Levels:Array<boolean>
    activeS6Levels:Array<boolean>
    dayReward:BigNumber
    lastWithdrawTime:number
    shareIncome:BigNumber
    investAmount:BigNumber
}

export interface Detail {
    lastId:any
    total:BigNumber
    balance:BigNumber
    cy:string
    dayIndex:number
    sharePool:BigNumber
    // levelAmountArr:Array<BigNumber>
    totalShare:BigNumber
    levelCountArr:Array<number>
}

export interface X3 {
    currentReferrer: string
    referrals: Array<string>
    blocked: boolean
    reinvestCount: any
    partnersCount: any
    isExtraDividends:boolean
    placeArr:Array<any>;
    placeSource:Array<any>;
}

export interface X6 {
    currentReferrer: string
    firstLevelReferrals: Array<string>
    secondLevelReferrals: Array<string>
    blocked: boolean
    closedPart: string
    reinvestCount: any
    partnersCount: any
    isExtraDividends:boolean
    placeArr:Array<any>;
    placeSource:Array<any>;
}

class Contract {

    contract: any;

    constructor() {
        this.contract = serojs.callContract(config.abi, config.address)

    }

    async info(mainPKr:string):Promise<Info>{
        const data:any = await this.call("info",[],mainPKr)
        const rest = data[0];
        console.log("info >>>>",rest);

        return {
            id: rest[0],
            referrer: rest[1],
            partnersCount: rest[2],
            x3Income:fromValue(rest[3],18),
            x6Income:fromValue(rest[4],18),
            activeS3Levels:rest[5],
            activeS6Levels:rest[6],
            dayReward:fromValue(rest[7],18),
            lastWithdrawTime:rest[8],
            shareIncome:fromValue(rest[9],18),
            investAmount:fromValue(rest[10],18),
        }
    }

    async detail(mainPKr:string):Promise<Detail>{
        const data:any = await this.call("detail",[],mainPKr)
        const rest = data[0];
        console.log("detail>>>>",rest);
        return {
            lastId: rest[0],
            total: fromValue(rest[1],18),
            balance: fromValue(rest[2],18),
            cy:rest[3],
            dayIndex:parseInt(rest[4]),
            sharePool:fromValue(rest[5],18),
            // levelAmountArr:rest[6].map((v:any)=>{
            //     return fromValue(v,18)
            // }),
            totalShare:fromValue(rest[6],18),
            levelCountArr:rest[7]
        }
    }

    async triggerPool(account:any):Promise<string>{
        return await this.execute("triggerPool",[],account,"SERO","0x0");
    }

    async withdrawShare(account:any):Promise<string>{
        return await this.execute("withdrawShare",[],account,"SERO","0x0");
    }

    async reInvest(account:any,value:BigNumber):Promise<string>{
        return await this.execute("reInvest",[],account,"SERO",utils.toHex(value));
    }
    async idToAddress(userId:number,mainPKr:string):Promise<string>{
        return await this.call("idToAddress",[userId],mainPKr)
    }

    async usersActiveX3Levels(mainPKr:string,level:number):Promise<boolean>{
        const rest:any = await this.call("usersActiveX3Levels",[mainPKr,level],mainPKr)
        return rest[0]
    }

    async isUserExists(mainPKr:string):Promise<boolean>{
        const rest:any= await this.call("isUserExists",[mainPKr],mainPKr)
        return rest[0]
    }

    async usersActiveX6Levels(mainPKr:string,level:number):Promise<boolean>{
        const rest:any = await this.call("usersActiveX6Levels",[mainPKr,level],mainPKr)
        return rest[0]
    }

    async usersX3Matrix(mainPKr:string,level:number):Promise<X3>{
        const rest:any = await this.call("usersX3Matrix",[mainPKr,level],mainPKr)
        return {
            currentReferrer:rest[0],
            referrals:rest[1],
            blocked:rest[2],
            reinvestCount: rest[3],
            partnersCount: rest[4],
            isExtraDividends:rest[5],
            placeArr:rest[6],
            placeSource:rest[7],
        }
    }

    async usersX6Matrix(mainPKr:string,level:number):Promise<X6>{
        const rest:any = await this.call("usersX6Matrix",[mainPKr,level],mainPKr)
        return {
            currentReferrer:rest[0],
            firstLevelReferrals:rest[1],
            secondLevelReferrals:rest[2],
            blocked:rest[3],
            closedPart:rest[4],
            reinvestCount: rest[5],
            partnersCount: rest[6],
            isExtraDividends:rest[7],
            placeArr:rest[8],
            placeSource:rest[9]
        }
    }

    async activeMatrix(account:any,type:number,level:number):Promise<string>{
        const hash:any = await this.execute("buyNewLevel",[type,level],account,config.useCoin,"0x"+utils.toValue(config.levelPrice*2**(level-1),18).toString(16))
        return hash;
    }


    async registrationExt(account:any,code:number):Promise<string>{
        const rest:any = await this.idToAddress(code,account.MainPKr);
        const pkr:any = await utils.convertShotAddress(rest[0])
        const hash:any = await this.execute("registrationExt",[pkr],account,config.useCoin,"0x"+utils.toValue(config.levelPrice*2,18).toString(16))
        return hash;
    }

    async reward(account:any):Promise<string>{
        const hash:any = await this.execute("reward",[],account,config.useCoin,"0x0")
        return hash;
    }

    async call(method: string, args: Array<any>, from: string): Promise<any> {
        const packData: any = this.contract.packData(method, args, true)
        const contract = this.contract;
        return new Promise((resolve, reject) => {
            const params: Params = {
                to: this.contract.address
            }
            params.from = from
            params.data = packData;

            service.rpc("sero_call", [params, "latest"]).then(data => {
                if (data != "0x") {
                    const rest: any = contract.unPackDataEx(method, data)
                    resolve(rest)
                } else {
                    // alert(alertmethod+"---"+data);
                }
            }).catch(err => {
                reject(err)
            })

        })
    }

    async execute(method: string, args: Array<any>, account: any, cy?: string, value?: string): Promise<any> {
        const packData: any = this.contract.packData(method, args, true)

        return new Promise((resolve, reject) => {
            const params: Params = {
                to: this.contract.address,
                gas_price: "0x" + new BigNumber("1000000000").toString(16),
            }
            params.from = account.MainPKr
            params.data = packData;
            if (cy) {
                params.cy = cy;
            }
            if (value) {
                params.value = value;
            }
            service.rpc("sero_estimateGas", [params]).then((data: any) => {
                params.gas = "0x"+new BigNumber(data*2).toFixed(0);
                params.from = account.PK
                seropp.executeContract(params, function (hash: any, err: any) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(hash)
                    }
                })
            }).catch(e => {
                reject(e)
            })
        })
    }
}

const contract = new Contract();

export default contract