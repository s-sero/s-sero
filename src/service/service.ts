import axios from 'axios'
import * as config from './config'
import i18n from '../i18n'
const seropp= require("sero-pp")


class Service {

    id:number

    constructor(){
        this.id = 0;
    }

    async rpc(method:string, args:any){
        let host = localStorage.getItem("host");
        if(!host){
            await this.initDApp();
            host = localStorage.getItem("host");
        }
        const data: any = {
            id: this.id++,
            method: method,
            params: args
        }
        return new Promise((resolve, reject) => {
            if(!host){
                reject(new Error("rpc unset !"))
            }else{
                axios.post(host, data).then((resp: any) => {
                    if(resp.data && resp.data.error){
                        reject(resp.data.error.message)
                    }else if(resp.data && resp.data.result){
                        resolve(resp.data.result)
                    }
                }).catch(e => {
                    reject(e)
                })
            }
        })
    }

    async accountList(){
        return new Promise((resolve, reject) => {
            seropp.getAccountList(function (data:any,err:any) {
                if(err){
                    reject(err)
                }else{
                    resolve(data)
                }
            })
        })
    }

    async accountDetail(pk:string){
        return new Promise((resolve, reject) => {
            seropp.getAccountDetail(pk,function (data:any,err:any) {
                if(err){
                    reject(err)
                }else{
                    resolve(data)
                }
            })
        })
    }

    async initDApp(){
        const dapp = {
            name: "S-SERO",
            contractAddress: config.address,
            github: "https://github.com/",
            author: "S-SERO",
            url: window.location.origin+window.location.pathname,
            logo: window.location.origin+window.location.pathname +require("../image/logo2.png"),

            barColor:"#01011c",
            navColor:"#000",
            barMode:"dark",
            navMode:"dark"
        }
        seropp.init(dapp,function (rest:any,err:any) {

            return new Promise((resolve,reject)=>{
                if(err){
                    reject(err)
                }else{
                    seropp.getInfo(function (data:any) {
                        if(data){
                            localStorage.setItem("language",data.language);
                            localStorage.setItem("host",data.rpc)
                            i18n.changeLanguage(data.language).then(() => {
                            });
                        }

                        resolve()
                    })
                }
            })
        });

    }

}
const service = new Service();


export default service