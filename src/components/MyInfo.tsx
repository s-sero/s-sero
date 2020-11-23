import * as React from "react";
import {fromValue,formatDate} from "../common/utils";
import {Divider,message, Row, Col, Button, Input,Statistic,Descriptions} from 'antd'
import contract, {Detail, Info} from "../service/contract";
import * as config from "../service/config";
import i18n from "../i18n";
import copy from 'copy-text-to-clipboard'
interface Props {
    info:Info
    detail:Detail
    account:any
    setRefCode:(v:any)=>void;
    register:()=>void;
    reward:()=>void;
    reInvest:()=>void;
    doUpdate:()=>void;
}
console.log(contract.contract,"contract")
const MyInfo:React.FC<Props> = ({info,account,setRefCode,register,detail,reward,reInvest,doUpdate})=>{
    
    const {id,referrer,partnersCount,x3Income,x6Income,activeS3Levels,activeS6Levels,lastWithdrawTime,shareIncome,investAmount} = info;
    let maxLevel = 0;
    for(let i=0;i<12;i++){
        if(activeS3Levels[i] && activeS6Levels[i]){
            maxLevel = i+1;
        }
    }
    let value = "0.000";
    if(account && account.Balance){
        value = fromValue(account.Balance.get(config.useCoin),18).toFixed(3,1)
    }

    return <>
            <div className="foin">
            <div className="info">
                <div className="my-link text-center">
                    <div className="InviteUrl">
                        {/* <div className="text-center text-large text-bold">输入推荐码:</div> */}
                        <div>
                            {
                                id == 0 ? <div className="Input">
                                    <Input size="large" type="number" min={1} placeholder={i18n.t("inputCode")} onChange={(v:any)=>{
                                        setRefCode(v.target.value!!)
                                    }}/>
                                    <br/>
                                    <br/>
                                    <Button size="small" onClick={()=>register()} block type="primary">{i18n.t("register")}</Button>
                                </div>:<div>
                                    {i18n.t("referCode")}<br/>
                                    <div style={{display:"flex",justifyContent:"center"}} >
                                    <span>{id}</span>
                                    <span><img width="50%" src={require("../image/Copy.png")} onClick={()=>{
                                            copy(id.toString())
                                            message.success(i18n.t("copySuccess"))
                                         }} alt=""/> </span>
                                </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <Divider/>
                 <div className="text-center text-large">
                     <Descriptions title="推荐收益" column={2}>
                         <Descriptions.Item label="" span={3}><Statistic title={i18n.t("totalIncome")}  precision={3} value={x3Income.plus(x6Income).toFixed(3,1)} /></Descriptions.Item>
                         <Descriptions.Item label=""><Statistic title="X3收入" precision={3} value={x3Income.toFixed(3,1)} /></Descriptions.Item>
                         <Descriptions.Item label=""><Statistic title="X4收入" precision={3} value={x6Income.toFixed(3,1)} /></Descriptions.Item>
                     </Descriptions>
                     <Divider dashed/>
                     <Descriptions title="VIP收益" column={2}>
                         <Descriptions.Item label=""><Statistic title={"总投资额"}  value={investAmount.toNumber()} precision={3} /></Descriptions.Item>
                         <Descriptions.Item label=""><Statistic title={"预计总收益"}  value={maxLevel >= 9?investAmount.multipliedBy(2).toNumber():0} precision={3} /></Descriptions.Item>

                         <Descriptions.Item label=""><Statistic title="VIP级别"  value={maxLevel >= 9?maxLevel:0}/></Descriptions.Item>
                         <Descriptions.Item label=""><Statistic title="未返还收益" precision={3} value={maxLevel >= 9?investAmount.multipliedBy(2).minus(shareIncome).toNumber():0}/></Descriptions.Item>
                         <Descriptions.Item label=""><Statistic title="已提现收益" precision={3} value={info.shareIncome.toFixed(3,1)} suffix=""/></Descriptions.Item>
                         <Descriptions.Item label=""><Statistic title="可提现收益" precision={3} value={info.dayReward.toFixed(3,1)} suffix=""/></Descriptions.Item>

                     </Descriptions>
                     <Row>
                         <Col span={11}>
                             {
                                 maxLevel >= 9 && <Button size="small" type="primary" danger onClick={reInvest} block>复投</Button>
                             }
                         </Col>
                         <Col span={2}/>
                         <Col span={11}>
                             {
                                 info.dayReward.toNumber()>0 ? <Button size="small" type="primary" onClick={reward} block>提现</Button>:
                                     <Statistic.Countdown title="" value={((detail.dayIndex+1)*24*60*60-8*60*60)*1000} format="HH:mm:ss" onFinish={doUpdate} />
                             }
                         </Col>
                     </Row>
                     <Divider dashed/>
                     {/*<Descriptions title="奖池" column={1}>*/}
                     {/*    <Descriptions.Item label="">*/}
                     {/*        <Statistic suffix=""  value={detail.sharePool.toFixed(3,1)}/>*/}
                     {/*        /!*<Statistic.Countdown title="下次清算" value={((detail.dayIndex+1)*5*60-8*60*60)*1000} format="HH:mm:ss" />*!/*/}
                     {/*    </Descriptions.Item>*/}
                     {/*</Descriptions>*/}
                     {/*<Divider dashed/>*/}
                     <Descriptions title="VIP人数" column={4}>
                         <Descriptions.Item label=""><Statistic title="LEVEL9" suffix="人" value={detail.levelCountArr[8]}/></Descriptions.Item>
                         <Descriptions.Item label=""><Statistic title="LEVEL10" suffix="人"  value={detail.levelCountArr[9]}/></Descriptions.Item>
                         <Descriptions.Item label=""><Statistic title="LEVEL11" suffix="人"  value={detail.levelCountArr[10]}/></Descriptions.Item>
                         <Descriptions.Item label=""><Statistic title="LEVEL12" suffix="人"  value={detail.levelCountArr[11]}/></Descriptions.Item>
                     </Descriptions>
                     {/*<Descriptions title="我的分红" column={2}>*/}
                     {/*    */}
                     {/*</Descriptions>*/}
                </div>
                <Divider/>
                <div className="address text-center">
                     <div>{i18n.t("contractAddress")} &ensp;<img onClick={()=>{
                            copy(contract.contract.address)
                            message.success(i18n.t("copySuccess"))
                        }} src={require("../image/Copy.png")} width="12px"  alt=""/>
                    </div>
                    <div className="break" onClick={()=>{
                            copy(contract.contract.address)
                            message.success(i18n.t("copySuccess"))
                    }}>{contract.contract.address}</div>
                </div>
            </div>
        </div>
        {/* </div> */}
    </>
}

export default MyInfo